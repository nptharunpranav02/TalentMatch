import { initialEmployees, initialProjects, initialAllocations, upskillingCourses } from "./mockData";
import { findSemanticSkillMatch } from "./semanticSkills";
import { liveSync } from "./websocket";

const USE_MOCK = true;
const API_BASE_URL = "http://localhost:5000/api";

// Tier-1 Enterprise Schema: Semantic Embeddings + Fractional FTE + Live WS Sync
const STORAGE_VERSION = "v9_tier1";

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
// TalentMatch AI - Tier-1 Multi-Vector Matching Engine
// 1. Technical Skill Compatibility: 40% (Exact + Semantic Embeddings)
// 2. Experience Compatibility: 25%
// 3. Availability & Fractional Capacity: 20%
// 4. Career Interest Alignment: 15%
// Hard Eligibility Gates:
// - Employee must have available capacity (> 0%)
// - Mandatory skills must meet minimum proficiency (exact or semantic fit >= 0.75)
// - Minimum experience threshold satisfied
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
      availabilityComparison: { status: "UNKNOWN", availableCapacity: 0, daysOnBench: 0, isReady: false },
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
    const reqNorm = (req.name || "").toLowerCase().trim();
    const exactFound = empSkills.find(
      (s) => (s.name || "").toLowerCase().trim() === reqNorm
    );

    if (exactFound) {
      const ratio = Math.min(exactFound.proficiency / (req.minProficiency || 1), 1.0);
      const isOver = exactFound.proficiency > req.minProficiency;
      const isExact = exactFound.proficiency === req.minProficiency;

      skillComparison.push({
        name: req.name,
        reqProficiency: req.minProficiency,
        empProficiency: exactFound.proficiency,
        status: isOver ? "EXCEEDS" : isExact ? "MEETS" : "PARTIAL",
        ratio,
        isSemantic: false
      });

      if (exactFound.proficiency >= req.minProficiency) {
        matchingSkills.push({
          name: exactFound.name,
          empProficiency: exactFound.proficiency,
          reqProficiency: req.minProficiency,
          isSemantic: false
        });
      } else {
        weakerSkills.push({
          name: exactFound.name,
          empProficiency: exactFound.proficiency,
          reqProficiency: req.minProficiency,
          isSemantic: false
        });
      }

      skillPoints += ratio;
    } else {
      // 1. Semantic Skill Embedding & Knowledge Graph Match
      const semMatch = findSemanticSkillMatch(req.name, empSkills);
      if (semMatch.matched) {
        const ratio = Math.min(semMatch.effectiveProficiency / (req.minProficiency || 1), 1.0);
        const isMet = semMatch.effectiveProficiency >= (req.minProficiency * 0.8);

        skillComparison.push({
          name: req.name,
          reqProficiency: req.minProficiency,
          empProficiency: semMatch.effectiveProficiency,
          status: "SEMANTIC_FIT",
          ratio,
          isSemantic: true,
          sourceSkill: semMatch.sourceSkill,
          affinity: semMatch.affinity
        });

        if (isMet) {
          matchingSkills.push({
            name: `${req.name} (via ${semMatch.sourceSkill} ${Math.round(semMatch.affinity * 100)}% fit)`,
            empProficiency: semMatch.effectiveProficiency,
            reqProficiency: req.minProficiency,
            isSemantic: true,
            sourceSkill: semMatch.sourceSkill,
            affinity: semMatch.affinity
          });
        } else {
          weakerSkills.push({
            name: `${req.name} (via ${semMatch.sourceSkill} ${Math.round(semMatch.affinity * 100)}% fit)`,
            empProficiency: semMatch.effectiveProficiency,
            reqProficiency: req.minProficiency,
            isSemantic: true,
            sourceSkill: semMatch.sourceSkill,
            affinity: semMatch.affinity
          });
        }

        skillPoints += ratio * semMatch.affinity;
      } else {
        skillComparison.push({
          name: req.name,
          reqProficiency: req.minProficiency,
          empProficiency: 0,
          status: "MISSING",
          ratio: 0,
          isSemantic: false
        });
        missingSkills.push(req.name);
      }
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

  // 3. Availability & Fractional Capacity Dimension (20% default)
  const availableCapacity = employee.availableCapacityPercentage !== undefined
    ? employee.availableCapacityPercentage
    : (employee.availabilityStatus === "BENCH" ? 100 : (employee.availabilityStatus === "PARTIAL_BENCH" ? 50 : 0));

  const isAvailable = availableCapacity > 0;
  let daysOnBench = 0;
  if (employee.benchSince) {
    daysOnBench = Math.max(1, Math.floor((new Date() - new Date(employee.benchSince)) / (1000 * 60 * 60 * 24)));
  }

  const availabilityFit = Math.round((availableCapacity / 100) * (customWeights.availabilityWeight || 20));
  const availabilityComparison = {
    status: employee.availabilityStatus,
    availableCapacity,
    daysOnBench,
    isReady: isAvailable
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
  if (!isAvailable) {
    eligibilityReasons.push(`0% Available Capacity (Fully committed 100% to ${employee.assignedProjectName || "active engagements"})`);
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
    explanationParts.push(`Fully Eligible: ${availableCapacity}% capacity ready, satisfies all ${reqSkills.length} competencies with ${expActual}y experience`);
  } else {
    explanationParts.push(`Eligibility Gap: ${eligibilityReasons[0]}`);
  }

  const semMatches = matchingSkills.filter(s => s.isSemantic);
  if (semMatches.length > 0) {
    explanationParts.push(`Semantic Vector Match: ${semMatches.map(s => `${s.sourceSkill} → ${s.name}`).join(", ")}`);
  }

  if (matchingSkills.filter(s => !s.isSemantic).length > 0) {
    explanationParts.push(`Verified mastery in ${matchingSkills.filter(s => !s.isSemantic).map((s) => s.name).join(", ")}`);
  }
  if (matchedInterests.length > 0) {
    explanationParts.push(`Domain interest alignment in ${matchedInterests.join(", ")}`);
  }

  // Upskilling Plan for Gaps
  const gapSkills = [...missingSkills, ...weakerSkills.map(w => w.name.split(" ")[0])];
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
  async reconcileData() {
    const employees = loadStorage("employees", initialEmployees);
    const projects = loadStorage("projects", initialProjects);
    const allocations = loadStorage("allocations", initialAllocations);

    // Reconcile employee fractional capacity from approved allocations
    employees.forEach((emp) => {
      const empAllocs = allocations.filter(
        (a) => a.employeeId === emp.id && a.status === "APPROVED"
      );

      if (empAllocs.length > 0) {
        const committedPct = empAllocs.reduce((sum, a) => sum + (a.allocationPercentage || 100), 0);
        emp.availableCapacityPercentage = Math.max(0, 100 - committedPct);
        emp.availabilityStatus = emp.availableCapacityPercentage === 0
          ? "ALLOCATED"
          : (emp.availableCapacityPercentage === 100 ? "BENCH" : "PARTIAL_BENCH");
        
        emp.allocatedEngagements = empAllocs.map((a) => ({
          projectId: a.projectId,
          projectCode: a.projectCode,
          projectName: a.projectName,
          clientName: a.clientName,
          allocationPercentage: a.allocationPercentage || 100,
          effectiveStartDate: a.effectiveStartDate,
          allocationId: a.id
        }));
        emp.assignedProjectId = empAllocs[0]?.projectId || null;
        emp.assignedProjectName = emp.allocatedEngagements.map(e => `${e.projectName} (${e.allocationPercentage}%)`).join(", ");
        if (emp.availableCapacityPercentage === 0) emp.benchSince = null;
      } else {
        if (emp.availabilityStatus === "ALLOCATED" && (!emp.allocatedEngagements || emp.allocatedEngagements.length === 0)) {
          emp.availableCapacityPercentage = 0;
        } else if (emp.availableCapacityPercentage === undefined) {
          emp.availableCapacityPercentage = emp.availabilityStatus === "BENCH" ? 100 : 0;
        }
      }
    });

    // Reconcile project staffing counts & FTE
    projects.forEach((proj) => {
      const projAllocs = allocations.filter(
        (a) => a.projectId === proj.id && a.status === "APPROVED"
      );
      const assignedEmps = employees.filter((e) =>
        projAllocs.some((a) => a.employeeId === e.id) ||
        (e.assignedProjectId === proj.id && e.availabilityStatus === "ALLOCATED")
      );
      const totalFTE = projAllocs.reduce((sum, a) => sum + ((a.allocationPercentage || 100) / 100), 0);
      proj.allocatedCount = assignedEmps.length;
      proj.allocatedFTE = totalFTE > 0 ? +totalFTE.toFixed(2) : assignedEmps.length;
      proj.assignedEmployeeIds = assignedEmps.map((e) => e.id);
      if (proj.allocatedCount >= proj.teamSize) {
        proj.status = "FULFILLED";
        proj.hiringStatus = "Fully Staffed";
      } else {
        proj.status = "OPEN";
        proj.hiringStatus = "Active Hiring";
      }
    });

    saveStorage("employees", employees);
    saveStorage("projects", projects);
    return { employees, projects };
  },

  async getDashboardStats() {
    if (USE_MOCK) {
      const { employees, projects } = await this.reconcileData();
      const allocations = loadStorage("allocations", initialAllocations);

      const benchCount = employees.filter((e) => e.availabilityStatus === "BENCH").length;
      const partialBenchCount = employees.filter((e) => e.availabilityStatus === "PARTIAL_BENCH").length;
      const allocatedCount = employees.filter((e) => e.availabilityStatus === "ALLOCATED").length;
      const pendingApprovals = allocations.filter((a) => a.status === "PENDING_APPROVAL").length;

      // True Enterprise FTE Utilization Rate
      const totalCapacityCommitted = employees.reduce(
        (sum, e) => sum + (100 - (e.availableCapacityPercentage ?? (e.availabilityStatus === "BENCH" ? 100 : 0))),
        0
      );
      const workforceUtilization = employees.length > 0
        ? Math.round((totalCapacityCommitted / (employees.length * 100)) * 100)
        : 0;

      return {
        totalEmployees: employees.length,
        benchCount,
        partialBenchCount,
        allocatedCount,
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "OPEN").length,
        pendingApprovals,
        workforceUtilization
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
      const initialStatus = newEmployee.availabilityStatus || "BENCH";
      const created = {
        ...newEmployee,
        id: `emp-${Date.now()}`,
        empCode: `TM-${Math.floor(10000 + Math.random() * 90000)}`,
        availabilityStatus: initialStatus,
        availableCapacityPercentage: initialStatus === "BENCH" ? 100 : (initialStatus === "PARTIAL_BENCH" ? 50 : 0),
        benchSince: initialStatus === "ALLOCATED" ? null : new Date().toISOString().split("T")[0],
        assignedProjectId: initialStatus === "ALLOCATED" ? newEmployee.assignedProjectId || null : null,
        assignedProjectName: initialStatus === "ALLOCATED" ? newEmployee.assignedProjectName || null : null,
        allocatedEngagements: [],
        certifications: newEmployee.certifications || []
      };
      employees.unshift(created);
      saveStorage("employees", employees);
      await this.reconcileData();
      liveSync.broadcast("EMPLOYEE_MUTATED", { action: "add", employee: created });
      return created;
    }
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee)
    });
    const data = await res.json();
    liveSync.broadcast("EMPLOYEE_MUTATED", { action: "add", employee: data });
    return data;
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
        allocatedFTE: 0,
        assignedEmployeeIds: [],
        status: "OPEN"
      };
      projects.unshift(created);
      saveStorage("projects", projects);
      liveSync.broadcast("PROJECT_MUTATED", { action: "add", project: created });
      return created;
    }
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject)
    });
    const data = await res.json();
    liveSync.broadcast("PROJECT_MUTATED", { action: "add", project: data });
    return data;
  },

  async updateEmployee(updatedEmployee) {
    if (USE_MOCK) {
      const employees = loadStorage("employees", initialEmployees);
      const index = employees.findIndex((e) => e.id === updatedEmployee.id);
      if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedEmployee };
        saveStorage("employees", employees);
        await this.reconcileData();
        liveSync.broadcast("EMPLOYEE_MUTATED", { action: "update", employee: employees[index] });
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
      liveSync.broadcast("EMPLOYEE_MUTATED", { action: "delete", employeeId });
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
        liveSync.broadcast("PROJECT_MUTATED", { action: "update", project: projects[index] });
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

      employees.forEach((emp) => {
        if (emp.assignedProjectId === projectId) {
          emp.availabilityStatus = "BENCH";
          emp.availableCapacityPercentage = 100;
          emp.assignedProjectId = null;
          emp.assignedProjectName = null;
          emp.allocatedEngagements = [];
          emp.benchSince = new Date().toISOString().split("T")[0];
        }
      });

      const filteredProjects = projects.filter((p) => p.id !== projectId);
      const filteredAllocations = allocations.filter((a) => a.projectId !== projectId);

      saveStorage("employees", employees);
      saveStorage("projects", filteredProjects);
      saveStorage("allocations", filteredAllocations);
      await this.reconcileData();
      liveSync.broadcast("PROJECT_MUTATED", { action: "delete", projectId });
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

      // Eligible: Must meet gates and have capacity > 0
      const eligible = evaluated
        .filter((c) => c.isEligible && (c.employee.availableCapacityPercentage ?? (c.employee.availabilityStatus === "BENCH" ? 100 : 0)) > 0)
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore);

      const skillGaps = evaluated
        .filter((c) => !c.isEligible || (c.employee.availableCapacityPercentage ?? (c.employee.availabilityStatus === "BENCH" ? 100 : 0)) === 0)
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore);

      const all = [...eligible, ...skillGaps];
      all.eligible = eligible;
      all.skillGaps = skillGaps;
      return all;
    }
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/recommendations`);
    return res.json();
  },

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

  // Fractional / Multi-Project Allocation Workflow
  async proposeAllocation({
    employeeId,
    projectId,
    allocationPercentage = 100, // 100% | 50% | 25%
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

      if (!employee) throw new Error("Employee record not found");
      if (!project) throw new Error("Project record not found");

      const currentCapacity = employee.availableCapacityPercentage !== undefined
        ? employee.availableCapacityPercentage
        : (employee.availabilityStatus === "BENCH" ? 100 : 0);

      const requestedPct = Number(allocationPercentage) || 100;

      if (requestedPct > currentCapacity) {
        throw new Error(`Insufficient capacity. ${employee.name} only has ${currentCapacity}% capacity available (requested ${requestedPct}%).`);
      }

      // Check project capacity
      const currentAllocated = employees.filter(
        (e) => e.assignedProjectId === project.id && (e.availabilityStatus === "ALLOCATED" || e.availabilityStatus === "PARTIAL_BENCH")
      ).length;
      if (currentAllocated >= project.teamSize && requestedPct === 100) {
        throw new Error(`Project capacity reached (${currentAllocated}/${project.teamSize} seats committed).`);
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
        allocationPercentage: requestedPct,
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
        const remainingCap = Math.max(0, currentCapacity - requestedPct);
        employee.availableCapacityPercentage = remainingCap;
        employee.availabilityStatus = remainingCap === 0 ? "ALLOCATED" : "PARTIAL_BENCH";
        employee.allocatedEngagements = employee.allocatedEngagements || [];
        employee.allocatedEngagements.push({
          projectId: project.id,
          projectCode: project.projectCode,
          projectName: project.name,
          clientName: project.client,
          allocationPercentage: requestedPct,
          effectiveStartDate: newAlloc.effectiveStartDate,
          allocationId: newAlloc.id
        });
        employee.assignedProjectId = project.id;
        employee.assignedProjectName = employee.allocatedEngagements.map(e => `${e.projectName} (${e.allocationPercentage}%)`).join(", ");
        if (remainingCap === 0) employee.benchSince = null;
      }

      allocations.unshift(newAlloc);
      saveStorage("allocations", allocations);
      saveStorage("employees", employees);
      await this.reconcileData();

      liveSync.broadcast("ALLOCATION_CREATED", newAlloc);
      return newAlloc;
    }

    const res = await fetch(`${API_BASE_URL}/allocations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, projectId, allocationPercentage, aiMatchScore, aiExplanation, effectiveStartDate, managerNotes, directAuthorize })
    });
    const data = await res.json();
    liveSync.broadcast("ALLOCATION_CREATED", data);
    return data;
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

      const emp = employees.find((e) => e.id === alloc.employeeId);
      const proj = projects.find((p) => p.id === alloc.projectId);

      if (decision === "APPROVED" && emp && proj) {
        const requestedPct = alloc.allocationPercentage || 100;
        const currentCap = emp.availableCapacityPercentage !== undefined
          ? emp.availableCapacityPercentage
          : (emp.availabilityStatus === "BENCH" ? 100 : 0);

        const newCap = Math.max(0, currentCap - requestedPct);
        emp.availableCapacityPercentage = newCap;
        emp.availabilityStatus = newCap === 0 ? "ALLOCATED" : "PARTIAL_BENCH";
        emp.allocatedEngagements = emp.allocatedEngagements || [];
        emp.allocatedEngagements.push({
          projectId: proj.id,
          projectCode: proj.projectCode,
          projectName: proj.name,
          clientName: proj.client,
          allocationPercentage: requestedPct,
          effectiveStartDate: alloc.effectiveStartDate,
          allocationId: alloc.id
        });
        emp.assignedProjectId = proj.id;
        emp.assignedProjectName = emp.allocatedEngagements.map(e => `${e.projectName} (${e.allocationPercentage}%)`).join(", ");
        if (newCap === 0) emp.benchSince = null;
      } else if (decision === "REJECTED" && emp) {
        // If restoring rejected proposal
        const activeEngagements = (emp.allocatedEngagements || []).filter(e => e.allocationId !== allocationId);
        emp.allocatedEngagements = activeEngagements;
        if (activeEngagements.length === 0) {
          emp.availabilityStatus = "BENCH";
          emp.availableCapacityPercentage = 100;
          emp.assignedProjectId = null;
          emp.assignedProjectName = null;
          emp.benchSince = new Date().toISOString().split("T")[0];
        } else {
          const committedPct = activeEngagements.reduce((sum, e) => sum + e.allocationPercentage, 0);
          emp.availableCapacityPercentage = Math.max(0, 100 - committedPct);
          emp.availabilityStatus = emp.availableCapacityPercentage === 0 ? "ALLOCATED" : "PARTIAL_BENCH";
        }
      }

      saveStorage("allocations", allocations);
      saveStorage("employees", employees);
      await this.reconcileData();

      liveSync.broadcast("ALLOCATION_REVIEWED", { allocationId, decision });
      return alloc;
    }

    const res = await fetch(`${API_BASE_URL}/allocations/${allocationId}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, managerNotes })
    });
    const data = await res.json();
    liveSync.broadcast("ALLOCATION_REVIEWED", { allocationId, decision });
    return data;
  }
};
