import { initialEmployees, initialProjects, initialAllocations } from "./mockData";

// Set to true to use rich mock state with localStorage persistence.
// Change to false to connect to Member 2's backend API!
const USE_MOCK = true;
const API_BASE_URL = "http://localhost:5000/api";

// Initialize localStorage if empty
const loadStorage = (key, fallback) => {
  const data = localStorage.getItem(`talentmatch_${key}`);
  if (!data) {
    localStorage.setItem(`talentmatch_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const saveStorage = (key, data) => {
  localStorage.setItem(`talentmatch_${key}`, JSON.stringify(data));
};

// ------------------------------------------------------------
// Built-in AI Matching & Explanation Engine (Client-side Fallback)
// ------------------------------------------------------------
export const calculateMatchScore = (employee, project) => {
  if (!employee || !project) return { score: 0, explanation: "", matchingSkills: [] };

  const reqSkills = project.requiredSkills || [];
  const empSkills = employee.skills || [];

  let matchedWeight = 0;
  let totalWeight = 0;
  const matchingSkills = [];

  reqSkills.forEach((req) => {
    const w = req.weight || 1;
    totalWeight += w;

    const found = empSkills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );

    if (found) {
      matchingSkills.push({
        name: found.name,
        empProficiency: found.proficiency,
        reqProficiency: req.minProficiency
      });
      // Ratio of proficiency up to 100%
      const profScore = Math.min(found.proficiency / (req.minProficiency || 1), 1.2);
      matchedWeight += w * Math.min(profScore, 1);
    }
  });

  const skillScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 60 : 0; // up to 60 pts

  // Experience fit: up to 25 pts
  const expRatio = Math.min((employee.experienceYears || 0) / (project.minExperienceYears || 1), 1.3);
  const expScore = Math.min(expRatio * 25, 25);

  // Career Interest alignment: up to 15 pts
  let interestBonus = 0;
  const projectKeywords = `${project.name} ${project.description}`.toLowerCase();
  (employee.careerInterests || []).forEach((interest) => {
    if (projectKeywords.includes(interest.toLowerCase().split(" ")[0])) {
      interestBonus += 7.5;
    }
  });
  interestBonus = Math.min(interestBonus, 15);

  const totalScore = Math.round(Math.min(skillScore + expScore + interestBonus, 100));

  // Dynamic AI Explanation Generator
  let explanation = "";
  if (totalScore >= 85) {
    explanation = `Outstanding fit! Matches ${matchingSkills.length}/${reqSkills.length} core technologies. Total experience (${employee.experienceYears}y) fulfills project minimum (${project.minExperienceYears}y). High alignment with career goals.`;
  } else if (totalScore >= 65) {
    explanation = `Strong candidate with solid foundations in ${matchingSkills.map(s => s.name).join(", ")}. Quick onboarding will bridge minor requirement gaps.`;
  } else {
    explanation = `Moderate candidate. Meets partial skills (${matchingSkills.length}/${reqSkills.length}), but requires mentorship on remaining requirements.`;
  }

  return {
    score: totalScore,
    explanation,
    matchingSkills
  };
};

// ------------------------------------------------------------
// API Service Interface (Matches Member 2's Endpoints)
// ------------------------------------------------------------
export const api = {
  // Check backend connectivity status
  async checkBackendHealth() {
    if (USE_MOCK) return { connected: false, mode: "MOCK_MODE" };
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return { connected: res.ok, mode: "LIVE_API" };
    } catch {
      return { connected: false, mode: "MOCK_FALLBACK" };
    }
  },

  // 1. Dashboard Stats
  async getDashboardStats() {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);
      const allocations = loadStorage("allocations", initialAllocations);

      const benchCount = employees.filter((e) => e.availabilityStatus === "BENCH").length;
      const allocatedCount = employees.filter((e) => e.availabilityStatus === "ALLOCATED").length;
      const pendingApprovals = allocations.filter((a) => a.status === "PENDING_APPROVAL").length;

      return {
        totalEmployees: employees.length,
        benchCount,
        allocatedCount,
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "OPEN").length,
        pendingApprovals
      };
    }
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    return res.json();
  },

  // 2. Employees API
  async getEmployees() {
    if (USE_MOCK) {
      return loadStorage("employees", initialEmployees);
    }
    const res = await fetch(`${API_BASE_URL}/employees`);
    return res.json();
  },

  async addEmployee(newEmployee) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const created = {
        ...newEmployee,
        id: `emp-${Date.now()}`,
        availabilityStatus: newEmployee.availabilityStatus || "BENCH",
        benchSince: newEmployee.availabilityStatus === "ALLOCATED" ? null : new Date().toISOString().split("T")[0],
        currentAllocations: []
      };
      employees.unshift(created);
      saveStorage("employees", employees);
      return created;
    }
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee)
    });
    return res.json();
  },

  // 3. Projects API
  async getProjects() {
    if (USE_MOCK) {
      return loadStorage("projects", initialProjects);
    }
    const res = await fetch(`${API_BASE_URL}/projects`);
    return res.json();
  },

  async addProject(newProject) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const created = {
        ...newProject,
        id: `proj-${Date.now()}`,
        allocatedCount: 0,
        status: "OPEN"
      };
      projects.unshift(created);
      saveStorage("projects", projects);
      return created;
    }
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject)
    });
    return res.json();
  },

  // 4. AI Recommendations API
  async getRecommendations(projectId) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const employees = loadStorage("employees", initialEmployees);
      const project = projects.find((p) => p.id === projectId);
      if (!project) return [];

      // Rank all bench employees
      const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
      const ranked = benchEmployees.map((emp) => {
        const match = calculateMatchScore(emp, project);
        return {
          employee: emp,
          aiMatchScore: match.score,
          aiExplanation: match.explanation,
          matchingSkills: match.matchingSkills
        };
      });

      // Sort descending by match score
      return ranked.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    }
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/recommendations`);
    return res.json();
  },

  // 5. Allocations & Approvals API
  async getAllocations() {
    if (USE_MOCK) {
      return loadStorage("allocations", initialAllocations);
    }
    const res = await fetch(`${API_BASE_URL}/allocations`);
    return res.json();
  },

  async proposeAllocation({ employeeId, projectId, aiMatchScore, aiExplanation }) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);
      const allocations = loadStorage("allocations", initialAllocations);

      const employee = employees.find((e) => e.id === employeeId);
      const project = projects.find((p) => p.id === projectId);

      const newAlloc = {
        id: `alloc-${Date.now()}`,
        employeeId,
        employeeName: employee?.name || "Unknown",
        employeeRole: employee?.role || "Engineer",
        projectId,
        projectName: project?.name || "Unknown Project",
        aiMatchScore,
        aiExplanation,
        status: "PENDING_APPROVAL",
        proposedAt: new Date().toISOString(),
        reviewedAt: null,
        managerNotes: ""
      };

      allocations.unshift(newAlloc);
      saveStorage("allocations", allocations);
      return newAlloc;
    }
    const res = await fetch(`${API_BASE_URL}/allocations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, projectId, aiMatchScore, aiExplanation })
    });
    return res.json();
  },

  // Manager Approval / Rejection endpoint
  async reviewAllocation(allocationId, decision, managerNotes = "") {
    if (USE_MOCK) {
      const allocations = loadStorage("allocations", initialAllocations);
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);

      const alloc = allocations.find((a) => a.id === allocationId);
      if (!alloc) throw new Error("Allocation not found");

      alloc.status = decision; // "APPROVED" or "REJECTED"
      alloc.reviewedAt = new Date().toISOString();
      alloc.managerNotes = managerNotes;

      // If Approved, update Employee availability & project team count
      if (decision === "APPROVED") {
        const emp = employees.find((e) => e.id === alloc.employeeId);
        if (emp) {
          emp.availabilityStatus = "ALLOCATED";
          emp.benchSince = null;
          if (!emp.currentAllocations.includes(alloc.projectId)) {
            emp.currentAllocations.push(alloc.projectId);
          }
        }

        const proj = projects.find((p) => p.id === alloc.projectId);
        if (proj) {
          proj.allocatedCount = (proj.allocatedCount || 0) + 1;
          if (proj.allocatedCount >= proj.teamSize) {
            proj.status = "FULFILLED";
          }
        }
      }

      saveStorage("allocations", allocations);
      saveStorage("employees", employees);
      saveStorage("projects", projects);

      return alloc;
    }

    const res = await fetch(`${API_BASE_URL}/allocations/${allocationId}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, managerNotes })
    });
    return res.json();
  }
};
