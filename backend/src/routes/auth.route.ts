import express, { RequestHandler } from "express";
import { sigin, signout, sigup } from "../controllers/auth.controller";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/signup", sigup);
router.post("/signin", sigin);


router.get('/signout', signout);


router.get('/me', verifyToken, (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
});

export default router;