"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
const express_1 = require("express");
const Movie_js_1 = require("../models/Movie.js");
const router = (0, express_1.Router)();
exports.searchRoutes = router;
// Search movies
router.get("/", async (req, res, next) => {
    try {
        const { q, genre, year, sort = "-score", page = "1", limit = "20" } = req.query;
        const filter = { status: "published" };
        if (q) {
            filter.$text = { $search: q };
        }
        if (genre)
            filter.genres = genre;
        if (year)
            filter.year = Number(year);
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const [movies, total] = await Promise.all([
            Movie_js_1.Movie.find(filter)
                .sort(q ? { score: { $meta: "textScore" } } : sort)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean(),
            Movie_js_1.Movie.countDocuments(filter),
        ]);
        res.json({
            success: true,
            data: movies,
            query: q,
            pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
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
//# sourceMappingURL=search.routes.js.map