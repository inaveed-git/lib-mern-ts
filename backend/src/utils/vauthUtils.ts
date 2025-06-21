import { Response } from "express"
import jwt from "jsonwebtoken"


const sendTokenResponse = (userid: string): string => {

    return jwt.sign({ id: userid }, "thesecretkey", { expiresIn: '1d' })

}



const handleTokenDelivery = (res: Response, token: string): void => {

    res.cookie(
        "token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
    )
}

export { sendTokenResponse, handleTokenDelivery }