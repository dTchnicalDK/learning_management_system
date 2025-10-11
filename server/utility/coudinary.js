import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Upload an image
export const uploadToMediaCloudinary = async (file) => {
  try {
    const uploadResult = await cloudinary.uploader
      .upload(file, { resource_type: "auto", folder: "LMS/profilePhoto" })
      .catch((error) => {
        console.log(error);
      });
    return uploadResult;
  } catch (error) {
    console.log("coudinary upload error", error);
  }
};

//delete media
export const deleteMediaFromCloudinary = async (publicId) => {
  if (!publicId) {
    return { result: "publicId missing!" };
  }
  try {
    const isDeleteSuccessfull = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    });
    console.log("cloudinary resp", isDeleteSuccessfull);
    if (isDeleteSuccessfull.result === "ok") {
      console.log("deleted");
      return isDeleteSuccessfull;
    }
  } catch (error) {
    console.log("delete from cloudinary error", error);
  }
};

//delete video from cloudinary
export const deleteVideoFromCloudinary = async (videoPublicId) => {
  try {
    const isVideoDeleted = await cloudinary.uploader.destroy(videoPublicId, {
      resource_type: "video",
    });
  } catch (error) {
    console.log("video delete error from cloudinary", error);
  }
};
