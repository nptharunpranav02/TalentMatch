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
// Enterprise Candidate-to-Project Matching Engine
// Multi-factor explainable scoring decomposed into 3 dimensions
// ------------------------------------------------------------
export const calculateMatchScore = (employee, project, customWeights = { skillWeight: 60, experienceWeight: 25, interestWeight: 15 }) => {
  if (!employee || !project) {
    return {
      score: 0,
      scoreBreakdown: { technicalFit: 0, experienceFit: 0, aspirationFit: 0 },
      explanation: "",
      matchingSkills: [],
      missingSkills: []
    };
  }

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

  const technicalFit = reqSkills.length > 0
    ? Math.round((skillPoints / reqSkills.length) * customWeights.skillWeight)
    : 0;

  // Seniority & Experience Dimension
  const expNeeded = project.minExperienceYears || 1;
  const expActual = employee.experienceYears || 0;
  const experienceFit = Math.round(
    Math.min((expActual / expNeeded) * customWeights.experienceWeight, customWeights.experienceWeight)
  );

  // Career Aspiration & Domain Alignment Dimension
  let interestPoints = 0;
  const projectContext = `${project.name} ${project.description} ${project.domain || ""}`.toLowerCase();
  (employee.careerInterests || []).forEach((interest) => {
    const term = interest.toLowerCase().split(" ")[0];
    if (term && projectContext.includes(term)) {
      interestPoints += customWeights.interestWeight / 2;
    }
  });
  const aspirationFit = Math.round(Math.min(interestPoints, customWeights.interestWeight));

  const totalScore = Math.min(technicalFit + experienceFit + aspirationFit, 100);

  // Factual, senior engineering explanation
  const matchedSkillNames = matchingSkills.map((s) => s.name).join(", ");
  const explanationParts = [];

  if (matchingSkills.length > 0) {
    explanationParts.push(`Coverage: ${matchingSkills.length}/${reqSkills.length} core competencies (${matchedSkillNames})`);
  } else {
    explanationParts.push("No direct skill overlap");
  }

  if (expActual >= expNeeded) {
    explanationParts.push(`${expActual}y verified tenure meets ${expNeeded}y minimum`);
  } else {
    explanationParts.push(`${expActual}y tenure (project seeks ${expNeeded}y)`);
  }

  if (employee.certifications && employee.certifications.length > 0) {
    explanationParts.push(`Holds ${employee.certifications[0]}`);
  }

  return {
    score: totalScore,
    scoreBreakdown: {
      technicalFit,
      experienceFit,
      aspirationFit
    },
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
        empCode: `TM-${Math.floor(10000 + Math.random() * 90000)}`,
        availabilityStatus: newEmployee.availabilityStatus || "BENCH",
        benchSince: newEmployee.availabilityStatus === "ALLOCATED" ? null : new Date().toISOString().split("T")[0],
        certifications: newEmployee.certifications || [],
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
        projectCode: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
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

  async getRecommendations(projectId, customWeights) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const employees = loadStorage("employees", initialEmployees);
      const project = projects.find((p) => p.id === projectId);
      if (!project) return [];

      const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
      const ranked = benchEmployees.map((emp) => {
        const match = calculateMatchScore(emp, project, customWeights);
        return {
          employee: emp,
          aiMatchScore: match.score,
          scoreBreakdown: match.scoreBreakdown,
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

  async proposeAllocation({ employeeId, projectId, aiMatchScore, scoreBreakdown, aiExplanation }) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);
      const allocations = loadStorage("allocations", initialAllocations);

      const employee = employees.find((e) => e.id === employeeId);
      const project = projects.find((p) => p.id === projectId);

      const newAlloc = {
        id: `alloc-${Date.now()}`,
        employeeId,
        empCode: employee?.empCode || "TM-XXXXX",
        employeeName: employee?.name || "Unknown",
        employeeRole: employee?.role || "Engineer",
        employeeBand: employee?.band || "L4",
        projectId,
        projectCode: project?.projectCode || "PRJ-XXXX",
        projectName: project?.name || "Unknown Project",
        clientName: project?.client || "Enterprise Client",
        aiMatchScore,
        scoreBreakdown: scoreBreakdown || { technicalFit: 50, experienceFit: 25, aspirationFit: 15 },
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
