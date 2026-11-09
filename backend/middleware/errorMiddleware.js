// Handle unknown routes
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = res.statusCode >= 400
        ? res.statusCode
        : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = {
    notFound,
    errorHandler
};