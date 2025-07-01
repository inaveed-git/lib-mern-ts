import express, { RequestHandler } from 'express';
import { getAllUsers, deleteUser, getAllBooks, deleteBook } from '../controllers/user.controller';
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

// Super admin routes
router.get("/", verifyToken, getAllUsers as RequestHandler);
router.delete("/:userId", verifyToken, deleteUser as RequestHandler);
router.get("/books/all", verifyToken, getAllBooks as RequestHandler);
router.delete("/books/:bookId", verifyToken, deleteBook as RequestHandler);

export default router;