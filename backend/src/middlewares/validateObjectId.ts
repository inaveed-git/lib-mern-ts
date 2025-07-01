import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const validateObjectId = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName} ID`
            });
        }

        next();
    };
};

export default validateObjectId;