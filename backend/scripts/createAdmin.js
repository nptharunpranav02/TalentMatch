
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        if (
            !process.env.ADMIN_NAME ||
            !process.env.ADMIN_EMAIL ||
            !process.env.ADMIN_PASSWORD
        ) {
            throw new Error("Admin environment variables are missing");
        }

        if (process.env.ADMIN_PASSWORD.length < 8) {
            throw new Error("Admin password must contain at least 8 characters");
        }

        await connectDB();

        const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        const admin = await User.create({
            name: process.env.ADMIN_NAME,
            email,
            password: process.env.ADMIN_PASSWORD,
            role: "admin"
        });

        console.log("Admin created successfully!");
        console.log("Admin ID:", admin._id);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
