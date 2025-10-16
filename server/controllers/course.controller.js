import { Course } from "../models/course.model.js";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../utility/coudinary.js";
import fs from "fs/promises";

/////////////get courses ////////////////
export const getAllCourses = async (req, res) => {
  try {
    const course = await Course.find();
    if (course.length <= 0) {
      return res
        .status(200)
        .json({ message: "no course created yet! create now!", success: true });
    }
    return res
      .status(200)
      .json({ message: "courses fetched!", success: true, course });
  } catch (error) {
    console.log("gettin course error", error);
    return res.status(500).json({ message: "course creation server error" });
  }
};

/////////////create course///////////////////////
export const createCourse = async (req, res) => {
  const creator = req.userId;
  // console.log("creator", creator);
  const { courseTitle, courseSubtitle, category } = req.body;
  // console.log("req datas", courseTitle, category);

  if (!courseTitle || !category) {
    return res.status(400).json({
      message: "courseTitle and category is compulsary!",
      success: false,
    });
  }
  // ----------non string or emty string validation---------
  if (
    // typeof courseTitle !== "string" ||
    courseTitle.length <= 0
  ) {
    return res.status(400).json({
      message: "course title must be not empty or other than string",
      success: false,
    });
  }

  try {
    const createdCourse = await Course.create({
      courseTitle: courseTitle.trim(),
      courseSubtitle: courseSubtitle?.trim(),
      category,
      creator,
    });
    // console.log("createCourse", createdCourse, createdCourse._id);
    return res
      .status(201)
      .json({ message: "course created successfully", course: createdCourse });
  } catch (error) {
    console.log("course creation error", error);
    return res
      .status(500)
      .json({ message: error.message || "course creation server error" });
  }
};

/////////////////edit course///////////
export const editCourse = async (req, res) => {
  const {
    courseId,
    courseTitle,
    courseSubtitle,
    description,
    category,
    courseLevel,
    coursePrice,
  } = req.body;
  const userId = req.userId;
  const creator = userId;
  const courseThumbnail = req.file;

  if (!courseId || !courseTitle || !category || !creator) {
    return res.status(400).json({ message: "compulsary fields missing" });
  }
  try {
    const courseOldValues = await Course.findById({ _id: courseId });
    if (!courseOldValues) {
      return res.status(400).json({ message: "not valid id", success: false });
    }
    const isDuplicateTitle = await Course.findOne({
      courseTitle: courseTitle.trim(),
    });
    if (isDuplicateTitle) {
      return res.status(903).json({
        message: "title already exits, chooose another!",
        success: false,
      });
    }

    //upload to cloudinary
    const cloudinaryUrl = await uploadMediaToCloudinary(courseThumbnail.path, {
      folder: "LMS/coursesThumbnails",
    });

    // Delete the local temp file after the Cloudinary upload is complete
    await fs
      .unlink(courseThumbnail.path)
      .catch((err) =>
        console.error("Error deleting temp courseThumbnail:", err)
      );

    //delete old courseThumbnail from cloudinary
    if (courseOldValues.courseThumbnail) {
      const publicId = courseOldValues?.courseThumbnail
        ?.split("/upload/")
        .pop()
        .split("/")
        .slice(1)
        .join("/")
        .split(".")[0];
      console.log("publicId", publicId);
      const isOldPhotoDeleted = await deleteMediaFromCloudinary(publicId);
    }
    const updatedCourseValues = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        courseTitle: courseTitle.trim(),
        courseSubtitle: courseSubtitle?.trim(),
        category,
        coursePrice,
        description,
        courseLevel,
        courseThumbnail: cloudinaryUrl.secure_url,
      },
      { new: true }
    );

    return res.status(200).json({
      message: `course:-- ${courseTitle}-- updated into --${updatedCourseValues.courseTitle}`,
    });
  } catch (error) {
    console.log("course edit error", error);
  }
};
