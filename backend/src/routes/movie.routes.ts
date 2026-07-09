import { Router } from "express";
import { Movie } from "../models/Movie.js";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get all movies (public)
router.get("/", async (req, res, next) => {
  try {
    const {
      page = "1",
      limit = "20",
      genre,
      year,
      sort = "-createdAt",
      category,
      status = "published",
    } = req.query;

    const filter: Record<string, unknown> = { status };
    if (genre) filter.genres = genre;
    if (year) filter.year = Number(year);
    if (category) filter.category = category;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [movies, total] = await Promise.all([
      Movie.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Movie.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: movies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get featured movies
router.get("/featured", async (_req, res, next) => {
  try {
    const movies = await Movie.find({
      isFeatured: true,
      status: "published",
    })
      .sort("-score")
      .limit(5)
      .lean();

    res.json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
});

// Get trending movies
router.get("/trending", async (_req, res, next) => {
  try {
    const movies = await Movie.find({ status: "published" })
      .sort("-views")
      .limit(10)
      .lean();

    res.json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
});

// Get movie by ID
router.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return next(new AppError("Movie not found", 404));

    // Increment views
    await Movie.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
});

// Create movie (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
});

// Update movie (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!movie) return next(new AppError("Movie not found", 404));
    res.json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
});

// Delete movie (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return next(new AppError("Movie not found", 404));
    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    next(error);
  }
});

export { router as movieRoutes };
