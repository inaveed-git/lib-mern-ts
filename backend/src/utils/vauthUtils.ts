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


    if (!process.env.JWTSECRET) {
        throw new Error("JWT secret is not defined");
    }

    return jwt.sign({ id: userId, isSuperAdmin }, process.env.JWTSECRET, {
        expiresIn: "7d"
    });
};