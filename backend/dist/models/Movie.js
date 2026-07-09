"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, index: "text" },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    backdrop: { type: String, default: "" },
    logo: { type: String, default: "" },
    trailer: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    year: { type: Number, required: true },
    rating: { type: String, default: "PG-13" },
    score: { type: Number, default: 0, min: 0, max: 10 },
    duration: { type: Number, required: true },
    genres: [{ type: String }],
    cast: [
        {
            name: String,
            character: String,
            photo: String,
        },
    ],
    director: { type: String, default: "" },
    language: { type: String, default: "English" },
    category: {
        type: String,
        enum: ["movie", "series"],
        default: "movie",
    },
    status: {
        type: String,
        enum: ["draft", "processing", "published", "archived"],
        default: "draft",
    },
    isFeatured: { type: Boolean, default: false },
    isOriginal: { type: Boolean, default: false },
    accentColor: { type: String, default: "#2563EB" },
    hlsUrl: { type: String, default: "" },
    resolutions: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
}, { timestamps: true });
// Indexes for search & filtering
movieSchema.index({ title: "text", description: "text" });
movieSchema.index({ genres: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ score: -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ status: 1 });
movieSchema.index({ isFeatured: 1 });
exports.Movie = mongoose_1.default.model("Movie", movieSchema);
//# sourceMappingURL=Movie.js.map