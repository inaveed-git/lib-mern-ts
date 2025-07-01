import { Request, Response, NextFunction } from "express";
import Library, { ILibrary } from "../models/library.model";
import Book, { IBook } from "../models/book.model";
import mongoose, { Types } from "mongoose";

// Create a library
export const createLibrary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, isPublic } = req.body;

        if (!req.user || !req.user._id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        const newLibrary = await Library.create({
            name,
            description,
            isPublic: Boolean(isPublic),
            admin: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Library created successfully!",
            data: newLibrary
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

// Get all libraries for a user
export const getUserLibraries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        const libraries = await Library.find({ admin: req.user._id })
            .populate("admin", "username")
            .populate("books", "title coverImage");

        res.status(200).json({
            success: true,
            data: libraries
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};
// ✅ Add book to library
export const addBookToLibrary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { libraryId, bookId } = req.params;

        if (!req.user || !req.user._id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        // ✅ Use generic <ILibrary> to tell TS the shape of the returned doc
        const library = await Library.findById<ILibrary>(libraryId);
        if (!library) {
            res.status(404).json({ success: false, message: "Library not found" });
            return
        }

        if (library.admin.toString() !== req.user._id.toString()) {
            res.status(403).json({ success: false, message: "Not authorized" });
            return
        }

        // ✅ Use generic <IBook> here too
        const book = await Book.findById<IBook>(bookId);
        if (!book) {
            res.status(404).json({ success: false, message: "Book not found" });
            return
        }

        const bookIdStr = (book._id as Types.ObjectId).toString();
        const libraryIdStr = (library._id as Types.ObjectId).toString();

        if (!library.books.some(b => b.toString() === bookIdStr)) {
            library.books.push(book._id as Types.ObjectId);
            await library.save();
        }

        if (!book.libraries.some(l => l.toString() === libraryIdStr)) {
            book.libraries.push(library._id as Types.ObjectId);
            await book.save();
        }

        res.status(200).json({
            success: true,
            message: "Book added to library successfully!"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// Get public or authorized library details
export const getLibraryDetails = async (req: Request, res: Response) => {
    try {
        const { libraryId } = req.params;
        const library = await Library.findById(libraryId)
            .populate("admin", "username");

        if (!library) {
            res.status(404).json({ success: false, message: "Library not found" });
            return
        }

        // Public library access check
        if (!library.isPublic) {
            if (!req.user || req.user._id.toString() !== library.admin.toString()) {
                res.status(403).json({ success: false, message: "Not authorized" });
                return
            }
        }

        // Conditionally populate books
        const bookQuery = library.isPublic ?
            { isPublic: true } :
            {};

        await library.populate({
            path: "books",
            match: bookQuery,
            select: "title author coverImage publishedYear"
        });

        res.status(200).json({
            success: true,
            data: library
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};


export const updateLibraryVisibility = async (req: Request, res: Response) => {
    try {
        const { libraryId } = req.params;
        const { isPublic } = req.body;

        if (!req.user?._id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        const library = await Library.findById(libraryId);
        if (!library) {
            res.status(404).json({ success: false, message: "Library not found" });
            return
        }

        // Check ownership
        if (library.admin.toString() !== req.user._id.toString()) {
            res.status(403).json({ success: false, message: "Not authorized" });
            return
        }

        library.isPublic = Boolean(isPublic);
        await library.save();

        res.status(200).json({
            success: true,
            message: "Library visibility updated!",
            data: library
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

export const getPublicLibraries = async (req: Request, res: Response) => {
    try {
        const publicLibraries = await Library.find({ isPublic: true })
            .populate("admin", "username")
            .select("-books");  // Exclude books array for performance

        res.status(200).json({ success: true, data: publicLibraries });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};