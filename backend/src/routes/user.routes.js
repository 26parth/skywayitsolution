import express from "express";
import { profile, updateProfile } from "../controllers/user.controller.js";
import { verifyUserAccess } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js"; // 🔥 Upload middleware import kiya

const router = express.Router();

router.get("/profile", verifyUserAccess, profile);

// 🔥 'profilePic' field name hai jo frontend se aayega
router.put("/edit-profile", verifyUserAccess, upload.single("profilePic"), updateProfile);

export default router;