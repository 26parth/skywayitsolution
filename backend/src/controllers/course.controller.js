import Course from "../models/Course.model.js";
import asyncHandler from "express-async-handler";

// Admin adds a course
export const addCourse = asyncHandler(async (req, res) => {
    const { title, description, duration, price } = req.body;
    if (!title || !description || !duration || !price) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const course = await Course.create({ title, description, duration, price });
    res.status(201).json({ success: true, course });
});

// Get all courses (public)
export const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
});

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};