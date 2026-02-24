import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
