
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Allocation = require("../models/Allocation");
const calculateWeightedScore = require("../utils/weightedScore");

const skillName = (skill) =>
  typeof skill === "string" ? skill : skill?.name;

const skillLevel = (skill) =>
  Math.max(1, Math.min(5, Number(skill?.proficiency || skill?.level || 3)));

exports.getRecommendations = async (req, res) => {
  try {
    const { projectId, weights: requestedWeights } = req.body || {};

    if (!projectId || !mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "A valid projectId is required"
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      companyId: req.companyId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const [employees, allocations] = await Promise.all([
      Employee.find({
        companyId: req.companyId,
        availability: "available"
      }).lean(),

      Allocation.find({
        companyId: req.companyId,
        status: { $in: ["pending", "approved"] }
      })
        .select("employee project status startDate endDate allocationPercentage")
        .lean()
    ]);

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);

    const overlapsProjectWindow = (allocation) =>
      new Date(allocation.startDate) <= projectEnd &&
      new Date(allocation.endDate) >= projectStart;

    // Calculate committed capacity during the project period.
    const capacityMap = new Map();

    for (const allocation of allocations) {
      if (!overlapsProjectWindow(allocation)) continue;

      const employeeId = String(allocation.employee);
      const percentage = Math.max(
        0,
        Math.min(100, Number(allocation.allocationPercentage || 0))
      );

      capacityMap.set(
        employeeId,
        (capacityMap.get(employeeId) || 0) + percentage
      );
    }

    const remainingCapacity = (employeeId) => {
      const committed = capacityMap.get(String(employeeId)) || 0;
      return Math.max(0, 100 - Math.min(100, committed));
    };

    const candidates = employees.filter(
      (employee) => remainingCapacity(employee._id) > 0
    );

    if (!candidates.length) {
      return res.json({
        success: true,
        recommendations: [],
        message: "No employees with remaining capacity were found."
      });
    }

    console.log("AI matching:", {
      companyId: String(req.companyId),
      projectId: String(project._id),
      employeeCount: employees.length,
      candidateCount: candidates.length
    });

    const pending = new Set(
      allocations
        .filter(
          (allocation) =>
            allocation.status === "pending" &&
            String(allocation.project) === String(project._id)
        )
        .map((allocation) => String(allocation.employee))
    );

    const aiUrl = (
      process.env.AI_ENGINE_URL || "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    const payload = {
      employees: candidates.map((employee) => {
        const capacity = remainingCapacity(employee._id);

        return {
          employee_id: String(employee._id),
          skills: Object.fromEntries(
            (employee.skills || [])
              .map((skill) => [skillName(skill), skillLevel(skill)])
              .filter(([name]) => name)
          ),
          experience_years: Number(employee.experience || 0),
          available_hours_per_week: (40 * capacity) / 100,
          current_workload_hours: (40 * (100 - capacity)) / 100,
          career_interests: employee.careerInterests || []
        };
      }),

      project: {
        project_id: String(project._id),
        required_skills: Object.fromEntries(
          (project.requiredSkills || [])
            .map((skill) => [skillName(skill), skillLevel(skill)])
            .filter(([name]) => name)
        ),
        minimum_experience_years: Number(project.minExperience || 0),
        required_hours_per_week: 40,
        preferred_interests: project.preferredInterests || []
      }
    };

    if (!Object.keys(payload.project.required_skills).length) {
      return res.status(422).json({
        success: false,
        message: "Project needs at least one required skill before matching"
      });
    }

    let response;

    try {
      response = await fetch(`${aiUrl}/api/v1/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000)
      });
    } catch (error) {
      console.error("AI engine connection error:", error);

      return res.status(502).json({
        success: false,
        message: "Could not connect to the AI engine.",
        detail: error.message
      });
    }

    // Read the response safely instead of blindly parsing JSON.
    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (error) {
      console.error("AI engine returned non-JSON:", {
        url: `${aiUrl}/api/v1/match`,
        status: response.status,
        contentType: response.headers.get("content-type"),
        responsePreview: responseText.slice(0, 500)
      });

      return res.status(502).json({
        success: false,
        message: "AI engine returned an invalid response.",
        aiStatus: response.status,
        aiContentType: response.headers.get("content-type"),
        aiResponse: responseText.slice(0, 300)
      });
    }

    if (!response.ok) {
      console.error("AI engine error:", result);

      return res.status(502).json({
        success: false,
        message: result.detail || result.message || "AI matching failed",
        aiStatus: response.status
      });
    }

    if (!Array.isArray(result.recommendations)) {
      return res.status(502).json({
        success: false,
        message: "AI engine response is missing the recommendations array."
      });
    }

    const employeeMap = new Map(
      candidates.map((employee) => [String(employee._id), employee])
    );

    const recommendations = result.recommendations
      .map((rec) => {
        const employee = employeeMap.get(String(rec.employee_id));

        if (!employee) return null;

        const capacity = remainingCapacity(employee._id);
        const breakdown = rec.score_breakdown || {};

        const weighted = calculateWeightedScore(
          breakdown,
          requestedWeights || {},
          Boolean(project.preferredInterests?.length)
        );

        return {
          employee: {
            ...employee,
            id: String(employee._id),
            empCode: employee.employeeId,
            role: employee.designation,
            band: employee.band || "L4",
            experienceYears: employee.experience,
            availabilityStatus:
              capacity === 100 ? "BENCH" : "PARTIALLY_ALLOCATED",
            remainingCapacityPercentage: capacity,
            skills: (employee.skills || []).map((skill) =>
              typeof skill === "string"
                ? { name: skill, proficiency: 3 }
                : skill
            )
          },

          aiMatchScore: weighted.score,
          scoreBreakdown: weighted.scoreBreakdown,
          aiExplanation: (rec.explanations || []).join(" "),
          matchingSkills: rec.matched_skills || [],
          missingSkills: rec.missing_skills || [],
          isPendingApproval: pending.has(String(rec.employee_id))
        };
      })
      .filter(Boolean);

    console.log("AI recommendations returned:", recommendations.length);

    return res.json({
      success: true,
      recommendations,
      totalCandidates: candidates.length
    });

  } catch (error) {
    console.error("AI matching controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate recommendations",
      detail: error.message
    });
  }
};
