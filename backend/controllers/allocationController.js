const mongoose = require("mongoose");
const checkAllocationCapacity = require("../utils/allocationValidation");
const Allocation = require("../models/Allocation");
const Employee = require("../models/Employee");
const Project = require("../models/Project");

// Check whether two date ranges overlap
const datesOverlap = (startA, endA, startB, endB) => {
    return new Date(startA) <= new Date(endB) &&
        new Date(endA) >= new Date(startB);
};

// CREATE ALLOCATION REQUEST
const createAllocation = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            employee: employeeInput, employeeId, project: projectInput, projectId,
            allocationPercentage = 100, startDate: startInput, endDate: endInput,
            aiMatchScore = 0, aiExplanation = "", scoreBreakdown = {}, managerNotes = "", directAuthorize = false
        } = req.body;
        if (directAuthorize && req.user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only an admin can directly authorize an allocation" });
        }
        const employee = employeeInput || employeeId;
        const project = projectInput || projectId;

        if (
            !mongoose.isValidObjectId(employee) ||
            !mongoose.isValidObjectId(project)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee or project ID"
            });
        }

        const projectForDates = await Project.findOne({ _id: project, companyId: req.companyId });
        if (!projectForDates) return res.status(404).json({ success: false, message: "Project not found" });
        const startDate = startInput || projectForDates.startDate;
        const endDate = endInput || projectForDates.endDate;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const percentage = Number(allocationPercentage);

        if (
            !startDate ||
            !endDate ||
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start > end ||
            !Number.isFinite(percentage) ||
            percentage < 1 ||
            percentage > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid allocation dates or percentage"
            });
        }

        let createdAllocation;

        await session.withTransaction(async () => {
            const employeeRecord = await Employee.findOne({ _id: employee, companyId: req.companyId }).session(session);
            const projectRecord = await Project.findOne({ _id: project, companyId: req.companyId }).session(session);

            if (!employeeRecord || !projectRecord) {
                const error = new Error("Employee or project not found");
                error.statusCode = 404;
                throw error;
            }

            if (employeeRecord.availability !== "available") {
                const error = new Error("Employee is unavailable");
                error.statusCode = 400;
                throw error;
            }

            if (!["planning", "active"].includes(projectRecord.status)) {
                const error = new Error("Project is not accepting allocations");
                error.statusCode = 400;
                throw error;
            }

            if (
                start < new Date(projectRecord.startDate) ||
                end > new Date(projectRecord.endDate)
            ) {
                const error = new Error(
                    "Allocation dates must be within project dates"
                );
                error.statusCode = 400;
                throw error;
            }

            const capacity = await checkAllocationCapacity({
                employeeId: employee,
                projectId: project,
                companyId: req.companyId,
                startDate: start,
                endDate: end,
                percentage,
                session
            });

            if (capacity.projectedTeamSize > projectRecord.teamSize) {
                const error = new Error("Project team size limit reached");
                error.statusCode = 409;
                throw error;
            }

            // These writes serialize competing allocation operations.
            await Employee.updateOne(
                { _id: employee, companyId: req.companyId },
                { $inc: { allocationVersion: 1 } },
                { session }
            );

            await Project.updateOne(
                { _id: project, companyId: req.companyId },
                { $inc: { allocationVersion: 1 } },
                { session }
            );

            const [allocation] = await Allocation.create([{
                companyId: req.companyId,
                employee,
                project,
                allocationPercentage: percentage,
                startDate: start,
                endDate: end,
                requestedBy: req.user._id,
                status: directAuthorize ? "approved" : "pending",
                ...(directAuthorize ? { approvedBy: req.user._id, approvedAt: new Date(), allocatedAt: new Date() } : {}),
                aiMatchScore: Number(aiMatchScore) || 0,
                aiExplanation: String(aiExplanation || ""),
                scoreBreakdown: scoreBreakdown || {},
                managerNotes: String(managerNotes || "")
            }], { session });

            createdAllocation = allocation;
        });

        return res.status(201).json({
            success: true,
            message: directAuthorize ? "Allocation directly authorized" : "Allocation request created",
            allocation: createdAllocation
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error"
        });

    } finally {
        await session.endSession();
    }
};
// GET ALL ALLOCATIONS
const getAllAllocations = async (req, res) => {
    try {
        const filter = { companyId: req.companyId };

        if (req.query.status) filter.status = req.query.status;
        if (req.query.employee) filter.employee = req.query.employee;
        if (req.query.project) filter.project = req.query.project;

        const allocations = await Allocation.find(filter)
            .populate("employee", "employeeId name email skills experience designation band")
            .populate("project", "projectId projectName client status")
            .populate("requestedBy", "name email role")
            .populate("approvedBy", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalAllocations: allocations.length,
            allocations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ALLOCATION BY ID
const getAllocationById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid allocation ID"
            });
        }

        const allocation = await Allocation.findOne({ _id: req.params.id, companyId: req.companyId })
            .populate("employee", "employeeId name email")
            .populate("project", "projectId projectName")
            .populate("requestedBy", "name email")
            .populate("approvedBy", "name email");

        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        res.status(200).json({
            success: true,
            allocation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// APPROVE ALLOCATION
const approveAllocation = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid allocation ID"
            });
        }

        const allocation = await Allocation.findOne({ _id: req.params.id, companyId: req.companyId });

        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        if (allocation.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending allocations can be approved"
            });
        }

        // Recheck capacity at approval time
        const existing = await Allocation.find({
            companyId: req.companyId,
            _id: { $ne: allocation._id },
            employee: allocation.employee,
            status: { $in: ["pending", "approved"] },
            startDate: { $lte: allocation.endDate },
            endDate: { $gte: allocation.startDate }
        });

        const total = existing
            .filter((item) =>
                datesOverlap(
                    allocation.startDate,
                    allocation.endDate,
                    item.startDate,
                    item.endDate
                )
            )
            .reduce((sum, item) => sum + item.allocationPercentage, 0);

        if (total + allocation.allocationPercentage > 100) {
            return res.status(409).json({
                success: false,
                message: "Insufficient employee capacity"
            });
        }

        allocation.status = "approved";
        allocation.approvedBy = req.user._id;
        allocation.approvedAt = new Date();
        if (req.body?.managerNotes !== undefined) allocation.managerNotes = String(req.body.managerNotes).slice(0, 1000);
        allocation.allocatedAt = new Date();

        await allocation.save();

        res.status(200).json({
            success: true,
            message: "Allocation approved",
            allocation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// REJECT ALLOCATION
const rejectAllocation = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid allocation ID"
            });
        }

        const allocation = await Allocation.findOne({ _id: req.params.id, companyId: req.companyId });

        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        if (allocation.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending allocations can be rejected"
            });
        }

        allocation.status = "rejected";
        allocation.approvedBy = req.user._id;
        allocation.approvedAt = new Date();
        if (req.body?.managerNotes !== undefined) allocation.managerNotes = String(req.body.managerNotes).slice(0, 1000);

        await allocation.save();

        res.status(200).json({
            success: true,
            message: "Allocation rejected",
            allocation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// CANCEL ALLOCATION
const cancelAllocation = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid allocation ID"
            });
        }

        const allocation = await Allocation.findOne({ _id: req.params.id, companyId: req.companyId });

        if (!allocation) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        if (!["pending", "approved"].includes(allocation.status)) {
            return res.status(400).json({
                success: false,
                message: "This allocation cannot be cancelled"
            });
        }

        allocation.status = "cancelled";
        await allocation.save();

        res.status(200).json({
            success: true,
            message: "Allocation cancelled",
            allocation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const reviewAllocation = async (req, res) => {
    const decision = String(req.body?.decision || "").toUpperCase();
    if (decision === "APPROVED") return approveAllocation(req, res);
    if (decision === "REJECTED") return rejectAllocation(req, res);
    return res.status(400).json({ success: false, message: "Decision must be APPROVED or REJECTED" });
};

module.exports = {
    reviewAllocation,
    createAllocation,
    getAllAllocations,
    getAllocationById,
    approveAllocation,
    rejectAllocation,
    cancelAllocation
};