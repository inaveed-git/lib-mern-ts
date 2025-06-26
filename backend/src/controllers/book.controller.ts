import { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import Book from "../models/book.model";
import { uploadOnCloudinary } from "../config/Cloudinary";
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







export const getUserBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.user?._id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return
        }

        const books = await Book.find({ userId: req.user._id.toString() }).sort({ createdAt: -1 });
        // You can also limit or paginate here if needed


        res.status(200).json({
            success: true,
            data: books,
        });
    } catch (error: any) {
        console.error("Error fetching books:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};