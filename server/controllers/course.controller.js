import { Course } from "../models/course.model.js";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../utility/coudinary.js";
import fs from "fs/promises";

/////////////get Allcourses ////////////////
export const getAllCourses = async (req, res) => {
  try {
    const course = await Course.find();
    if (course.length <= 0) {
      return res.status(200).json({
        message: "no course created yet! create now!",
        success: true,
        course: [],
      });
    }
    return res
      .status(200)
      .json({ message: "courses fetched!", success: true, course });
  } catch (error) {
    console.log("gettin course error", error);
    return res.status(500).json({ message: "course creation server error" });
  }
};
/////////////get  Published courses ////////////////
export const getPublishedCourses = async (req, res) => {
  try {
    const course = await Course.find({ isPublished: true }).lean().exec();
    // console.log("courses", course);
    if (course.length <= 0) {
      return res.status(200).json({
        message: "no course published yet! visit later!",
        success: true,
        course: [],
      });
    }
    return res
      .status(200)
      .json({ message: "courses published fetched!", success: true, course });
  } catch (error) {
    console.log("getting published course error", error);
    return res.status(500).json({ message: "course creation server error" });
  }
};

/////////////get course by id ////////////////
export const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  try {
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "id is must to get course", success: false });
    }
    const course = await Course.findById(courseId);
    if (course.length <= 0) {
      return res
        .status(400)
        .json({ message: "no course created yet", success: true, course: [] });
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
  const { courseTitle, courseSubtitle, category } = req.body;

  if (!courseTitle || !category) {
    return res.status(400).json({
      message: "courseTitle and category is compulsary!",
      success: false,
    });
  }
  // ----------non string or emty string validation---------
  if (typeof courseTitle !== "string" || courseTitle.length <= 0) {
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
    courseTitle,
    courseSubtitle,
    courseId,
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

  let tempFilePath = null;

  try {
    const courseOldValues = await Course.findById({ _id: courseId });
    if (!courseOldValues) {
      return res.status(400).json({ message: "not valid id", success: false });
    }

    let cloudinaryUrl = null;

    // Only upload to Cloudinary if a new thumbnail was provided
    if (courseThumbnail) {
      cloudinaryUrl = await uploadMediaToCloudinary(courseThumbnail.path, {
        folder: "LMS/coursesThumbnails",
      });
      tempFilePath = courseThumbnail.path; // Store path for cleanup

      // Delete old courseThumbnail from Cloudinary if new one is uploaded
      if (courseOldValues.courseThumbnail) {
        const publicId = courseOldValues.courseThumbnail
          ?.split("/upload/")
          .pop()
          ?.split("/")
          ?.slice(1)
          ?.join("/")
          ?.split(".")[0];
        console.log("publicId", publicId);
        if (publicId) {
          await deleteMediaFromCloudinary(publicId);
        }
      }
    }

    // Prepare update data
    const updateData = {
      courseTitle: courseTitle.trim(),
      courseSubtitle: courseSubtitle?.trim(),
      category,
      coursePrice: parseInt(coursePrice) || 0,
      description,
      courseLevel,
    };

    // Only update thumbnail if a new one was uploaded
    if (cloudinaryUrl) {
      updateData.courseThumbnail = cloudinaryUrl.secure_url;
    }

    const updatedCourseValues = await Course.findByIdAndUpdate(
      { _id: courseId },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: `course updated into --${updatedCourseValues.courseTitle}`,
      success: true,
      course: updatedCourseValues,
    });
  } catch (error) {
    console.log("course edit error", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  } finally {
    // Cleanup temp file only if it exists
    if (tempFilePath) {
      const cleanupTempFile = async (filePath) => {
        if (!filePath) return;

        try {
          await fs.access(filePath); // Check if file exists
          await fs.unlink(filePath);
          console.log("Temp file deleted:", filePath);
        } catch (error) {
          if (error.code === "ENOENT") {
            console.log("Temp file already deleted:", filePath);
          } else {
            console.error("Error deleting temp file:", error);
          }
        }
      };

      await cleanupTempFile(tempFilePath);
    }
  }
};

///////////publish course//////////////////
export const publishCourse = async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.body;

  try {
    if (!courseId) {
      return res.status(400).json({
        message: "courseId is  compulsary!",
        success: false,
      });
    }
    if (status === "publish") {
      await Course.findByIdAndUpdate({ _id: courseId }, { isPublished: true });
      return res.status(200).json({ message: "course is published now" });
    }
    if (status === "unpublish") {
      await Course.findByIdAndUpdate(courseId, { isPublished: false });
      return res.status(200).json({ message: "course is un-published now" });
    }
  } catch (error) {
    console.log("publish course error", error);
    return res
      .status(500)
      .json({ message: error.message || "course publish server error" });
  }
};
