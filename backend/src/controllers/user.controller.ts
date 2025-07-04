import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/auth.model";
import Book from "../models/book.model";
import Library from "../models/library.model";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only super admins can access this resource"
            });
        }

        const users = await User.find({}, { password: 0, __v: 0 })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get users"
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only super admins can access this resource"
            });
        }

        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account"
            });
        }


        await Book.deleteMany({ userId });


        await Library.updateMany(
            { admin: userId },
            { $set: { admin: null } }
        );


        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User and all associated data deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete user"
        });
    }
};

export const getAllBooks = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only super admins can access this resource"
            });
        }

        const books = await Book.find()
            .populate("userId", "username email")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get books"
        });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only super admins can access this resource"
            });
        }

        const bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ success: false, message: "Invalid book ID" });
        }


        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }


        await Library.updateMany(
            { books: bookId },
            { $pull: { books: bookId } }
        );


        await Book.findByIdAndDelete(bookId);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete book"
        });
    }
};