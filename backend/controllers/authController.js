
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

// Admin creates Manager account
const createManager = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const manager = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "manager"
        });

        res.status(201).json({
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
        res.status(500).json({
            success: false,
            message: "Manager creation failed",
            error: error.message
        });
    }
};

const me = async (req, res) => res.json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });

module.exports = { login, createManager, me };
