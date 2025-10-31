import express from "express";
import isUserAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utility/multer.js";
import {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseById,
} from "../controllers/course.controller.js";
import {
  createLecture,
  getAllLecturesOfCourse,
} from "../controllers/lecture.controller.js";
const tutorRouter = express.Router();

tutorRouter.post("/course/create", isUserAuthenticated, createCourse);
tutorRouter.post(
  "/course/edit",
  isUserAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);
tutorRouter.get("/course", getAllCourses);
tutorRouter.get("/course/:courseId", isUserAuthenticated, getCourseById);

/////////////lecture routes//////////////////
tutorRouter.post("/course/:courseid/create-lecture", createLecture);
tutorRouter.get("/course/:courseId/lectures", getAllLecturesOfCourse);
export default tutorRouter;
