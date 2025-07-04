import { v2 as cloudinary } from "cloudinary";


cloudinary.config({



    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});






interface Tcloudinary {
    resource_type?: "auto" | "image" | "video" | "raw"; // Optional with validation
    localPath: string;
    fileName: string;
    folder: string;
    format: string | undefined;
}


const uploadOnCloudinary = async (data: Tcloudinary) => {


    try {
        if (!data.localPath) {
            console.log("invalid file location")
        }




        const options = {
            resource_type: data.resource_type || "auto",
            public_id: data.fileName,
            folder: data.folder,
            format: data.format,
        };


        const response = await cloudinary.uploader.upload(data.localPath, options);



        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);




        return null;
    }
};

export { uploadOnCloudinary };