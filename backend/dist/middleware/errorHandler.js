"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
const logger_js_1 = require("../utils/logger.js");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    const statusCode = "statusCode" in err ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    logger_js_1.logger.error(`${statusCode}: ${message}`, err.stack);
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}
//# sourceMappingURL=errorHandler.js.map