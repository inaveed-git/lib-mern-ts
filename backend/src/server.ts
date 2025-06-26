import express, { NextFunction, Request, Response } from "express";
import 'dotenv/config'
import connectDB from "./config/connectDB";
import cors from "cors"
import cookieParser from "cookie-parser"
import AuthRouter from "./routes/auth.route"
import bookRouter from "./routes/book.route";


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

// Remove this line: app.options('*', cors(corsOptions));

connectDB()

app.use("/api/v1/user", AuthRouter)
app.use("/api/v1/book", bookRouter)
// /api/add/book
// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`YOUR SERVER IS RUNNING ON PORT ${PORT}`)
});


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({
        success: false,
        message: error.message || "Something went wrong"
    });
});
