"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = require("./config/database.js");
const auth_routes_js_1 = require("./routes/auth.routes.js");
const movie_routes_js_1 = require("./routes/movie.routes.js");
const upload_routes_js_1 = require("./routes/upload.routes.js");
const search_routes_js_1 = require("./routes/search.routes.js");
const watchlist_routes_js_1 = require("./routes/watchlist.routes.js");
const admin_routes_js_1 = require("./routes/admin.routes.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const logger_js_1 = require("./utils/logger.js");
/* ═══════════════════════════════════════════
   CineVault — Backend Server
   Express.js + MongoDB + Redis + Socket.io
   ═══════════════════════════════════════════ */
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Socket.io setup
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io = io;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
// Health check
app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "CineVault API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
// API Routes
app.use("/api/auth", auth_routes_js_1.authRoutes);
app.use("/api/movies", movie_routes_js_1.movieRoutes);
app.use("/api/upload", upload_routes_js_1.uploadRoutes);
app.use("/api/search", search_routes_js_1.searchRoutes);
app.use("/api/watchlist", watchlist_routes_js_1.watchlistRoutes);
app.use("/api/admin", admin_routes_js_1.adminRoutes);
// Error handler
app.use(errorHandler_js_1.errorHandler);
// Socket.io events
io.on("connection", (socket) => {
    logger_js_1.logger.info(`Socket connected: ${socket.id}`);
    socket.on("join-upload", (uploadId) => {
        socket.join(`upload-${uploadId}`);
    });
    socket.on("disconnect", () => {
        logger_js_1.logger.info(`Socket disconnected: ${socket.id}`);
    });
});
// Start server
const PORT = process.env.PORT || 5000;
async function start() {
    try {
        await (0, database_js_1.connectDB)();
        httpServer.listen(PORT, () => {
            logger_js_1.logger.info(`🚀 CineVault API running on port ${PORT}`);
            logger_js_1.logger.info(`📊 Health: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        logger_js_1.logger.error("Failed to start server:", error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=app.js.map