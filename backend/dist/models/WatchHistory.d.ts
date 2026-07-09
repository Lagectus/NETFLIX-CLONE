import mongoose, { type Document } from "mongoose";
export interface IWatchHistory extends Document {
    userId: mongoose.Types.ObjectId;
    movieId: mongoose.Types.ObjectId;
    episodeId?: mongoose.Types.ObjectId;
    progress: number;
    duration: number;
    completed: boolean;
    lastWatched: Date;
}
export declare const WatchHistory: mongoose.Model<IWatchHistory, {}, {}, {}, mongoose.Document<unknown, {}, IWatchHistory, {}, {}> & IWatchHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=WatchHistory.d.ts.map