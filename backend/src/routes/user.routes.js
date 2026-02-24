import express from "express";
import { profile, updateProfile } from "../controllers/user.controller.js";
import { verifyUserAccess } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/profile", verifyUserAccess, profile);
router.put("/edit-profile", verifyUserAccess, updateProfile);

export default router;
