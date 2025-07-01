// src/index.ts
import express, { NextFunction, Request, Response } from "express";
import 'dotenv/config'
import connectDB from "./config/connectDB";
import cors from "cors"
import cookieParser from "cookie-parser"
import AuthRouter from "./routes/auth.route"
import bookRouter from "./routes/book.route";
import libraryRouter from "./routes/library.route"; // Renamed for consistency
import userRouter from "./routes/user.route"
const app = express();
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:5173', 'https://myshelflib.netlify.app'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));
connectDB();

app.use("/api/v1/user", AuthRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/library", libraryRouter); // Changed to /api/v1/library
app.use("/api/v1/user", userRouter)

// Error handlers
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`YOUR SERVER IS RUNNING ON PORT ${PORT}`)
});