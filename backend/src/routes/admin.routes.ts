import { Router } from "express";
import { User } from "../models/User.js";
import { Movie } from "../models/Movie.js";
import { WatchHistory } from "../models/WatchHistory.js";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// Dashboard stats
router.get("/stats", async (_req: AuthRequest, res, next) => {
  try {
    const [totalUsers, totalMovies, totalViews, recentUsers] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Movie.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      User.countDocuments({
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
  } catch (error) {
    next(error);
  }
});

// Get all users (admin)
router.get("/users", async (req: AuthRequest, res, next) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const [users, total] = await Promise.all([
      User.find()
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

// Get watch analytics
router.get("/analytics/watches", async (_req: AuthRequest, res, next) => {
  try {
    const watches = await WatchHistory.aggregate([
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
  } catch (error) {
    next(error);
  }
});

// Genre distribution
router.get("/analytics/genres", async (_req: AuthRequest, res, next) => {
  try {
    const genres = await Movie.aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: genres });
  } catch (error) {
    next(error);
  }
});

export { router as adminRoutes };
