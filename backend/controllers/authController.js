
const Company = require("../models/Company");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
  {
    id: user._id,
    role: user.role,
    companyId: user.companyId?._id || user.companyId
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const createInviteCode = () =>
  crypto.randomBytes(6).toString("hex").toUpperCase();

const hashInviteCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    })
      .select("+password")
      .populate("companyId", "name slug");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.companyId) {
      return res.status(403).json({
        success: false,
        message: "This account is not assigned to a company workspace"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
      user: userPayload(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

// Public registration: create a company and its first Admin.
const registerAdmin = async (req, res) => {
  let createdCompany = null;

  try {
    const { name, email, password, companyName, industry } = req.body || {};

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and company name are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const cleanCompanyName = companyName.trim();
    const baseSlug = cleanCompanyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "company";

    const slug = `${baseSlug}-${crypto.randomBytes(3).toString("hex")}`;
    const inviteCode = createInviteCode();

    createdCompany = await Company.create({
      name: cleanCompanyName,
      slug,
      industry: industry?.trim() || "",
      isDemo: false,
      inviteCodeHash: hashInviteCode(inviteCode)
    });

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "admin",
      companyId: createdCompany._id
    });

    await admin.populate("companyId", "name slug");

    return res.status(201).json({
      success: true,
      message: "Company and Admin account created successfully",
      token: generateToken(admin),
      user: userPayload(admin),
      inviteCode
    });
  } catch (error) {
    // Avoid leaving an empty company if Admin creation fails.
    if (createdCompany) {
      await Company.findByIdAndDelete(createdCompany._id).catch(() => { });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account or company with these details already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin registration failed",
      error: error.message
    });
  }
};

// Public registration: join an existing company as Manager.
const registerManager = async (req, res) => {
  try {
    const { name, email, password, companySlug, inviteCode } = req.body || {};

    if (!name || !email || !password || !companySlug || !inviteCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const company = await Company.findOne({
      slug: companySlug.trim().toLowerCase()
    }).select("+inviteCodeHash");

    if (!company || !company.inviteCodeHash) {
      return res.status(403).json({
        success: false,
        message: "Invalid company or invitation code"
      });
    }

    const submittedHash = hashInviteCode(inviteCode.trim().toUpperCase());

    const validCode = crypto.timingSafeEqual(
      Buffer.from(company.inviteCodeHash, "hex"),
      Buffer.from(submittedHash, "hex")
    );

    if (!validCode) {
      return res.status(403).json({
        success: false,
        message: "Invalid company or invitation code"
      });
    }

    const manager = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "manager",
      companyId: company._id
    });

    await manager.populate("companyId", "name slug");

    return res.status(201).json({
      success: true,
      message: "Manager account created successfully",
      token: generateToken(manager),
      user: userPayload(manager)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Manager registration failed",
      error: error.message
    });
  }
};

// Existing Admin can rotate the company's invitation code.
const rotateInviteCode = async (req, res) => {
  try {
    const inviteCode = createInviteCode();

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      { inviteCodeHash: hashInviteCode(inviteCode) },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    return res.json({
      success: true,
      message: "Company invitation code generated",
      inviteCode
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not generate invitation code"
    });
  }
};

const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const manager = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "manager",
      companyId: req.companyId
    });

    return res.status(201).json({
      success: true,
      message: "Manager account created successfully",
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Manager creation failed",
      error: error.message
    });
  }
};

const me = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("companyId", "name slug");

  return res.json({
    success: true,
    user: userPayload(user)
  });
};

module.exports = {
  login,
  registerAdmin,
  registerManager,
  rotateInviteCode,
  createManager,
  me
};
