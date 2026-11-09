const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getEmployeeUtilization
} = require("../controllers/dashboardController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/stats",
    protect,
    authorizeRoles("admin", "manager"),
    getDashboardStats
);

router.get(
    "/utilization",
    protect,
    authorizeRoles("admin", "manager"),
    getEmployeeUtilization
);

module.exports = router;