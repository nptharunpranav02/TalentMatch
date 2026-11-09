import { initialEmployees, initialProjects, initialAllocations } from "./mockData";

const USE_MOCK = true;
const API_BASE_URL = "http://localhost:5000/api";

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
// Candidate-to-Project Matching Logic
// ------------------------------------------------------------
export const calculateMatchScore = (employee, project) => {
  if (!employee || !project) return { score: 0, explanation: "", matchingSkills: [], missingSkills: [] };

  const reqSkills = project.requiredSkills || [];
  const empSkills = employee.skills || [];

  const matchingSkills = [];
  const missingSkills = [];

  let skillPoints = 0;
  reqSkills.forEach((req) => {
    const found = empSkills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );

    if (found) {
      matchingSkills.push({
        name: found.name,
        empProficiency: found.proficiency,
        reqProficiency: req.minProficiency
      });
      const ratio = Math.min(found.proficiency / (req.minProficiency || 1), 1.0);
      skillPoints += ratio;
    } else {
      missingSkills.push(req.name);
    }
  });

  const skillScore = reqSkills.length > 0 ? (skillPoints / reqSkills.length) * 60 : 0;

  // Experience comparison (up to 25 points)
  const expNeeded = project.minExperienceYears || 1;
  const expActual = employee.experienceYears || 0;
  const expScore = Math.min((expActual / expNeeded) * 25, 25);

  // Career Interest alignment (up to 15 points)
  let interestBonus = 0;
  const projectText = `${project.name} ${project.description}`.toLowerCase();
  (employee.careerInterests || []).forEach((interest) => {
    const word = interest.toLowerCase().split(" ")[0];
    if (word && projectText.includes(word)) {
      interestBonus += 7.5;
    }
  });
  interestBonus = Math.min(interestBonus, 15);

  const totalScore = Math.round(Math.min(skillScore + expScore + interestBonus, 100));

  // Clean, factual summary
  const matchedSkillNames = matchingSkills.map((s) => s.name).join(", ");
  const explanationParts = [];

  if (matchingSkills.length > 0) {
    explanationParts.push(`Matches ${matchingSkills.length} of ${reqSkills.length} skills (${matchedSkillNames})`);
  } else {
    explanationParts.push("No direct skill overlap");
  }

  if (expActual >= expNeeded) {
    explanationParts.push(`${expActual} yrs experience meets project requirement (${expNeeded} yrs)`);
  } else {
    explanationParts.push(`${expActual} yrs experience (project asks for ${expNeeded} yrs)`);
  }

  if (interestBonus > 0) {
    explanationParts.push("Aligned with stated career goals");
  }

  return {
    score: totalScore,
    explanation: explanationParts.join(" • "),
    matchingSkills,
    missingSkills
  };
};

export const api = {
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

  async getRecommendations(projectId) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const employees = loadStorage("employees", initialEmployees);
      const project = projects.find((p) => p.id === projectId);
      if (!project) return [];

      const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
      const ranked = benchEmployees.map((emp) => {
        const match = calculateMatchScore(emp, project);
        return {
          employee: emp,
          aiMatchScore: match.score,
          aiExplanation: match.explanation,
          matchingSkills: match.matchingSkills,
          missingSkills: match.missingSkills
        };
      });

      return ranked.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    }
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/recommendations`);
    return res.json();
  },

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

  async reviewAllocation(allocationId, decision, managerNotes = "") {
    if (USE_MOCK) {
      const allocations = loadStorage("allocations", initialAllocations);
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);

      const alloc = allocations.find((a) => a.id === allocationId);
      if (!alloc) throw new Error("Allocation not found");

      alloc.status = decision;
      alloc.reviewedAt = new Date().toISOString();
      alloc.managerNotes = managerNotes;

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
