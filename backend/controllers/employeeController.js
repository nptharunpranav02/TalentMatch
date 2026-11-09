
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const Allocation = require("../models/Allocation");

// Escape special characters in search input
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// 1. CREATE EMPLOYEE
const createEmployee = async (req, res) => {
    try {
        const {
            employeeId,
            name,
            email,
            department,
            designation,
            skills,
            experience,
            availability
        } = req.body;

        const newEmployee = await Employee.create({
            employeeId,
            name,
            email,
            department,
            designation,
            skills,
            experience,
            availability
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee: newEmployee
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Employee ID or email already exists"
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
            message: "Failed to create employee"
        });
    }
};

// 2. GET ALL EMPLOYEES
const getAllEmployees = async (req, res) => {
    try {
        const {
            search,
            department,
            skill,
            availability,
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));

        const filter = {};

        if (search) {
            const searchRegex = new RegExp(escapeRegex(search), "i");

            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { employeeId: searchRegex }
            ];
        }

        if (department) {
            filter.department = new RegExp(
                `^${escapeRegex(department)}$`,
                "i"
            );
        }

        if (skill) {
            filter.skills = {
                $regex: escapeRegex(skill),
                $options: "i"
            };
        }

        if (availability) {
            filter.availability = availability;
        }

        const skip = (pageNumber - 1) * limitNumber;

        const [employees, totalEmployees] = await Promise.all([
            Employee.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Employee.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            totalEmployees,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalEmployees / limitNumber),
            employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch employees"
        });
    }
};

// 3. GET EMPLOYEE BY ID
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch employee"
        });
    }
};

// 4. UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID"
            });
        }

        // Only allow approved fields to be updated
        const allowedFields = [
            "employeeId",
            "name",
            "email",
            "department",
            "designation",
            "skills",
            "experience",
            "availability"
        ];

        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        if (updateData.email) {
            updateData.email = updateData.email.trim().toLowerCase();
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Employee ID or email already exists"
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
            message: "Failed to update employee"
        });
    }
};

// 5. DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Preserve allocation history and prevent orphan references
        const existingAllocation = await Allocation.exists({
            employee: id
        });

        if (existingAllocation) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete employee with allocation history"
            });
        }

        await Employee.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete employee"
        });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
