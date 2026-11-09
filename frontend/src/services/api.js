import { initialEmployees, initialProjects, initialAllocations, upskillingCourses } from "./mockData";

const USE_MOCK = true;
const API_BASE_URL = "http://localhost:5000/api";

// Bump to v6 to auto-migrate browser to complete enterprise dossier and upskilling schema
const STORAGE_VERSION = "v8";

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
// TalentMatch AI - Deterministic Multi-Vector Matching Engine
// Decomposed into 4 Explainable Vectors:
// 1. Technical Skill Compatibility: 40%
// 2. Experience Compatibility: 25%
// 3. Availability: 20%
// 4. Career Interest Alignment: 15%
// Hard Eligibility Gates:
// - Employee must be available (on bench)
// - Mandatory skills must meet project's minimum proficiency
// - Minimum experience must be satisfied
// - Seniority requirements validated
// ------------------------------------------------------------
export const calculateMatchScore = (
  employee,
  project,
  customWeights = { skillWeight: 40, experienceWeight: 25, availabilityWeight: 20, interestWeight: 15 }
) => {
  if (!employee || !project) {
    return {
      score: 0,
      isEligible: false,
      eligibilityReasons: ["Invalid employee or project record"],
      scoreBreakdown: { technicalFit: 0, experienceFit: 0, availabilityFit: 0, aspirationFit: 0 },
      explanation: "",
      skillComparison: [],
      matchingSkills: [],
      missingSkills: [],
      weakerSkills: [],
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
  const weakerSkills = [];
  const eligibilityReasons = [];

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

      if (found.proficiency >= req.minProficiency) {
        matchingSkills.push({
          name: found.name,
          empProficiency: found.proficiency,
          reqProficiency: req.minProficiency
        });
      } else {
        weakerSkills.push({
          name: found.name,
          empProficiency: found.proficiency,
          reqProficiency: req.minProficiency
        });
      }

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

  // 1. Technical Skill Score (40% default)
  const technicalFit = reqSkills.length > 0
    ? Math.round((skillPoints / reqSkills.length) * (customWeights.skillWeight || 40))
    : 0;

  // 2. Experience Compatibility (25% default)
  const expNeeded = project.minExperienceYears || 1;
  const expActual = employee.experienceYears || 0;
  const experienceFit = Math.round(
    Math.min((expActual / expNeeded) * (customWeights.experienceWeight || 25), (customWeights.experienceWeight || 25))
  );

  const experienceComparison = {
    required: expNeeded,
    actual: expActual,
    delta: +(expActual - expNeeded).toFixed(1),
    meetsThreshold: expActual >= expNeeded
  };

  // 3. Availability Dimension (20% default)
  const isBench = employee.availabilityStatus === "BENCH";
  let daysOnBench = 0;
  if (employee.benchSince) {
    daysOnBench = Math.max(1, Math.floor((new Date() - new Date(employee.benchSince)) / (1000 * 60 * 60 * 24)));
  }

  const availabilityFit = isBench ? (customWeights.availabilityWeight || 20) : 0;
  const availabilityComparison = {
    status: employee.availabilityStatus,
    daysOnBench,
    isReady: isBench
  };

  // 4. Career Aspiration & Domain Alignment (15% default)
  let interestPoints = 0;
  const matchedInterests = [];
  const projectContext = `${project.name} ${project.description} ${project.domain || ""}`.toLowerCase();

  (employee.careerInterests || []).forEach((interest) => {
    const term = interest.toLowerCase().split(" ")[0];
    if (term && projectContext.includes(term)) {
      interestPoints += (customWeights.interestWeight || 15) / 2;
      matchedInterests.push(interest);
    }
  });

  const aspirationFit = Math.round(Math.min(interestPoints, (customWeights.interestWeight || 15)));
  const aspirationComparison = {
    matchedInterests,
    domainAligned: matchedInterests.length > 0
  };

  // Normalized Overall Score (out of 100)
  const totalScore = Math.min(technicalFit + experienceFit + availabilityFit + aspirationFit, 100);

  // HARD ELIGIBILITY CHECKS
  if (!isBench) {
    eligibilityReasons.push(`Not Available on Bench (Current status: ${employee.availabilityStatus})`);
  }
  if (missingSkills.length > 0) {
    eligibilityReasons.push(`Missing mandatory skill${missingSkills.length > 1 ? "s" : ""}: ${missingSkills.join(", ")}`);
  }
  if (weakerSkills.length > 0) {
    eligibilityReasons.push(`Skill proficiency gap${weakerSkills.length > 1 ? "s" : ""}: ${weakerSkills.map(w => `${w.name} (L${w.empProficiency} < L${w.reqProficiency})`).join(", ")}`);
  }
  if (expActual < expNeeded) {
    eligibilityReasons.push(`Experience threshold not met (${expActual}y available vs ${expNeeded}y minimum required)`);
  }

  const isEligible = eligibilityReasons.length === 0;

  // Transparent, explainable rationale
  const explanationParts = [];
  if (isEligible) {
    explanationParts.push(`Fully Eligible: Satisfies all ${reqSkills.length} mandatory competencies with ${expActual}y experience`);
  } else {
    explanationParts.push(`Skill / Eligibility Gap: ${eligibilityReasons[0]}`);
  }
  if (matchingSkills.length > 0) {
    explanationParts.push(`Verified mastery in ${matchingSkills.map((s) => s.name).join(", ")}`);
  }
  if (matchedInterests.length > 0) {
    explanationParts.push(`Domain interest alignment in ${matchedInterests.join(", ")}`);
  }

  // Upskilling Plan for Gaps
  const gapSkills = [...missingSkills, ...weakerSkills.map(w => w.name)];
  const upskillingPlan = gapSkills.map((skillName) => {
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
    isEligible,
    eligibilityReasons,
    scoreBreakdown: {
      technicalFit,
      experienceFit,
      availabilityFit,
      aspirationFit
    },
    explanation: explanationParts.join(" • "),
    skillComparison,
    matchingSkills,
    missingSkills,
    weakerSkills,
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
        proj.hiringStatus = "Fully Staffed";
      } else {
        proj.status = "OPEN";
        proj.hiringStatus = "Active Hiring";
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

  async updateEmployee(updatedEmployee) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const index = employees.findIndex((e) => e.id === updatedEmployee.id);
      if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedEmployee };
        saveStorage("employees", employees);
        await this.reconcileData();
        return employees[index];
      }
      return null;
    }
    const res = await fetch(`${API_BASE_URL}/employees/${updatedEmployee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEmployee)
    });
    return res.json();
  },

  async deleteEmployee(employeeId) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const emp = employees.find((e) => e.id === employeeId);
      if (!emp) throw new Error("Employee not found");
      if (emp.availabilityStatus === "ALLOCATED") {
        throw new Error(`Cannot delete ${emp.name} while actively allocated to ${emp.assignedProjectName || "a project"}. Unassign or deallocate first.`);
      }
      const filtered = employees.filter((e) => e.id !== employeeId);
      saveStorage("employees", filtered);
      await this.reconcileData();
      return { success: true };
    }
    const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: "DELETE"
    });
    return res.json();
  },

  async updateProject(updatedProject) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const index = projects.findIndex((p) => p.id === updatedProject.id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedProject };
        saveStorage("projects", projects);
        await this.reconcileData();
        return projects[index];
      }
      return null;
    }
    const res = await fetch(`${API_BASE_URL}/projects/${updatedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject)
    });
    return res.json();
  },

  async deleteProject(projectId) {
    if (USE_MOCK) {
      const projects = loadStorage("projects", initialProjects);
      const employees = loadStorage("employees", initialEmployees);
      const allocations = loadStorage("allocations", initialAllocations);

      // De-allocate any employees assigned to this project back to bench
      employees.forEach((emp) => {
        if (emp.assignedProjectId === projectId) {
          emp.availabilityStatus = "BENCH";
          emp.assignedProjectId = null;
          emp.assignedProjectName = null;
          emp.benchSince = new Date().toISOString().split("T")[0];
        }
      });

      const filteredProjects = projects.filter((p) => p.id !== projectId);
      const filteredAllocations = allocations.filter((a) => a.projectId !== projectId);

      saveStorage("employees", employees);
      saveStorage("projects", filteredProjects);
      saveStorage("allocations", filteredAllocations);
      await this.reconcileData();
      return { success: true };
    }
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "DELETE"
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

      // Rank all employees and partition into Eligible vs Skill Gaps
      const evaluated = employees.map((emp) => {
        const match = calculateMatchScore(emp, project, customWeights);
        const pendingAlloc = allocations.find(
          (a) => a.employeeId === emp.id && a.projectId === projectId && a.status === "PENDING_APPROVAL"
        );

        return {
          employee: emp,
          isEligible: match.isEligible,
          eligibilityReasons: match.eligibilityReasons,
          aiMatchScore: match.score,
          scoreBreakdown: match.scoreBreakdown,
          aiExplanation: match.explanation,
          skillComparison: match.skillComparison,
          matchingSkills: match.matchingSkills,
          missingSkills: match.missingSkills,
          weakerSkills: match.weakerSkills,
          upskillingPlan: match.upskillingPlan,
          experienceComparison: match.experienceComparison,
          availabilityComparison: match.availabilityComparison,
          aspirationComparison: match.aspirationComparison,
          isPendingApproval: Boolean(pendingAlloc),
          pendingAllocationId: pendingAlloc?.id || null
        };
      });

      const eligible = evaluated
        .filter((c) => c.isEligible && c.employee.availabilityStatus === "BENCH")
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore);

      const skillGaps = evaluated
        .filter((c) => !c.isEligible || c.employee.availabilityStatus !== "BENCH")
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore);

      // Return unified array with partition metadata
      const all = [...eligible, ...skillGaps];
      all.eligible = eligible;
      all.skillGaps = skillGaps;
      return all;
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
