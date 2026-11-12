const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Allocation = require("../models/Allocation");
const calculateWeightedScore = require("../utils/weightedScore");

const skillName = (skill) => typeof skill === "string" ? skill : skill?.name;
const skillLevel = (skill) => Math.max(1, Math.min(5, Number(skill?.proficiency || skill?.level || 3)));

exports.getRecommendations = async (req, res) => {
  try {
    const { projectId, weights: requestedWeights } = req.body || {};
    if (!projectId || !require("mongoose").isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, message: "A valid projectId is required" });
    }
    const project = await Project.findOne({ _id: projectId, companyId: req.companyId });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const [employees, allocations] = await Promise.all([
      Employee.find({ companyId: req.companyId, availability: "available" }).lean(),
      Allocation.find({ companyId: req.companyId, status: { $in: ["pending", "approved"] } }).select("employee project status startDate endDate").lean()
    ]);
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    const overlapsProjectWindow = (allocation) => new Date(allocation.startDate) <= projectEnd && new Date(allocation.endDate) >= projectStart;
    const approvedBusyIds = new Set(allocations.filter(a => a.status === "approved" && overlapsProjectWindow(a)).map(a => String(a.employee)));
    const pendingBusyIds = new Set(allocations.filter(a => a.status === "pending" && overlapsProjectWindow(a)).map(a => String(a.employee)));
    const candidates = employees.filter(e => !approvedBusyIds.has(String(e._id)) && (!pendingBusyIds.has(String(e._id)) || allocations.some(a => a.status === "pending" && String(a.employee) === String(e._id) && String(a.project) === String(project._id))));
    if (!candidates.length) return res.json({ success: true, recommendations: [] });

    const aiUrl = (process.env.AI_ENGINE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    const payload = {
      employees: candidates.map(e => ({
        employee_id: String(e._id),
        skills: Object.fromEntries((e.skills || []).map(s => [skillName(s), skillLevel(s)]).filter(([name]) => name)),
        experience_years: Number(e.experience || 0),
        available_hours_per_week: 40,
        current_workload_hours: 0,
        career_interests: e.careerInterests || []
      })),
      project: {
        project_id: String(project._id),
        required_skills: Object.fromEntries((project.requiredSkills || []).map(s => [skillName(s), skillLevel(s)]).filter(([name]) => name)),
        minimum_experience_years: Number(project.minExperience || 0),
        required_hours_per_week: 40,
        preferred_interests: project.preferredInterests || []
      }
    };
    if (!Object.keys(payload.project.required_skills).length) {
      return res.status(422).json({ success: false, message: "Project needs at least one required skill before matching" });
    }

    let response;
    try {
      response = await fetch(`${aiUrl}/api/v1/match`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000)
      });
    } catch (error) {
      return res.status(502).json({ success: false, message: "AI engine is unavailable. Start the FastAPI service on port 8000.", detail: error.message });
    }
    const result = await response.json();
    if (!response.ok) return res.status(response.status).json({ success: false, message: result.detail || "AI matching failed" });

    const employeeMap = new Map(candidates.map(e => [String(e._id), e]));
    const pending = new Set(allocations.filter(a => a.status === "pending" && String(a.project) === String(project._id)).map(a => String(a.employee)));
    const recommendations = result.recommendations.map(rec => {
      const employee = employeeMap.get(rec.employee_id);
      if (!employee) return null;
      const b = rec.score_breakdown || {};
      const weighted = calculateWeightedScore(b, requestedWeights || {}, Boolean(project.preferredInterests?.length));
      return {
        employee: {
          ...employee, id: String(employee._id), empCode: employee.employeeId, role: employee.designation,
          band: employee.band || "L4", experienceYears: employee.experience,
          availabilityStatus: "BENCH", skills: (employee.skills || []).map(s => typeof s === "string" ? { name: s, proficiency: 3 } : s)
        },
        aiMatchScore: weighted.score,
        scoreBreakdown: weighted.scoreBreakdown,
        aiExplanation: (rec.explanations || []).join(" "),
        matchingSkills: rec.matched_skills || [], missingSkills: rec.missing_skills || [],
        isPendingApproval: pending.has(rec.employee_id)
      };
    }).filter(Boolean);
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error("AI matching error:", error);
    res.status(500).json({ success: false, message: "Unable to generate recommendations", detail: error.message });
  }
};
