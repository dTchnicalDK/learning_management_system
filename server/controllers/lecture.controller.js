import { Lecture } from "../models/lecture.model.js";
import { uploadMediaToCloudinary } from "../utility/coudinary.js";

////////////Lecture Creation///////////////////
export const createLecture = async (req, res) => {
  const { lectureTitle, description, isPreviewFree } = req.body;
  const courseId = req.params.courseId;
  console.log("reqData", lectureTitle, description, courseId);

  if (!courseId || !lectureTitle || !isPreviewFree) {
    return res.status(400).json({
      message: "LectureTitle and courseId is mandatory!",
      success: false,
    });
  }
  try {
    const createdLecture = await Lecture.create({
      lectureTitle,
      description,
      isPreviewFree,
    });
    console.log("createdLecture", createLecture);
    return res.status(201).json({
      message: "Lecture created successfully",
      success: true,
      lecture: createdLecture,
    });
  } catch (error) {
    console.log("createLecture error", error);
    return res.status(500).json({
      message: error.message || "lectureCreation internal server error",
    });
  }
};
////////////Lecture edit///////////////////
export const editLecture = async (req, res) => {
  try {
  } catch (error) {
    console.log("lectureEdtion error", error);
    return res.status(500).json({
      message: error.message || "lectureEdtion internal server error",
    });
  }
};
////////////Lecture Deletion///////////////////
export const deleteLecture = async (req, res) => {
  try {
  } catch (error) {
    console.log("deleteLecture error", error);
    return res.status(500).json({
      message: error.message || "deleteLecture internal server error",
    });
  }
};
