import express from "express";
import upload from "../utility/multer.js";
import { generateSign, uploadMediaToCloudinary } from "../utility/coudinary.js";
import fs from "fs/promises";
const mediaRouter = express.Router();

mediaRouter.post(
  "/upload/video",
  upload.single("lectureVideo"),
  async (req, res) => {
    let tempVideoPath;
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
      tempVideoPath = lectureVideo;

      return res
        .status(201)
        .json({ message: "video uploaded!", uploadedVideoInfo });
    } catch (error) {
      console.log("video lecture upload error", error);
    } finally {
      //cleaing video temp file
      if (tempVideoPath) {
        const cleanupTempFile = async (filePath) => {
          if (!filePath) return;
          try {
            await fs.access(filePath);
            await fs.unlink(filePath);
          } catch (error) {
            if (error.code === "ENOENT") {
              console.log("Temp file already deleted:", filePath);
            } else {
              console.error("Error deleting temp file:", error);
            }
          }
        };
        await cleanupTempFile(tempVideoPath);
      }
    }
  }
);
mediaRouter.get("/signature", generateSign);

export default mediaRouter;
