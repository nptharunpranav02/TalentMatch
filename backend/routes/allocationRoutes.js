const express = require("express");
const router = express.Router();

const {
    createAllocation,
    getAllAllocations,
    getAllocationById,
    approveAllocation,
    rejectAllocation,
    cancelAllocation
} = require("../controllers/allocationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// View allocations
router.get("/", protect, authorizeRoles("admin", "manager"), getAllAllocations);
router.get("/:id", protect, authorizeRoles("admin", "manager"), getAllocationById);

// Request allocation
router.post("/", protect, authorizeRoles("admin", "manager"), createAllocation);

// Approve or reject — admin only
router.patch("/:id/approve", protect, authorizeRoles("admin"), approveAllocation);
router.patch("/:id/reject", protect, authorizeRoles("admin"), rejectAllocation);

// Cancel allocation
router.patch("/:id/cancel", protect, authorizeRoles("admin", "manager"), cancelAllocation);

module.exports = router;