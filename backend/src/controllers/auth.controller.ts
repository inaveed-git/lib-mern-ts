import { Request, Response } from "express"
import User from "../models/auth.model";
import { fail } from "assert";
import { handleTokenDelivery, sendTokenResponse } from "../utils/vauthUtils";
import { Types } from "mongoose";



export const sigup = async (req: Request, res: Response): Promise<any> => {

    const { username, email, password } = req.body;

    const isUser = await User.findOne({ email })
    if (isUser) {

        return res.send("The User Already registered")
    }

    if (
        !username || username.trim() == '' ||
        !email || email.trim() == '' ||
        !password || password.trim() == ''

    ) {
        return res.status(400).json({
            message: "Username , email and password cant invalid"
        })
    }

    const newUser = await User.create({
        username, email, password
    })

    const { password: _, isSuperAdmin: __, ...user } = newUser.toObject();




    return res.status(201).json({
        succes: true,
        message: "USER SAVED SUCCESSFULLY",
        user
    })

}


export const sigin = async (req: Request, res: Response) => {
    const { email, password } = req.body;




    try {

        const user = await User.findOne({ email }).select("+password");

        if (!user || (await user.matchPassword(password))) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"

            })
        }

        const token = sendTokenResponse((user._id as Types.ObjectId).toString())
        handleTokenDelivery(res, token);




        const { password: _, isSuperAdmin: __, ...newUser } = user.toObject()

        return res.status(201).json({
            success: true,
            message: "User sigin successfully",
            token,
            newUser
        })

    } catch (error) {
        console.log(`Some error occur ${error}`)
    }

}