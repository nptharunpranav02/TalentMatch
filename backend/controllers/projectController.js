const mongoose = require("mongoose");
const Project = require("../models/Project");
const Allocation = require("../models/Allocation");

// CREATE PROJECT
const createProject = async (req, res) => {
    try {
        const {
            projectId,
            projectName,
            description,
            requiredSkills,
            minExperience,
            teamSize,
            startDate,
            endDate,
            status
        } = req.body;

        const project = await Project.create({
            projectId,
            projectName,
            description,
            requiredSkills,
            minExperience,
            teamSize,
            startDate,
            endDate,
            status,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Project ID already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ALL PROJECTS
const getAllProjects = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (status) filter.status = status;

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { projectName: { $regex: escapedSearch, $options: "i" } },
                { projectId: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

        const [projects, totalProjects] = await Promise.all([
            Project.find(filter)
                .populate("createdBy", "name email role")
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize),

            Project.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            totalProjects,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProjects / pageSize),
            projects
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET PROJECT BY ID
const getProjectById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email role");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        const allowedFields = [
            "projectName",
            "description",
            "requiredSkills",
            "minExperience",
            "teamSize",
            "startDate",
            "endDate",
            "status"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        Object.assign(project, updates);
        await project.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const hasAllocations = await Allocation.exists({
            project: project._id
        });

        if (hasAllocations) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete a project with allocation history"
            });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};