import Feedback from "../models/Feedback.model.js";

// POST: Create Feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;
    const newFeedback = await Feedback.create({
      userId: req.user._id, // 🔥 Ye req.user ab authMiddleware se aayega
      feedback
    });
    res.json({ success: true, newFeedback });
  } catch (err) { next(err); }
};

// GET: Visible for Home Slider
export const getVisibleFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ isPinned: true })
      .populate("userId", "fullname email profilePic isGoogleUser")
      .sort({ updatedAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) { next(err); }
};

// GET: Admin All Feedbacks
export const getAllFeedbacks = async (req, res, next) => {
  try {
    // 🔥 Yahan bhi populate add kiya taaki Admin ko user details dikhein
    const feedbacks = await Feedback.find()
      .populate("userId", "fullname email profilePic")
      .sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) { next(err); }
};

// PATCH: Toggle Pin
export const togglePinFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Not found" });

    feedback.isPinned = !feedback.isPinned;
    await feedback.save();

    res.json({ success: true, message: "Status updated", feedback });
  } catch (err) { next(err); }
};

// DELETE: Feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) { next(err); }
};