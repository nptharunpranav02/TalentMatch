const mongoose = require("mongoose");
require("../models/Company");

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email role companyId").populate("companyId", "name slug");
    if (!user || !user.companyId) return res.status(401).json({ success: false, message: "User or company workspace no longer exists" });

    // Company identity is resolved from the database, never from client input or token claims.
    req.user = user;
    req.companyId = user.companyId._id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "You are not authorized to perform this action" });
  }
  next();
};

module.exports = { protect, authorizeRoles };
