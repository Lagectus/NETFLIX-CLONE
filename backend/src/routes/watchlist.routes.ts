import { Router } from "express";
import { User } from "../models/User.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get watchlist
router.get("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.id).populate("watchlist");
    if (!user) return next(new AppError("User not found", 404));
    res.json({ success: true, data: user.watchlist });
  } catch (error) {
    next(error);
  }
});

// Add to watchlist
router.post("/:movieId", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $addToSet: { watchlist: req.params.movieId } },
      { new: true }
    ).populate("watchlist");
    if (!user) return next(new AppError("User not found", 404));
    res.json({ success: true, data: user.watchlist });
  } catch (error) {
    next(error);
  }
});

// Remove from watchlist
router.delete("/:movieId", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $pull: { watchlist: req.params.movieId } },
      { new: true }
    ).populate("watchlist");
    if (!user) return next(new AppError("User not found", 404));
    res.json({ success: true, data: user.watchlist });
  } catch (error) {
    next(error);
  }
});

export { router as watchlistRoutes };
