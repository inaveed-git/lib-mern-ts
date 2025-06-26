import express from "express";
import { sigin, sigup } from "../controllers/auth.controller";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/signup", sigup);
router.post("/signin", sigin);

router.get('/me', verifyToken, (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
});

export default router;