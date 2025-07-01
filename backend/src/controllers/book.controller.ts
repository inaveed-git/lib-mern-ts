import { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import Book from "../models/book.model";
import { uploadOnCloudinary } from "../config/Cloudinary";
import Library from "../models/library.model";
// import createHttpError from "http-errors";

export const addBook = async (req: Request, res: Response, next: NextFunction) => {
    let coverImagePath = "";
    let filePath = "";

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const userId = req.user._id;

        const { title, author, genre, publishedYear, publisher } = req.body;

        if (!title || !author || !genre || !publishedYear || !publisher) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (!files?.coverImage?.[0] || !files?.file?.[0]) {
            return res.status(400).json({ success: false, message: "Cover image and book file are required" });
        }

        const coverImageFile = files.coverImage[0];
        const bookFile = files.file[0];

        // Set file paths
        const uploadsDir = path.join(__dirname, "../public/data/uploads");
        coverImagePath = path.join(uploadsDir, coverImageFile.filename);
        filePath = path.join(uploadsDir, bookFile.filename);

        // Check if files exist locally
        await fs.promises.access(coverImagePath);
        await fs.promises.access(filePath);

        // Upload to Cloudinary
        // const [coverImageResponse, fileResponse] = await Promise.all([
        //     uploadOnCloudinary({
        //         localPath: coverImagePath,
        //         fileName: coverImageFile.filename,
        //         folder: "coverImages",
        //         format: coverImageFile.mimetype.split("/").pop() || "jpg",
        //     }),
        //     uploadOnCloudinary({
        //         localPath: filePath,
        //         fileName: bookFile.filename,
        //         folder: "pdfs",
        //         format: bookFile.mimetype.split("/").pop() || "pdf",
        //     })
        // ]);


        // Upload to Cloudinary
        const coverImageResponse = await uploadOnCloudinary({
            localPath: coverImagePath,
            fileName: coverImageFile.filename,
            folder: "coverImages",
            format: coverImageFile.mimetype.split("/").pop() || "jpg",
        });

        const fileResponse = await uploadOnCloudinary({
            localPath: filePath,
            fileName: bookFile.filename,
            folder: "pdfs",
            format: bookFile.mimetype.split("/").pop() || "pdf",
        });


        if (!coverImageResponse?.secure_url || !fileResponse?.secure_url) {
            return res.status(500).json({ success: false, message: "Failed to upload files to Cloudinary" });
        }

        // Save to database
        const newBook = new Book({
            title,
            author,
            genre,
            publishedYear: Number(publishedYear),
            publisher,
            coverImage: coverImageResponse.secure_url,
            bookFile: fileResponse.secure_url,
            userId: userId,
        });

        await newBook.save();

        res.status(201).json({
            success: true,
            message: "Book added successfully!",
            data: newBook,
        });
    } catch (error: any) {
        console.error("Error adding book:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    } finally {
        // Cleanup local files
        try {
            if (coverImagePath) await fs.promises.unlink(coverImagePath);
        } catch (err) {
            console.error("Error deleting cover image:", err);
        }

        try {
            if (filePath) await fs.promises.unlink(filePath);
        } catch (err) {
            console.error("Error deleting book file:", err);
        }
    }
};







// src/controllers/book.controller.ts
export const getUserBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const books = await Book.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate("libraries", "name");

        res.status(200).json({
            success: true,
            data: books,
        });
    } catch (error: any) {
        console.error("Error fetching books:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};


// Update book visibility
// export const updateBookVisibility = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { bookId } = req.params;
//         const { isPublic } = req.body;

//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }

//         const book = await Book.findById(bookId);
//         if (!book) {
//             return res.status(404).json({ success: false, message: "Book not found" });
//         }

//         // Check if user owns the book
//         if (book.userId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ success: false, message: "Not authorized" });
//         }

//         book.isPublic = Boolean(isPublic);
//         await book.save();



//         res.status(200).json({
//             success: true,
//             message: "Book visibility updated!",
//             data: book
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             success: false,
//             message: error.message || "Server error"
//         });
//     }
// };






export const updateBookVisibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        const { isPublic } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        // Check if user owns the book
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        book.isPublic = Boolean(isPublic);
        await book.save();


        if (book.isPublic !== Boolean(isPublic)) {
            // Update all libraries containing this book
            await Library.updateMany(
                { books: book._id },
                { $set: { updatedAt: new Date() } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Book visibility updated!",
            data: book
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// Get books in a library
// book.controller.ts
export const getLibraryBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { libraryId } = req.params;
        const library = await Library.findById(libraryId);

        if (!library) {
            res.status(404).json({ success: false, message: "Library not found" });
            return; // Use return instead of returning res
        }

        if (!library.isPublic) {
            if (!req.user || req.user._id.toString() !== library.admin.toString()) {
                res.status(403).json({ success: false, message: "Not authorized" });
                return;
            }
        }

        const books = await Book.find({
            libraries: libraryId,
            isPublic: true
        });

        res.status(200).json({ success: true, data: books });
    } catch (error: any) {
        next(error); // Use Express error handling
    }
};








// Add to book.controller.ts
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Get counts for the current user
        const userBookCount = await Book.countDocuments({ userId: req.user._id });
        const userLibraryCount = await Library.countDocuments({ admin: req.user._id });

        // Get public counts (system-wide)
        const publicBookCount = await Book.countDocuments({ isPublic: true });
        const publicLibraryCount = await Library.countDocuments({ isPublic: true });

        res.status(200).json({
            success: true,
            data: { // Keep this as an object, not array
                userBookCount,
                userLibraryCount,
                publicBookCount,
                publicLibraryCount
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get dashboard stats"
        });
    }
};