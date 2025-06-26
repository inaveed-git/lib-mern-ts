// src/models/book.model.ts
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
}, { timestamps: true });

const Book = mongoose.model<IBook>("Book", BookSchema);
export default Book;