const Allocation = require("../models/Allocation");

const checkAllocationCapacity = async ({
    employeeId,
    projectId,
    companyId,
    startDate,
    endDate,
    percentage,
    session,
    excludeAllocationId
}) => {
    const filter = {
        companyId,
        status: { $in: ["pending", "approved"] },
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
    };

    const employeeFilter = {
        ...filter,
        employee: employeeId
    };

    const projectFilter = {
        ...filter,
        project: projectId
    };

    if (excludeAllocationId) {
        employeeFilter._id = { $ne: excludeAllocationId };
        projectFilter._id = { $ne: excludeAllocationId };
    }

    const employeeAllocations = await Allocation.find(employeeFilter)
        .session(session);

    const currentPercentage = employeeAllocations.reduce(
        (total, allocation) => total + allocation.allocationPercentage,
        0
    );

    if (currentPercentage + percentage > 100) {
        const error = new Error("Employee allocation would exceed 100%");
        error.statusCode = 409;
        throw error;
    }

    // Prevent duplicate overlapping assignments to the same project.
    const duplicate = employeeAllocations.some(
        allocation => allocation.project.toString() === projectId.toString()
    );

    if (duplicate) {
        const error = new Error(
            "Employee already has an overlapping allocation to this project"
        );
        error.statusCode = 409;
        throw error;
    }

    const projectAllocations = await Allocation.find(projectFilter)
        .session(session);

    const employeeIds = new Set(
        projectAllocations.map(allocation => allocation.employee.toString())
    );

    employeeIds.add(employeeId.toString());

    return {
        currentPercentage,
        projectedTeamSize: employeeIds.size
    };
};

module.exports = checkAllocationCapacity;