import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  deleteEnquiry
} from "../controllers/enquiry.controller.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/", createEnquiry);

// ADMIN
router.get("/admin", verifyAdminAccess, getAllEnquiries);
router.delete("/admin/:id", verifyAdminAccess, deleteEnquiry);

export default router;
