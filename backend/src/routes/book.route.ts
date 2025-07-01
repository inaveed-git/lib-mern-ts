import express, { RequestHandler } from 'express';
import { addBook, getDashboardStats, getUserBooks } from '../controllers/book.controller';
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



// Add these to your existing routes
bookRouter.put("/:bookId/visibility", verifyToken, updateBookVisibility as RequestHandler);
// bookRouter.get("/library/:libraryId", getLibraryBooks);

// bookRouter.get("/check", verifyToken, (req, res) => {
//     console.log(req.user.id, "this is the first check")
//     console.log(req.user._id, "this is the SECOUND check")

//     const user1 = req.user.id;
//     const user2 = req.user
//     const user3 = req.user._id


//     res.status(201).json({
//         user1,
//         user2,
//         user3,
//         message: "route running"
//     })

// })

export default bookRouter; 