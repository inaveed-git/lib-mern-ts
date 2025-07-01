import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILibrary extends Document {
    name: string;
    description?: string;
    isPublic: boolean;
    admin: Types.ObjectId; // User who created the library
    books: Types.ObjectId[]; // Books in this library
}

const LibrarySchema = new Schema<ILibrary>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }]
}, { timestamps: true });

const Library = mongoose.model<ILibrary>("Library", LibrarySchema);
export default Library;