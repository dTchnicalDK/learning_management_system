import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

// Configuration
cloudinary.config({
  // cloud_name: 'dtek5slnq',
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Upload an image
export const uploadToMediaCloudinary = async (filePath) => {
  const uploadResult = await cloudinary.uploader
    .upload(filePath)
    .catch((error) => {
      console.log(error);
    });
  console.log("uploadResult", uploadResult);
  return uploadResult.secure_url;
};

//delete
