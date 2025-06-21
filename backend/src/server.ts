import express from "express";
import 'dotenv/config'
import connectDB from "./config/connectDB";

// Imporing the router form the route folder
import AuthRouter from "./routes/auth.route"

const app = express();
app.use(express.json())
connectDB()

// Using the Routers
app.use("/api/v1/user", AuthRouter)



const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log(`YOUR SERVER IS RUNNING ON PORT ${PORT}`)
})