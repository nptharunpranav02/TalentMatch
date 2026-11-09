
const express = require("express");

const router = express.Router();

const {
    login,
    createManager
} = require("../controllers/authController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

// Public login route
router.post("/login", login);

// Only Admin can create Managers
router.post(
    "/managers",
    protect,
    authorizeRoles("admin"),
    createManager
);

module.exports = router;
