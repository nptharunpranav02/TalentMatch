const express = require("express");
const router = express.Router();
const tenantStore = require("../services/tenantStore");

// 1. List Organization Spaces (for quick switching or selection)
router.get("/organizations", (req, res) => {
  const orgs = tenantStore.listOrganizations();
  res.status(200).json({ success: true, count: orgs.length, data: orgs });
});

// 2. Register New Organization Workspace with Credentials
router.post("/organizations/register", (req, res) => {
  try {
    const { name, slug, email, password, industry, adminName, seedStarter } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Organization name, email and password are required."
      });
    }

    const created = tenantStore.registerOrganization({
      name,
      slug,
      email,
      password,
      industry,
      adminName,
      seedStarter: Boolean(seedStarter)
    });

    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("ORGANIZATION_REGISTERED", created);

    res.status(201).json({
      success: true,
      message: "Dedicated Organization Workspace created successfully.",
      data: created
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 3. Authenticate into Dedicated Organization Space
router.post("/organizations/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Organization email and password are required."
    });
  }

  const result = tenantStore.authenticate(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }

  res.status(200).json(result);
});

// 4. Organization Employees
router.get("/organizations/:orgId/employees", (req, res) => {
  const { orgId } = req.params;
  const employees = tenantStore.getEmployees(orgId);
  res.status(200).json({ success: true, orgId, count: employees.length, data: employees });
});

router.post("/organizations/:orgId/employees", (req, res) => {
  try {
    const { orgId } = req.params;
    const employee = tenantStore.addEmployee(orgId, req.body);
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("EMPLOYEE_MUTATED", { orgId, action: "add", employee });
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/organizations/:orgId/employees/:empId", (req, res) => {
  try {
    const { orgId, empId } = req.params;
    const updated = tenantStore.updateEmployee(orgId, { ...req.body, id: empId });
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("EMPLOYEE_MUTATED", { orgId, action: "update", employee: updated });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/organizations/:orgId/employees/:empId", (req, res) => {
  try {
    const { orgId, empId } = req.params;
    const result = tenantStore.deleteEmployee(orgId, empId);
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("EMPLOYEE_MUTATED", { orgId, action: "delete", employeeId: empId });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. Organization Projects
router.get("/organizations/:orgId/projects", (req, res) => {
  const { orgId } = req.params;
  const projects = tenantStore.getProjects(orgId);
  res.status(200).json({ success: true, orgId, count: projects.length, data: projects });
});

router.post("/organizations/:orgId/projects", (req, res) => {
  try {
    const { orgId } = req.params;
    const project = tenantStore.addProject(orgId, req.body);
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("PROJECT_MUTATED", { orgId, action: "add", project });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/organizations/:orgId/projects/:projId", (req, res) => {
  try {
    const { orgId, projId } = req.params;
    const updated = tenantStore.updateProject(orgId, { ...req.body, id: projId });
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("PROJECT_MUTATED", { orgId, action: "update", project: updated });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/organizations/:orgId/projects/:projId", (req, res) => {
  try {
    const { orgId, projId } = req.params;
    const result = tenantStore.deleteProject(orgId, projId);
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("PROJECT_MUTATED", { orgId, action: "delete", projectId: projId });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 6. Organization Allocations
router.get("/organizations/:orgId/allocations", (req, res) => {
  const { orgId } = req.params;
  const allocations = tenantStore.getAllocations(orgId);
  res.status(200).json({ success: true, orgId, count: allocations.length, data: allocations });
});

router.post("/organizations/:orgId/allocations", (req, res) => {
  try {
    const { orgId } = req.params;
    const alloc = tenantStore.proposeAllocation(orgId, req.body);
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("ALLOCATION_CREATED", { orgId, allocation: alloc });
    res.status(201).json({ success: true, data: alloc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch("/organizations/:orgId/allocations/:allocId/review", (req, res) => {
  try {
    const { orgId, allocId } = req.params;
    const { decision, managerNotes } = req.body;
    const updated = tenantStore.reviewAllocation(orgId, allocId, decision, managerNotes);
    const broadcast = req.app.get("broadcastSync");
    if (broadcast) broadcast("ALLOCATION_REVIEWED", { orgId, allocation: updated });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
