import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: { type: String, required: true },
    lectureDescription: { type: String, required: true },

    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema, "lectures");
