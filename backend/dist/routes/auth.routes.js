"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const User_js_1 = require("../models/User.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const JWT_SECRET = process.env.JWT_SECRET || "cinevault-secret-key";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
// Register
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_js_1.User.findOne({ email });
        if (existingUser) {
            return next(new errorHandler_js_1.AppError("Email already registered", 400));
        }
        const user = await User_js_1.User.create({ name, email, password });
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            data: {
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_js_1.User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return next(new errorHandler_js_1.AppError("Invalid email or password", 401));
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            data: {
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Get current user
router.get("/me", auth_middleware_js_1.authMiddleware, async (req, res, next) => {
    try {
        const user = await User_js_1.User.findById(req.user?.id);
        if (!user)
            return next(new errorHandler_js_1.AppError("User not found", 404));
        res.json({
            success: true,
            data: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        });
    }
    catch (error) {
        next(error);
    }
});
// Logout
router.post("/logout", (_req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out" });
});
//# sourceMappingURL=auth.routes.js.map