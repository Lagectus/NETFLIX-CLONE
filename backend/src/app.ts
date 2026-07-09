import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { authRoutes } from "./routes/auth.routes.js";
import { movieRoutes } from "./routes/movie.routes.js";
import { uploadRoutes } from "./routes/upload.routes.js";
import { searchRoutes } from "./routes/search.routes.js";
import { watchlistRoutes } from "./routes/watchlist.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

/* ═══════════════════════════════════════════
   CineVault — Backend Server
   Express.js + MongoDB + Redis + Socket.io
   ═══════════════════════════════════════════ */

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

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
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

// Socket.io events
io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("join-upload", (uploadId: string) => {
    socket.join(`upload-${uploadId}`);
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in controllers
export { io };

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      logger.info(`🚀 CineVault API running on port ${PORT}`);
      logger.info(`📊 Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
