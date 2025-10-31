import express from "express";
import { createLecture } from "../controllers/lecture.controller.js";
const lectureRouter = express.Router();

// lectureRouter.post("/course/:courseid/create-lecture", createLecture);

export default lectureRouter;
