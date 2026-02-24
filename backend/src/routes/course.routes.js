import express from "express";
import { addCourse, getCourses, getAllCourses  } from "../controllers/course.controller.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin adds a course
router.post("/", verifyAdminAccess, addCourse);

// course.routes.js
router.get("/", getCourses); // ✅ PUBLIC
router.get("/", getAllCourses);

export default router;
