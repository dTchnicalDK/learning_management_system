import { uploadMediaToCloudinary } from "../utility/coudinary.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

////////////Lecture Creation///////////////////
export const createLecture = async (req, res) => {
  // console.log("body", req.body);
  const { lectureTitle, lectureDescription, isPreviewFree, courseId } =
    req.body;
  // const courseId = req.params.courseId;
  console.log(
    "destructured req data,",
    lectureTitle,
    lectureDescription,
    courseId
  );

  try {
    if (!courseId || !lectureTitle || !isPreviewFree) {
      return res.status(400).json({
        message: "LectureTitle and courseId is mandatory!",
        success: false,
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }
    const createdLecture = await Lecture.create({
      lectureTitle,
      lectureDescription,
      isPreviewFree,
      course: courseId,
    });
    course.lectures.push(createdLecture._id);
    await course.save();
    console.log("createdLecture", createdLecture);
    return res.status(201).json({
      message: "Lecture created successfully",
      success: true,
      lecture: createdLecture,
      course: courseId,
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
  const { courseId, lectureId } = req.body;
  if (!courseId || !lectureId) {
    res
      .status(400)
      .json({ message: "mandatory fields are missing", success: false });
    const deletedLecture = await Lecture.findByIdAndDelete(lectureId);
    console.log("deletedLecture", deleteLecture);
    //remove lecture entry from course array
  }
  try {
  } catch (error) {
    console.log("deleteLecture error", error);
    return res.status(500).json({
      message: error.message || "deleteLecture internal server error",
    });
  }
};

////////////Get Lectures of course///////////////////
export const getAllLecturesOfCourse = async (req, res) => {
  // console.log("courseid", req.params);
  const { courseId } = req.params;
  // console.log("courseid", courseId, req.params);

  if (!courseId) {
    return res
      .status(400)
      .json({ message: "mandatory field is missing", success: false });
  }
  try {
    const lectures = await Lecture.find({ course: courseId }).sort({
      createdAt: 1,
    });
    res.status(200).json({
      message: "Lectures fetched successfully",
      success: true,
      lectures: lectures,
    });
  } catch (error) {
    console.log("deleteLecture error", error);
    return res.status(500).json({
      message: error.message || "deleteLecture internal server error",
    });
  }
};
