import mongoose from "mongoose"



const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("YOU ARE CONNECTED TO DB")
    } catch (error) {
        console.log("SOME ERROR OCCUR " + error)
    }


}


export default connectDB