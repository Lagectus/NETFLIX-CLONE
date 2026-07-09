"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_js_1 = require("./errorHandler.js");
function authMiddleware(req, _res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "") ||
        req.cookies?.token;
    if (!token) {
        return next(new errorHandler_js_1.AppError("Authentication required", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "cinevault-secret-key");
        req.user = decoded;
        next();
    }
    catch {
        return next(new errorHandler_js_1.AppError("Invalid or expired token", 401));
    }
}
function adminMiddleware(req, _res, next) {
    if (req.user?.role !== "admin") {
        return next(new errorHandler_js_1.AppError("Admin access required", 403));
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map