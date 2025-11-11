import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../utility/coudinary.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

////////////Lecture Creation///////////////////
export const createLecture = async (req, res) => {
  // console.log("body", req.body);
  const { lectureTitle, lectureDescription, isPreviewFree, courseId } =
    req.body;

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
  const {
    lectureTitle,
    lectureDescription,
    isPreviewFree,
    videoUrl,
    publicId,
    // courseId,
    // lectureId,
  } = req.body;

  const { courseId, lectureId } = req.params;

  try {
    if (
      // !videoUrl || !publicId ||
      !courseId ||
      !lectureId ||
      !lectureTitle
    ) {
      return res.status(400).json({
        success: false,
        message: "All mandatory fields are required",
      });
    }
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    //checking if lecture has already video uploaded
    const oldLectureVideo = await Lecture.findById(lectureId);
    if (oldLectureVideo && oldLectureVideo.publicId) {
      const deletedVideo = await deleteMediaFromCloudinary(
        oldLectureVideo.publicId
      );
      console.log("old video deleted successfully");
    } else {
      console.log("no old video found");
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        lectureTitle,
        lectureDescription,
        isPreviewFree: Boolean(isPreviewFree),
        videoUrl,
        publicId,
      },
      { new: true, runValidators: true }
    );
    if (!updatedLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Adding lecture id to course if not already present
    if (!course.lectures.includes(updatedLecture._id)) {
      course.lectures.push(updatedLecture._id);
      await course.save();
    }

    return res.status(200).json({
      message: "lecture updated successfully!",
      lecture: updatedLecture,
    });
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
////////////Get Lectures of course///////////////////
export const getLectureById = async (req, res) => {
  const { lectureId } = req.params;

  if (!lectureId) {
    return res
      .status(400)
      .json({ message: "mandatory field is missing", success: false });
  }
  try {
    const lecture = await Lecture.findById(lectureId);
    res.status(200).json({
      message: "Lecture fetched successfully",
      success: true,
      lecture,
    });
  } catch (error) {
    console.log("lecture error", error);
    return res.status(500).json({
      message: error.message || "getLectureById internal server error",
    });
  }
};
