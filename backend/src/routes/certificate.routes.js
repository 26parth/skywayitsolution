import express from "express";
import upload from "../middleware/multer.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";
import { sendCertificateByAdmin } from "../controllers/certificate.controller.js";

const router = express.Router();

// ADMIN → SEND CERTIFICATE (ANY FILE FORMAT)
router.post(
  "/send",
  verifyAdminAccess,
  upload.single("certificate"),
  sendCertificateByAdmin
);

export default router;
