import express from "express";
import {
  createFeedback,
  getVisibleFeedbacks,
  getAllFeedbacks,
  togglePinFeedback,
  deleteFeedback
} from "../controllers/feedback.controller.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";
import { verifyUserAccess } from "../middleware/authMiddleware.js"; // 🔥 Path aur Name dono fix kar diye

const router = express.Router();

// PUBLIC: Login user hi feedback de sakega
router.post("/", verifyUserAccess, createFeedback); // 🔥 verifyUserAccess use kiya

// PUBLIC: Home page slider ke liye
router.get("/visible", getVisibleFeedbacks);

// ADMIN Routes
router.get("/", verifyAdminAccess, getAllFeedbacks); 
router.patch("/pin/:id", verifyAdminAccess, togglePinFeedback);
router.delete("/:id", verifyAdminAccess, deleteFeedback);

export default router;