import express from "express";
import isUserAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utility/multer.js";
import {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseById,
  getPublishedCourses,
  publishCourse,
} from "../controllers/course.controller.js";
import {
  createLecture,
  deleteLecture,
  editLecture,
  getAllLecturesOfCourse,
  getLectureById,
} from "../controllers/lecture.controller.js";
const tutorRouter = express.Router();

tutorRouter.post("/course/create", isUserAuthenticated, createCourse);
tutorRouter.post(
  "/course/edit",
  isUserAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);
tutorRouter.get("/course/published", getPublishedCourses);
tutorRouter.get("/course", getAllCourses);
tutorRouter.get("/course/:courseId", isUserAuthenticated, getCourseById);
tutorRouter.post(
  "/course/:courseId/publish",
  isUserAuthenticated,
  publishCourse
);

/////////////lecture routes//////////////////
tutorRouter.post("/course/:courseId/create-lecture", createLecture);
tutorRouter.get("/course/:courseId/lectures", getAllLecturesOfCourse);
tutorRouter.get("/course/:courseId/lecture/:lectureId", getLectureById);
tutorRouter.put("/course/:courseId/lecture/:lectureId/edit", editLecture);
tutorRouter.delete(
  "/course/:courseId/lecture/:lectureId/delete",
  deleteLecture
);
export default tutorRouter;
