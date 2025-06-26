import { Request, Response, NextFunction } from "express"
import User from "../models/auth.model";
import { fail } from "assert";
import { handleTokenDelivery, sendTokenResponse } from "../utils/vauthUtils";
import { Types } from "mongoose";



// auth.controller.ts
export const sigup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const isUser = await User.findOne({ email });

        if (isUser) {
            res.status(400).send("The User Already registered");
            return;
        }

        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            res.status(400).json({ message: "Username, email and password are required" });
            return;
        }

        const newUser = await User.create({ username, email, password });
        const { password: _, isSuperAdmin: __, ...user } = newUser.toObject();

        res.status(201).json({
            success: true,
            message: "USER SAVED SUCCESSFULLY",
            user
        });
    } catch (error) {
        next(error);
    }
};

export const sigin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }

        const token = sendTokenResponse((user._id as Types.ObjectId).toString(), user.isSuperAdmin);
        handleTokenDelivery(res, token);

        const { password: _, ...sanitizedUser } = user.toObject();
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token,
            user: sanitizedUser,
        });
    } catch (error) {
        next(error);
    }
};