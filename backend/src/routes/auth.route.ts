import express, { RequestHandler } from "express";
import { sigin, sigup } from "../controllers/auth.controller";


const router = express.Router();


router.post("/signup", sigup)
router.post("/signin", sigin as RequestHandler)


export default router;
