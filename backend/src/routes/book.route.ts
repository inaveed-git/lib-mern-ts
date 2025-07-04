import express, { RequestHandler } from 'express';
import { addBook, downloadBook, getDashboardStats, getUserBooks } from '../controllers/book.controller';
import { updateBookVisibility, getLibraryBooks } from "../controllers/book.controller";
import { upload } from '../middlewares/multer.middleware';
import verifyToken from '../middlewares/verifyToken';

const bookRouter = express.Router();


bookRouter.post("/add", verifyToken, upload.fields(
    [
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 }
    ]
), addBook as RequestHandler);


bookRouter.get("/dashboard-stats", verifyToken, getDashboardStats as RequestHandler);
bookRouter.get("/my-books", verifyToken, getUserBooks as RequestHandler);
bookRouter.get("/download/:bookId", downloadBook as RequestHandler);




bookRouter.put("/:bookId/visibility", verifyToken, updateBookVisibility as RequestHandler);


export default bookRouter; 