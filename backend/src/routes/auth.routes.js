// backend/src/routes/auth.routes.js
import express from "express";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../controllers/auth.controller.js";
import { verifyUserAccess } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshUserToken);
router.post("/logout", logoutUser);

// protected

export default router;
