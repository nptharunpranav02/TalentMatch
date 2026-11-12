const Company = require("../models/Company");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.companyId ? {
    id: user.companyId._id || user.companyId,
    name: user.companyId.name || user.companyName || "Company workspace",
    slug: user.companyId.slug || ""
  } : null
});

const generateToken = (user) => jwt.sign(
  { id: user._id, role: user.role, companyId: user.companyId?._id || user.companyId },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select("+password")
      .populate("companyId", "name slug");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    if (!user.companyId) return res.status(403).json({ success: false, message: "This account is not assigned to a company workspace" });

    return res.status(200).json({
      success: true, message: "Login successful", token: generateToken(user),
      user: userPayload(user)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "User already exists" });

    const manager = await User.create({
      name: name.trim(), email: normalizedEmail, password, role: "manager",
      companyId: req.companyId
    });
    return res.status(201).json({
      success: true, message: "Manager account created successfully",
      user: { id: manager._id, name: manager.name, email: manager.email, role: manager.role }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Manager creation failed", error: error.message });
  }
};

const me = async (req, res) => {
  const user = await User.findById(req.user._id).populate("companyId", "name slug");
  return res.json({ success: true, user: userPayload(user) });
};

module.exports = { login, createManager, me };
