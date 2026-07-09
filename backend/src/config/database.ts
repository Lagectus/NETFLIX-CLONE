import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cinevault";

  try {
    await mongoose.connect(uri);
    logger.info("✅ MongoDB connected successfully");
  } catch (error) {
    logger.error("❌ MongoDB connection failed:", error);
    throw error;
  }

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB error:", err);
  });
}
