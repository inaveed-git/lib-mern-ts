import express, { RequestHandler } from "express";
import {
    createLibrary,
    addBookToLibrary,
    getLibraryDetails,
    getUserLibraries,
    updateLibraryVisibility,  // Add this
    getPublicLibraries       // Add this
} from "../controllers/library.controller";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createLibrary);
router.get("/my-libraries", verifyToken, getUserLibraries);
router.get("/public", getPublicLibraries);
router.put("/:libraryId/visibility", verifyToken, updateLibraryVisibility);  // New endpoint
router.post("/:libraryId/books/:bookId", verifyToken, addBookToLibrary);
router.get("/:libraryId", getLibraryDetails);

export default router;