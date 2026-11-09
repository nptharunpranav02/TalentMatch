const express = require("express");
const router = express.Router();

const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Read projects
router.get("/", protect, authorizeRoles("admin", "manager"), getAllProjects);
router.get("/:id", protect, authorizeRoles("admin", "manager"), getProjectById);

// Create and update projects
router.post("/", protect, authorizeRoles("admin", "manager"), createProject);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateProject);

// Delete project — admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

module.exports = router;