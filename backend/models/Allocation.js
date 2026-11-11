
const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        aiMatchScore: { type: Number, min: 0, max: 100, default: 0 },
        aiExplanation: { type: String, default: "" },
        scoreBreakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
        managerNotes: { type: String, default: "" },
        allocationPercentage: {
            type: Number,
            required: true,
            min: 1,
            max: 100
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "completed",
                "cancelled"
            ],
            default: "pending"
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        allocatedAt: {
            type: Date,
            default: null
        },

        approvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Validate allocation dates
allocationSchema.pre("validate", function () {
    if (
        this.startDate &&
        this.endDate &&
        this.endDate <= this.startDate
    ) {
        this.invalidate(
            "endDate",
            "Allocation end date must be after start date"
        );
    }
});

// Indexes for faster allocation queries
allocationSchema.index({ employee: 1, status: 1 });
allocationSchema.index({ project: 1, status: 1 });

module.exports = mongoose.model("Allocation", allocationSchema);
