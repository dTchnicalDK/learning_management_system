import express from "express";
import upload from "../utility/multer.js";
import { uploadMediaToCloudinary } from "../utility/coudinary.js";
const mediaRouter = express.Router();

mediaRouter.post(
  "/upload/video",
  upload.single("lectureVideo"),
  async (req, res) => {
    try {
      const lectureVideo = req.file.path;

      if (!lectureVideo) {
        return res
          .status(400)
          .json({ message: "select file first to upload", success: false });
      }
      const uploadedVideoInfo = await uploadMediaToCloudinary(lectureVideo, {
        folder: "LMS/lectureVideo",
      });

      return res
        .status(201)
        .json({ message: "video uploaded!", uploadedVideoInfo });
    } catch (error) {
      console.log("video lecture upload error", error);
    }
  }
);

export default mediaRouter;
