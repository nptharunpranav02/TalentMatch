const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const TOKEN_KEY = "talentmatch_token";
const USER_KEY = "talentmatch_user";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; } };
export const clearAuth = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); };

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try { response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers }); }
  catch { throw new Error("Cannot reach TalentMatch backend. Check that Express is running on port 5000."); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== "/auth/login") clearAuth();
    throw new Error(data.message || data.detail || `Request failed (${response.status})`);
  }
  return data;
}

const idOf = (item) => String(item?._id || item?.id || "");
const mapSkill = (skill) => typeof skill === "string" ? { name: skill, proficiency: 3, years: 0 } : ({ name: skill.name, proficiency: Number(skill.proficiency || skill.level || 3), years: Number(skill.years || 0) });
const mapEmployee = (e, allocations = []) => {
  const current = allocations.find(a => String(a.employee?._id || a.employee) === idOf(e) && a.status === "approved" && new Date(a.startDate) <= new Date() && new Date(a.endDate) >= new Date());
  return { ...e, id: idOf(e), empCode: e.employeeId, role: e.designation, band: e.band || "L4 / Senior SDE", experienceYears: Number(e.experience || 0), availabilityStatus: current || e.availability === "unavailable" ? "ALLOCATED" : "BENCH", assignedProjectId: current ? idOf(current.project) : null, assignedProjectName: current?.project?.projectName || null, benchSince: e.createdAt, skills: (e.skills || []).map(mapSkill), careerInterests: e.careerInterests || [], certifications: e.certifications || [] };
};
const mapProject = (p, allocations = []) => {
  const assigned = allocations.filter(a => String(a.project?._id || a.project) === idOf(p) && a.status === "approved");
  return { ...p, id: idOf(p), projectCode: p.projectId, name: p.projectName, client: p.client || "", minExperienceYears: Number(p.minExperience || 0), requiredSkills: (p.requiredSkills || []).map(s => typeof s === "string" ? { name: s, minProficiency: 3 } : { name: s.name, minProficiency: s.proficiency || 3 }), allocatedCount: assigned.length, assignedEmployeeIds: assigned.map(a => idOf(a.employee)), status: p.status === "completed" ? "FULFILLED" : "OPEN", priority: p.priority || "Medium" };
};
const mapAllocation = (a) => ({ id: idOf(a), employeeId: idOf(a.employee), empCode: a.employee?.employeeId, employeeName: a.employee?.name, employeeRole: a.employee?.designation, employeeBand: a.employee?.band, projectId: idOf(a.project), projectCode: a.project?.projectId, projectName: a.project?.projectName, clientName: a.project?.client, aiMatchScore: a.aiMatchScore || 0, scoreBreakdown: a.scoreBreakdown || {}, aiExplanation: a.aiExplanation || "", status: String(a.status || "pending").toUpperCase() === "PENDING" ? "PENDING_APPROVAL" : String(a.status || "").toUpperCase(), proposedAt: a.createdAt, reviewedAt: a.approvedAt, effectiveStartDate: a.startDate, managerNotes: a.managerNotes || "" });

export const api = {
  async login(email, password) {
    const data = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem(TOKEN_KEY, data.token); localStorage.setItem(USER_KEY, JSON.stringify(data.user)); return data.user;
  },
  async me() { const data = await request("/auth/me"); localStorage.setItem(USER_KEY, JSON.stringify(data.user)); return data.user; },
  async getDashboardStats() {
    const data = await request("/dashboard/stats");
    return { totalEmployees: data.employees?.total || 0, benchCount: data.employees?.bench || 0, allocatedCount: data.employees?.allocated || 0, totalProjects: data.projects?.total || 0, activeProjects: (data.projects?.active || 0) + (data.projects?.planning || 0), pendingApprovals: data.allocations?.pending || 0 };
  },
  async getAllocations() { const data = await request("/allocations?limit=100"); return (data.allocations || []).map(mapAllocation); },
  async getEmployees() { const [data, allocData] = await Promise.all([request("/employees?limit=100"), request("/allocations?limit=100")]); return (data.employees || []).map(e => mapEmployee(e, allocData.allocations || [])); },
  async addEmployee(e) {
    const data = await request("/employees", { method: "POST", body: JSON.stringify({ employeeId: e.employeeId, name: e.name, email: e.email, department: e.department, designation: e.role, band: e.band, location: e.location, experienceYears: e.experienceYears, availabilityStatus: e.availabilityStatus, skills: e.skills, careerInterests: e.careerInterests, certifications: e.certifications }) });
    return mapEmployee(data.employee);
  },
  async getProjects() { const [data, allocData] = await Promise.all([request("/projects?limit=100"), request("/allocations?limit=100")]); return (data.projects || []).map(p => mapProject(p, allocData.allocations || [])); },
  async addProject(p) {
    const startDate = p.startDate || new Date().toISOString().slice(0, 10);
    const endDate = p.endDate || p.deadline || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
    const data = await request("/projects", { method: "POST", body: JSON.stringify({ name: p.name, projectName: p.name, client: p.client, description: p.description || "Project description", requiredSkills: p.requiredSkills, minExperienceYears: p.minExperienceYears, teamSize: p.teamSize, startDate, endDate, priority: p.priority, domain: p.domain }) });
    return mapProject(data.project);
  },
  async getRecommendations(projectId, weights) {
    const data = await request("/ai/match", { method: "POST", body: JSON.stringify({ projectId, weights }) });
    return data.recommendations || [];
  },
  async proposeAllocation(payload) {
    const data = await request("/allocations", { method: "POST", body: JSON.stringify({ employeeId: payload.employeeId, projectId: payload.projectId, allocationPercentage: payload.allocationPercentage || 100, aiMatchScore: payload.aiMatchScore, scoreBreakdown: payload.scoreBreakdown, aiExplanation: payload.aiExplanation, startDate: payload.effectiveStartDate || undefined, managerNotes: payload.managerNotes || "", directAuthorize: Boolean(payload.directAuthorize) }) });
    return data.allocation;
  },
  async reviewAllocation(id, decision, managerNotes = "") {
    const data = await request(`/allocations/${id}/review`, { method: "PATCH", body: JSON.stringify({ decision, managerNotes }) });
    return data.allocation;
  }
};
