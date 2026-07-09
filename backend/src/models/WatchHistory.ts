import mongoose, { Schema, type Document } from "mongoose";

export interface IWatchHistory extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  episodeId?: mongoose.Types.ObjectId;
  progress: number;
  duration: number;
  completed: boolean;
  lastWatched: Date;
}

const watchHistorySchema = new Schema<IWatchHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
    progress: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    lastWatched: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

watchHistorySchema.index({ userId: 1, movieId: 1 }, { unique: true });
watchHistorySchema.index({ userId: 1, lastWatched: -1 });

export const WatchHistory = mongoose.model<IWatchHistory>(
  "WatchHistory",
  watchHistorySchema
);
