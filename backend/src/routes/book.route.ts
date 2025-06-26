import express, { RequestHandler } from 'express';
import { addBook, getUserBooks } from '../controllers/book.controller';
import { upload } from '../middlewares/multer.middleware';
import verifyToken from '../middlewares/verifyToken';

const bookRouter = express.Router();


bookRouter.post("/add", verifyToken, upload.fields(
    [
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 }
    ]
), addBook as RequestHandler);


bookRouter.get("/my-books", verifyToken, getUserBooks as RequestHandler);



export default bookRouter; 