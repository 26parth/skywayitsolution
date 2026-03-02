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
router.get("/", verifyAdminAccess, getAllEnquiries);
router.delete("/:id", verifyAdminAccess, deleteEnquiry);

export default router;