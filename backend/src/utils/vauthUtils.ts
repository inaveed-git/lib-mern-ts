import { Response } from "express"
import jwt from "jsonwebtoken"

export const handleTokenDelivery = (res: Response, token: string): void => {
    // const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        // secure: isProduction,
        // sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const sendTokenResponse = (userId: string, isSuperAdmin: boolean): string => {
    return jwt.sign({ id: userId, isSuperAdmin }, "thesecretkey", {
        expiresIn: "7d"
    });
};