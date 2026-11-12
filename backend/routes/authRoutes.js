
const express = require("express");
const router = express.Router();

const {
    login,
    registerAdmin,
    registerManager,
    rotateInviteCode,
    createManager,
    me
} = require("../controllers/authController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/register/admin", registerAdmin);
router.post("/register/manager", registerManager);

// Authenticated routes
router.get("/me", protect, me);

// Only Admin can create Managers or rotate company invitation code.
router.post(
    "/managers",
    protect,
    authorizeRoles("admin"),
    createManager
);

router.post(
    "/invite-code",
    protect,
    authorizeRoles("admin"),
    rotateInviteCode
);

module.exports = router;
