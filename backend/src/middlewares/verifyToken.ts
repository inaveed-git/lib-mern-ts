import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/auth.model";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return next(); // Continue without user
        }

        const decoded = jwt.verify(token, "thesecretkey") as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {
        // Continue even if token is invalid
        next();
    }
};

export default verifyToken;