import multer from "multer";
import path from "node:path";
import fs from "fs";


const uploadDir = path.resolve(__dirname, "../public/data/uploads");




try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Directory created:", uploadDir);
    }
} catch (error) {
    console.error("Error creating directory:", error);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}`); // Set a unique file name
    },
});

const upload = multer({ storage });

export { upload };