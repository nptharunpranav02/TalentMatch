
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, "Employee ID is required"],
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [mongoose.Schema.Types.Mixed],
            required: true,
            validate: {
                validator: function (skills) {
                    return skills.length > 0;
                },
                message: "At least one skill is required"
            }
        },

        experience: {
            type: Number,
            required: true,
            min: 0
        },

        availability: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        },
        band: { type: String, default: "L4 / Senior SDE" },
        location: { type: String, default: "" },
        certifications: { type: [String], default: [] },
        allocationVersion: {
            type: Number,
            default: 0,
            select: false
        },
        careerInterests: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    },

);

module.exports = mongoose.model("Employee", employeeSchema);
