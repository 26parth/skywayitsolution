import { Router } from "express";
import upload from "../middleware/multer.js";
import { verifyUserAccess } from "../middleware/authMiddleware.js";
import {
  createAdmission,
  getAdmission,
  updateAdmission,
  deleteAdmission,
  getAllAdmissions,
  addPayment,
  updatePayment,
  deletePayment
} from "../controllers/admission.controller.js";

const router = Router();

// 🔥 CREATE Admission (AUTH REQUIRED)
router.post(
  "/",
  verifyUserAccess,     // ✅ MUST
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createAdmission
);

// GET ALL Admissions
router.get("/", getAllAdmissions);

// GET single Admission
router.get("/:id", getAdmission);

// UPDATE
router.put(
  "/:id",
  verifyUserAccess,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateAdmission
);

// DELETE
router.delete("/:id", deleteAdmission);

// Payments
router.post("/:admissionId/payment", addPayment);
router.put("/:admissionId/payment/:paymentId", updatePayment);
router.delete("/:admissionId/payment/:paymentId", deletePayment);

export default router;
