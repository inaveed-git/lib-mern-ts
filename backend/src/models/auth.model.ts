import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcryptjs"


export interface Iuser extends Document {
    _id: Types.ObjectId; // Explicitly define as ObjectId
    username: string;
    email: string;
    password: string;
    isSuperAdmin: boolean;
    matchPassword: (matchPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<Iuser>({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isSuperAdmin: {
        type: Boolean,
        default: false,
        immutable: true,
        private: true
    },
}, { timestamps: true })


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next()


    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
        console.log(error)
    }

})


userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema);


export default User