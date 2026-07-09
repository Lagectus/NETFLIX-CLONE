"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistRoutes = void 0;
const express_1 = require("express");
const User_js_1 = require("../models/User.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const router = (0, express_1.Router)();
exports.watchlistRoutes = router;
// Get watchlist
router.get("/", auth_middleware_js_1.authMiddleware, async (req, res, next) => {
    try {
        const user = await User_js_1.User.findById(req.user?.id).populate("watchlist");
        if (!user)
            return next(new errorHandler_js_1.AppError("User not found", 404));
        res.json({ success: true, data: user.watchlist });
    }
    catch (error) {
        next(error);
    }
});
// Add to watchlist
router.post("/:movieId", auth_middleware_js_1.authMiddleware, async (req, res, next) => {
    try {
        const user = await User_js_1.User.findByIdAndUpdate(req.user?.id, { $addToSet: { watchlist: req.params.movieId } }, { new: true }).populate("watchlist");
        if (!user)
            return next(new errorHandler_js_1.AppError("User not found", 404));
        res.json({ success: true, data: user.watchlist });
    }
    catch (error) {
        next(error);
    }
});
// Remove from watchlist
router.delete("/:movieId", auth_middleware_js_1.authMiddleware, async (req, res, next) => {
    try {
        const user = await User_js_1.User.findByIdAndUpdate(req.user?.id, { $pull: { watchlist: req.params.movieId } }, { new: true }).populate("watchlist");
        if (!user)
            return next(new errorHandler_js_1.AppError("User not found", 404));
        res.json({ success: true, data: user.watchlist });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=watchlist.routes.js.map