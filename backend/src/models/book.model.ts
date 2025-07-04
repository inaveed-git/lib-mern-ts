import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBook extends Document {
    title: string;
    author: string;
    genre: string;
    publishedYear: number;
    publisher: string;
    coverImage?: string;
    bookFile?: string;
    userId: Types.ObjectId;
    libraries: Types.ObjectId[];
    isPublic: boolean;
}

const BookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    publisher: { type: String, required: true },
    coverImage: { type: String },
    bookFile: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    libraries: [{
        type: Schema.Types.ObjectId,
        ref: "Library"
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Book = mongoose.model<IBook>("Book", BookSchema);
export default Book;