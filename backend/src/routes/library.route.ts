import express from "express";
import {
    createLibrary,
    addBookToLibrary,
    getLibraryDetails,
    getUserLibraries,
    updateLibraryVisibility,
    getPublicLibraries
} from "../controllers/library.controller";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createLibrary);
router.get("/my-libraries", verifyToken, getUserLibraries);
router.get("/public", getPublicLibraries);
router.put("/:libraryId/visibility", verifyToken, updateLibraryVisibility);
router.post("/:libraryId/books/:bookId", verifyToken, addBookToLibrary);
router.get("/:libraryId", getLibraryDetails);

export default router;