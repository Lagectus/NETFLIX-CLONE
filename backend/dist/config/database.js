"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_js_1 = require("../utils/logger.js");
async function connectDB() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cinevault";
    try {
        await mongoose_1.default.connect(uri);
        logger_js_1.logger.info("✅ MongoDB connected successfully");
    }
    catch (error) {
        logger_js_1.logger.error("❌ MongoDB connection failed:", error);
        throw error;
    }
    mongoose_1.default.connection.on("error", (err) => {
        logger_js_1.logger.error("MongoDB error:", err);
    });
}
//# sourceMappingURL=database.js.map