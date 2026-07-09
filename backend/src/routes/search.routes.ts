import { Router } from "express";
import { Movie } from "../models/Movie.js";

const router = Router();

// Search movies
router.get("/", async (req, res, next) => {
  try {
    const { q, genre, year, sort = "-score", page = "1", limit = "20" } = req.query;

    const filter: Record<string, unknown> = { status: "published" };

    if (q) {
      filter.$text = { $search: q as string };
    }
    if (genre) filter.genres = genre;
    if (year) filter.year = Number(year);

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const [movies, total] = await Promise.all([
      Movie.find(filter)
        .sort(q ? { score: { $meta: "textScore" } } : (sort as string))
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Movie.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: movies,
      query: q,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

// Trending searches (mock)
router.get("/trending", (_req, res) => {
  res.json({
    success: true,
    data: ["Sci-Fi", "Action", "Thriller", "Top Rated", "New Releases"],
  });
});

export { router as searchRoutes };
