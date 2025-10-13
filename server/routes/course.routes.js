import express from "express";
import isUserAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utility/multer.js";
import {
  createCourse,
  editCourse,
  getAllCourses,
} from "../controllers/course.controller.js";
const tutorRouter = express.Router();

tutorRouter.post("/course/create", isUserAuthenticated, createCourse);
tutorRouter.post(
  "/course/edit",
  isUserAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);
tutorRouter.get("/course", getAllCourses);

export default tutorRouter;
