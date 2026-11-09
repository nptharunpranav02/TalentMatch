
const express = require("express");

const router = express.Router();

const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

// Both Admin and Manager can view employees
router.get(
    "/",
    protect,
    authorizeRoles("admin", "manager"),
    getAllEmployees
);

router.get(
    "/:id",
    protect,
    authorizeRoles("admin", "manager"),
    getEmployeeById
);

// Only Admin can modify employee records
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createEmployee
);

router.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    updateEmployee
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteEmployee
);

module.exports = router;
