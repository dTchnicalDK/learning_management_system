import mongoose, { Types } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      unique: true,
    },
    courseSubtitle: {
      type: String,
    },
    description: { type: String },
    category: { type: String, required: true },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advance"],
    },
    coursePrice: { type: Number, default: 0 },
    courseThumbnail: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    enrolledStudents: { type: mongoose.Schema.Types.ObjectId },
    lectures: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema, "courses");
