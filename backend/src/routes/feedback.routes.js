import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback
} from "../controllers/feedback.controller.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/", createFeedback);

// ADMIN
router.get("/admin", verifyAdminAccess, getAllFeedbacks);
router.delete("/admin/:id", verifyAdminAccess, deleteFeedback);

export default router;
