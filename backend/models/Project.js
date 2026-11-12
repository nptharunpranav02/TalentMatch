
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
        projectId: {
            type: String,
            required: [true, "Project ID is required"],
            trim: true
        },

        projectName: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        requiredSkills: {
            type: [mongoose.Schema.Types.Mixed],
            required: true,
            validate: {
                validator: function (skills) {
                    return skills.length > 0;
                },
                message: "At least one required skill is needed"
            }
        },

        client: { type: String, default: "" },
        priority: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
        domain: { type: String, default: "" },
        preferredInterests: { type: [String], default: [] },
        monthlyRevenuePerDev: { type: Number, default: 0 },
        minExperience: {
            type: Number,
            required: true,
            min: 0
        },

        teamSize: {
            type: Number,
            required: true,
            min: 1
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["planning", "active", "completed", "cancelled"],
            default: "planning"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        allocationVersion: {
            type: Number,
            default: 0,
            select: false
        }
    },
    {
        timestamps: true
    }
);

// Ensure project end date is after start date
projectSchema.pre("validate", function () {
    if (
        this.startDate &&
        this.endDate &&
        this.endDate <= this.startDate
    ) {
        this.invalidate(
            "endDate",
            "End date must be after start date"
        );
    }
});

projectSchema.index({ companyId: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model("Project", projectSchema);
