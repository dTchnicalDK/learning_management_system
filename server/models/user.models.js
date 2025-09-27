import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, `your password must be at least six character long!`],
      // select: false,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "tutor"],
      default: "student",
    },
    enrolledCourses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema, "Users");
