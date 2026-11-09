import { initialEmployees, initialProjects, initialAllocations, upskillingCourses } from "./mockData";

const USE_MOCK = true;
const API_BASE_URL = "http://localhost:5000/api";

// Bump to v6 to auto-migrate browser to complete enterprise dossier and upskilling schema
const STORAGE_VERSION = "v6";

const loadStorage = (key, fallback) => {
  const storageKey = `talentmatch_${STORAGE_VERSION}_${key}`;
  const data = localStorage.getItem(storageKey);
  if (!data) {
    localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const saveStorage = (key, data) => {
  localStorage.setItem(`talentmatch_${STORAGE_VERSION}_${key}`, JSON.stringify(data));
};

// ------------------------------------------------------------
// TalentMatch AI - Deterministic Multi-Vector Matching Engine
// Decomposed into 3 Explainable Vectors:
// 1. Technical Competency Fit (default 60%)
// 2. Seniority & Experience Threshold (default 25%)
// 3. Domain & Career Aspiration Vector (default 15%)
// ------------------------------------------------------------
export const calculateMatchScore = (
  employee,
  project,
  customWeights = { skillWeight: 60, experienceWeight: 25, interestWeight: 15 }
) => {
  if (!employee || !project) {
    return {
      score: 0,
      scoreBreakdown: { technicalFit: 0, experienceFit: 0, aspirationFit: 0 },
      explanation: "",
      skillComparison: [],
      matchingSkills: [],
      missingSkills: [],
      experienceComparison: { required: 0, actual: 0, delta: 0, meetsThreshold: false },
      availabilityComparison: { status: "UNKNOWN", daysOnBench: 0, isReady: false },
      aspirationComparison: { matchedInterests: [], domainAligned: false }
    };
  }

  const reqSkills = project.requiredSkills || [];
  const empSkills = employee.skills || [];

  const skillComparison = [];
  const matchingSkills = [];
  const missingSkills = [];

  let skillPoints = 0;
  reqSkills.forEach((req) => {
    const found = empSkills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );

    if (found) {
      const ratio = Math.min(found.proficiency / (req.minProficiency || 1), 1.0);
      const isOver = found.proficiency > req.minProficiency;
      const isExact = found.proficiency === req.minProficiency;
      
      skillComparison.push({
        name: req.name,
        reqProficiency: req.minProficiency,
        empProficiency: found.proficiency,
        status: isOver ? "EXCEEDS" : isExact ? "MEETS" : "PARTIAL",
        ratio
      });

      matchingSkills.push({
        name: found.name,
        empProficiency: found.proficiency,
        reqProficiency: req.minProficiency
      });

      skillPoints += ratio;
    } else {
      skillComparison.push({
        name: req.name,
        reqProficiency: req.minProficiency,
        empProficiency: 0,
        status: "MISSING",
        ratio: 0
      });
      missingSkills.push(req.name);
    }
  });

  const technicalFit = reqSkills.length > 0
    ? Math.round((skillPoints / reqSkills.length) * customWeights.skillWeight)
    : 0;

  // 2. Seniority & Experience Dimension
  const expNeeded = project.minExperienceYears || 1;
  const expActual = employee.experienceYears || 0;
  const expRatio = Math.min(expActual / expNeeded, 1.25);
  const experienceFit = Math.round(
    Math.min((expActual / expNeeded) * customWeights.experienceWeight, customWeights.experienceWeight)
  );

  const experienceComparison = {
    required: expNeeded,
    actual: expActual,
    delta: +(expActual - expNeeded).toFixed(1),
    meetsThreshold: expActual >= expNeeded
  };

  // 3. Availability Dimension
  const isBench = employee.availabilityStatus === "BENCH";
  let daysOnBench = 0;
  if (employee.benchSince) {
    daysOnBench = Math.max(1, Math.floor((new Date() - new Date(employee.benchSince)) / (1000 * 60 * 60 * 24)));
  }

  const availabilityComparison = {
    status: employee.availabilityStatus,
    daysOnBench,
    isReady: isBench
  };

  // 4. Career Aspiration & Domain Alignment Dimension
  let interestPoints = 0;
  const matchedInterests = [];
  const projectContext = `${project.name} ${project.description} ${project.domain || ""}`.toLowerCase();

  (employee.careerInterests || []).forEach((interest) => {
    const term = interest.toLowerCase().split(" ")[0];
    if (term && projectContext.includes(term)) {
      interestPoints += customWeights.interestWeight / 2;
      matchedInterests.push(interest);
    }
  });

  const aspirationFit = Math.round(Math.min(interestPoints, customWeights.interestWeight));
  const aspirationComparison = {
    matchedInterests,
    domainAligned: matchedInterests.length > 0
  };

  const totalScore = Math.min(technicalFit + experienceFit + aspirationFit, 100);

  // Transparent, explainable rationale
  const explanationParts = [];
  if (matchingSkills.length > 0) {
    explanationParts.push(`Coverage: ${matchingSkills.length}/${reqSkills.length} required competencies (${matchingSkills.map((s) => s.name).join(", ")})`);
  }
  if (expActual >= expNeeded) {
    explanationParts.push(`${expActual}y verified tenure satisfies project threshold (${expNeeded}y)`);
  } else {
    explanationParts.push(`${expActual}y tenure against ${expNeeded}y target`);
  }
  if (matchedInterests.length > 0) {
    explanationParts.push(`Direct alignment with career focus in ${matchedInterests.join(", ")}`);
  }
  if (missingSkills.length > 0) {
    explanationParts.push(`Skill gap: ${missingSkills.join(", ")} (upskilling required)`);
  }

  // Requirement 3.4: Upskilling & Skill Gap Analysis Plan
  const upskillingPlan = missingSkills.map((skillName) => {
    const key = skillName.toLowerCase();
    const course = upskillingCourses[key] || {
      title: `${skillName} Enterprise Accelerator Certification`,
      duration: "1–2 weeks",
      provider: "Corporate Learning Institute"
    };
    return {
      skill: skillName,
      ...course
    };
  });

  return {
    score: totalScore,
    scoreBreakdown: {
      technicalFit,
      experienceFit,
      aspirationFit
    },
    explanation: explanationParts.join(" • "),
    skillComparison,
    matchingSkills,
    missingSkills,
    upskillingPlan,
    experienceComparison,
    availabilityComparison,
    aspirationComparison
  };
};

export const api = {
  // Single Source of Truth Reconciler
  // Guarantees project.allocatedCount ALWAYS equals count of employees assigned to that project
  async reconcileData() {
    const employees = loadStorage("employees", initialEmployees);
    const projects = loadStorage("projects", initialProjects);

    projects.forEach((proj) => {
      const assignedEmps = employees.filter(
        (e) => e.assignedProjectId === proj.id && e.availabilityStatus === "ALLOCATED"
      );
      proj.allocatedCount = assignedEmps.length;
      proj.assignedEmployeeIds = assignedEmps.map((e) => e.id);
      if (proj.allocatedCount >= proj.teamSize) {
        proj.status = "FULFILLED";
      } else {
        proj.status = "OPEN";
      }
    });

    saveStorage("projects", projects);
    return { employees, projects };
  },

  async getDashboardStats() {
    if (USE_MOCK) {
      const { employees, projects } = await this.reconcileData();
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
      await this.reconcileData();
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
        assignedProjectId: newEmployee.availabilityStatus === "ALLOCATED" ? newEmployee.assignedProjectId || null : null,
        assignedProjectName: newEmployee.availabilityStatus === "ALLOCATED" ? newEmployee.assignedProjectName || null : null,
        certifications: newEmployee.certifications || []
      };
      employees.unshift(created);
      saveStorage("employees", employees);
      await this.reconcileData();
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
      const { projects } = await this.reconcileData();
      return projects;
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
        assignedEmployeeIds: [],
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

  // AI Matching Workspace Recommendations
  async getRecommendations(projectId, customWeights) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const employees = loadStorage("employees", initialEmployees);
      const allocations = loadStorage("allocations", initialAllocations);
      const project = projects.find((p) => p.id === projectId);
      if (!project) return [];

      // Rank all bench employees (also flag any pending approvals)
      const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");

      const ranked = benchEmployees.map((emp) => {
        const match = calculateMatchScore(emp, project, customWeights);
        const pendingAlloc = allocations.find(
          (a) => a.employeeId === emp.id && a.projectId === projectId && a.status === "PENDING_APPROVAL"
        );

        return {
          employee: emp,
          aiMatchScore: match.score,
          scoreBreakdown: match.scoreBreakdown,
          aiExplanation: match.explanation,
          skillComparison: match.skillComparison,
          matchingSkills: match.matchingSkills,
          missingSkills: match.missingSkills,
          upskillingPlan: match.upskillingPlan,
          experienceComparison: match.experienceComparison,
          availabilityComparison: match.availabilityComparison,
          aspirationComparison: match.aspirationComparison,
          isPendingApproval: Boolean(pendingAlloc),
          pendingAllocationId: pendingAlloc?.id || null
        };
      });

      return ranked.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    }
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/recommendations`);
    return res.json();
  },

  // 3.1: Reverse Match: Ranked Project Matches for a Single Employee Dossier
  async getEmployeeProjectRecommendations(employeeId) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const employees = loadStorage("employees", initialEmployees);
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) return [];

      const openProjects = projects.filter((p) => p.status === "OPEN");
      const rankedProjects = openProjects.map((proj) => {
        const match = calculateMatchScore(employee, proj);
        return {
          project: proj,
          aiMatchScore: match.score,
          scoreBreakdown: match.scoreBreakdown,
          aiExplanation: match.explanation,
          skillComparison: match.skillComparison,
          matchingSkills: match.matchingSkills,
          missingSkills: match.missingSkills,
          upskillingPlan: match.upskillingPlan
        };
      });

      return rankedProjects.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    }
    const res = await fetch(`${API_BASE_URL}/employees/${employeeId}/recommendations`);
    return res.json();
  },

  async getAllocations() {
    if (USE_MOCK) {
      return loadStorage("allocations", initialAllocations);
    }
    const res = await fetch(`${API_BASE_URL}/allocations`);
    return res.json();
  },

  // Step 6 & 7: Allocation Confirmation Workflow
  async proposeAllocation({
    employeeId,
    projectId,
    aiMatchScore,
    scoreBreakdown,
    aiExplanation,
    effectiveStartDate,
    managerNotes = "",
    directAuthorize = false
  }) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);
      const allocations = loadStorage("allocations", initialAllocations);

      const employee = employees.find((e) => e.id === employeeId);
      const project = projects.find((p) => p.id === projectId);

      if (!employee) throw new Error("Employee not found");
      if (!project) throw new Error("Project not found");

      // Prevent assigning an employee who is already ALLOCATED to an active project
      if (employee.availabilityStatus === "ALLOCATED") {
        throw new Error(`${employee.name} is already allocated to ${employee.assignedProjectName || "another engagement"}. Unassign before reallocating.`);
      }

      // Check capacity
      const currentAllocated = employees.filter(
        (e) => e.assignedProjectId === project.id && e.availabilityStatus === "ALLOCATED"
      ).length;
      if (currentAllocated >= project.teamSize) {
        throw new Error(`Project capacity reached (${currentAllocated}/${project.teamSize} seats filled).`);
      }

      const allocStatus = directAuthorize ? "APPROVED" : "PENDING_APPROVAL";

      const newAlloc = {
        id: `alloc-${Date.now()}`,
        employeeId,
        empCode: employee.empCode || "TM-XXXXX",
        employeeName: employee.name,
        employeeRole: employee.role,
        employeeBand: employee.band,
        projectId,
        projectCode: project.projectCode,
        projectName: project.name,
        clientName: project.client,
        aiMatchScore,
        scoreBreakdown: scoreBreakdown || { technicalFit: 50, experienceFit: 25, aspirationFit: 15 },
        aiExplanation,
        status: allocStatus,
        proposedAt: new Date().toISOString(),
        effectiveStartDate: effectiveStartDate || new Date().toISOString().split("T")[0],
        reviewedAt: directAuthorize ? new Date().toISOString() : null,
        managerNotes
      };

      if (directAuthorize) {
        employee.availabilityStatus = "ALLOCATED";
        employee.assignedProjectId = project.id;
        employee.assignedProjectName = project.name;
        employee.benchSince = null;
      }

      allocations.unshift(newAlloc);
      saveStorage("allocations", allocations);
      saveStorage("employees", employees);
      await this.reconcileData();

      return newAlloc;
    }

    const res = await fetch(`${API_BASE_URL}/allocations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, projectId, aiMatchScore, aiExplanation, effectiveStartDate, managerNotes, directAuthorize })
    });
    return res.json();
  },

  async reviewAllocation(allocationId, decision, managerNotes = "") {
    if (USE_MOCK) {
      const allocations = loadStorage("allocations", initialAllocations);
      const employees = loadStorage("employees", initialEmployees);
      const projects = loadStorage("projects", initialProjects);

      const alloc = allocations.find((a) => a.id === allocationId);
      if (!alloc) throw new Error("Allocation record not found");

      alloc.status = decision;
      alloc.reviewedAt = new Date().toISOString();
      if (managerNotes) alloc.managerNotes = managerNotes;

      if (decision === "APPROVED") {
        const emp = employees.find((e) => e.id === alloc.employeeId);
        const proj = projects.find((p) => p.id === alloc.projectId);

        if (emp && proj) {
          // Verify employee is not already allocated
          if (emp.availabilityStatus === "ALLOCATED" && emp.assignedProjectId !== proj.id) {
            throw new Error(`${emp.name} is already committed to another project.`);
          }

          emp.availabilityStatus = "ALLOCATED";
          emp.assignedProjectId = proj.id;
          emp.assignedProjectName = proj.name;
          emp.benchSince = null;
        }
      } else if (decision === "REJECTED") {
        const emp = employees.find((e) => e.id === alloc.employeeId);
        if (emp && emp.assignedProjectId === alloc.projectId) {
          emp.availabilityStatus = "BENCH";
          emp.assignedProjectId = null;
          emp.assignedProjectName = null;
          emp.benchSince = new Date().toISOString().split("T")[0];
        }
      }

      saveStorage("allocations", allocations);
      saveStorage("employees", employees);
      await this.reconcileData();

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
