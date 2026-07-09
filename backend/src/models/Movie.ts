import mongoose, { Schema, type Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  tagline: string;
  description: string;
  poster: string;
  backdrop: string;
  logo: string;
  trailer: string;
  videoUrl: string;
  year: number;
  rating: string;
  score: number;
  duration: number;
  genres: string[];
  cast: { name: string; character: string; photo: string }[];
  director: string;
  language: string;
  category: "movie" | "series";
  status: "draft" | "processing" | "published" | "archived";
  isFeatured: boolean;
  isOriginal: boolean;
  accentColor: string;
  hlsUrl: string;
  resolutions: string[];
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
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
  },
  { timestamps: true }
);

// Indexes for search & filtering
movieSchema.index({ title: "text", description: "text" });
movieSchema.index({ genres: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ score: -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ status: 1 });
movieSchema.index({ isFeatured: 1 });

export const Movie = mongoose.model<IMovie>("Movie", movieSchema);
