"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRoutes = void 0;
const express_1 = require("express");
const Movie_js_1 = require("../models/Movie.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const router = (0, express_1.Router)();
exports.movieRoutes = router;
// Get all movies (public)
router.get("/", async (req, res, next) => {
    try {
        const { page = "1", limit = "20", genre, year, sort = "-createdAt", category, status = "published", } = req.query;
        const filter = { status };
        if (genre)
            filter.genres = genre;
        if (year)
            filter.year = Number(year);
        if (category)
            filter.category = category;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const [movies, total] = await Promise.all([
            Movie_js_1.Movie.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Movie_js_1.Movie.countDocuments(filter),
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
    }
    catch (error) {
        next(error);
    }
});
// Get featured movies
router.get("/featured", async (_req, res, next) => {
    try {
        const movies = await Movie_js_1.Movie.find({
            isFeatured: true,
            status: "published",
        })
            .sort("-score")
            .limit(5)
            .lean();
        res.json({ success: true, data: movies });
    }
    catch (error) {
        next(error);
    }
});
// Get trending movies
router.get("/trending", async (_req, res, next) => {
    try {
        const movies = await Movie_js_1.Movie.find({ status: "published" })
            .sort("-views")
            .limit(10)
            .lean();
        res.json({ success: true, data: movies });
    }
    catch (error) {
        next(error);
    }
});
// Get movie by ID
router.get("/:id", async (req, res, next) => {
    try {
        const movie = await Movie_js_1.Movie.findById(req.params.id).lean();
        if (!movie)
            return next(new errorHandler_js_1.AppError("Movie not found", 404));
        // Increment views
        await Movie_js_1.Movie.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ success: true, data: movie });
    }
    catch (error) {
        next(error);
    }
});
// Create movie (admin only)
router.post("/", auth_middleware_js_1.authMiddleware, auth_middleware_js_1.adminMiddleware, async (req, res, next) => {
    try {
        const movie = await Movie_js_1.Movie.create(req.body);
        res.status(201).json({ success: true, data: movie });
    }
    catch (error) {
        next(error);
    }
});
// Update movie (admin only)
router.put("/:id", auth_middleware_js_1.authMiddleware, auth_middleware_js_1.adminMiddleware, async (req, res, next) => {
    try {
        const movie = await Movie_js_1.Movie.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!movie)
            return next(new errorHandler_js_1.AppError("Movie not found", 404));
        res.json({ success: true, data: movie });
    }
    catch (error) {
        next(error);
    }
});
// Delete movie (admin only)
router.delete("/:id", auth_middleware_js_1.authMiddleware, auth_middleware_js_1.adminMiddleware, async (req, res, next) => {
    try {
        const movie = await Movie_js_1.Movie.findByIdAndDelete(req.params.id);
        if (!movie)
            return next(new errorHandler_js_1.AppError("Movie not found", 404));
        res.json({ success: true, message: "Movie deleted" });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=movie.routes.js.map