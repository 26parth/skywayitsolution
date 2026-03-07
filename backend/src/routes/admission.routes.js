import { Router } from "express";
import upload from "../middleware/multer.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";
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

// CREATE
router.post(
  "/",
  verifyUserAccess,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createAdmission
);

// GET ALL
router.get("/", verifyAdminAccess, getAllAdmissions);

// GET SINGLE
router.get("/:id", verifyAdminAccess, getAdmission);

// UPDATE
router.put(
  "/:id",
  verifyAdminAccess,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateAdmission
);

// DELETE
router.delete("/:id", verifyAdminAccess, deleteAdmission);

// Payments
router.post("/:admissionId/payment", verifyAdminAccess, addPayment);

router.put(
  "/:admissionId/payment/:paymentId",
  verifyAdminAccess,
  updatePayment
);

router.delete(
  "/:admissionId/payment/:paymentId",
  verifyAdminAccess,
  deletePayment
);

export default router;