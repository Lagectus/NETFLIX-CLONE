import mongoose, { type Document } from "mongoose";
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
    cast: {
        name: string;
        character: string;
        photo: string;
    }[];
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
export declare const Movie: mongoose.Model<IMovie, {}, {}, {}, mongoose.Document<unknown, {}, IMovie, {}, {}> & IMovie & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Movie.d.ts.map