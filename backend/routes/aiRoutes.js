const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getRecommendations } = require("../controllers/aiController");
router.post("/match", protect, authorizeRoles("admin", "manager"), getRecommendations);
module.exports = router;
