const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Allocation = require("../models/Allocation");

// GET DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalEmployees,
            availableEmployees,
            unavailableEmployees,
            totalProjects,
            activeProjects,
            planningProjects,
            completedProjects,
            pendingAllocations,
            approvedAllocations,
            rejectedAllocations
        ] = await Promise.all([
            Employee.countDocuments(),
            Employee.countDocuments({ availability: "available" }),
            Employee.countDocuments({ availability: "unavailable" }),
            Project.countDocuments(),
            Project.countDocuments({ status: "active" }),
            Project.countDocuments({ status: "planning" }),
            Project.countDocuments({ status: "completed" }),
            Allocation.countDocuments({ status: "pending" }),
            Allocation.countDocuments({ status: "approved" }),
            Allocation.countDocuments({ status: "rejected" })
        ]);

        // Employees with at least one currently approved allocation
        const allocatedEmployeeIds = await Allocation.distinct("employee", {
            status: "approved",
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        const allocatedCount = allocatedEmployeeIds.length;

        // Bench = available employees without a current approved allocation
        const benchEmployees = Math.max(
            0,
            availableEmployees - allocatedCount
        );

        res.status(200).json({
            success: true,
            employees: {
                total: totalEmployees,
                available: availableEmployees,
                unavailable: unavailableEmployees,
                allocated: allocatedCount,
                bench: benchEmployees
            },
            projects: {
                total: totalProjects,
                active: activeProjects,
                planning: planningProjects,
                completed: completedProjects
            },
            allocations: {
                pending: pendingAllocations,
                approved: approvedAllocations,
                rejected: rejectedAllocations
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard statistics"
        });
    }
};

// GET EMPLOYEE UTILIZATION
const getEmployeeUtilization = async (req, res) => {
    try {
        const employees = await Employee.find()
            .select("employeeId name department designation");

        const now = new Date();

        const utilization = await Promise.all(
            employees.map(async (employee) => {
                const allocations = await Allocation.find({
                    employee: employee._id,
                    status: "approved",
                    startDate: { $lte: now },
                    endDate: { $gte: now }
                });

                const percentage = allocations.reduce(
                    (total, allocation) =>
                        total + allocation.allocationPercentage,
                    0
                );

                return {
                    employeeId: employee.employeeId,
                    name: employee.name,
                    department: employee.department,
                    designation: employee.designation,
                    utilization: percentage,
                    benchPercentage: Math.max(0, 100 - percentage)
                };
            })
        );

        res.status(200).json({
            success: true,
            totalEmployees: utilization.length,
            utilization
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch employee utilization"
        });
    }
};
module.exports = {
    getDashboardStats,
    getEmployeeUtilization
};