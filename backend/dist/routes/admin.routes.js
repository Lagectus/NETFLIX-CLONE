"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const User_js_1 = require("../models/User.js");
const Movie_js_1 = require("../models/Movie.js");
const WatchHistory_js_1 = require("../models/WatchHistory.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
exports.adminRoutes = router;
// All admin routes require auth + admin role
router.use(auth_middleware_js_1.authMiddleware, auth_middleware_js_1.adminMiddleware);
// Dashboard stats
router.get("/stats", async (_req, res, next) => {
    try {
        const [totalUsers, totalMovies, totalViews, recentUsers] = await Promise.all([
            User_js_1.User.countDocuments(),
            Movie_js_1.Movie.countDocuments(),
            Movie_js_1.Movie.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
            User_js_1.User.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            }),
        ]);
        res.json({
            success: true,
            data: {
                totalUsers,
                totalMovies,
                totalViews: totalViews[0]?.total || 0,
                newSignups: recentUsers,
                activeUsers: Math.floor(totalUsers * 0.3), // Simplified
                totalRevenue: totalUsers * 12.99, // Simplified
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Get all users (admin)
router.get("/users", async (req, res, next) => {
    try {
        const { page = "1", limit = "20" } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const [users, total] = await Promise.all([
            User_js_1.User.find()
                .sort("-createdAt")
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean(),
            User_js_1.User.countDocuments(),
        ]);
        res.json({
            success: true,
            data: users,
            pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
        next(error);
    }
});
// Get watch analytics
router.get("/analytics/watches", async (_req, res, next) => {
    try {
        const watches = await WatchHistory_js_1.WatchHistory.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastWatched" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 30 },
        ]);
        res.json({ success: true, data: watches });
    }
    catch (error) {
        next(error);
    }
});
// Genre distribution
router.get("/analytics/genres", async (_req, res, next) => {
    try {
        const genres = await Movie_js_1.Movie.aggregate([
            { $unwind: "$genres" },
            { $group: { _id: "$genres", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        res.json({ success: true, data: genres });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=admin.routes.js.map