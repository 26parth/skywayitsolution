import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", // User se link kiya taaki pic/name wahan se mile
      required: true 
    },
    feedback: { type: String, required: true, trim: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);