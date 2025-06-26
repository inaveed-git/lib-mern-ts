import { Response } from "express"
import jwt from "jsonwebtoken"

export const handleTokenDelivery = (res: Response, token: string): void => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};


export const sendTokenResponse = (userId: string, isSuperAdmin: boolean): string => {
    return jwt.sign({ id: userId, isSuperAdmin }, "thesecretkey", {
        expiresIn: "7d"
    });
};