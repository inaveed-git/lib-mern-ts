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
            return next();
        }


        if (!process.env.JWTSECRET) {
            throw new Error("JWT secret is not defined");
        }


        const decoded = jwt.verify(token, process.env.JWTSECRET) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {

        next();
    }
};

export default verifyToken;