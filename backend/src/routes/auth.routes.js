// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\backend\src\routes\auth.routes.js
import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  refreshUserToken,
  logoutUser,
  logoutAllDevices,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { verifyUserAccess } from "../middleware/authMiddleware.js"; // 🔥 Zaroori hai: Apna user auth middleware import karo

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin); 
router.post("/refresh-token", refreshUserToken);
router.post("/logout", logoutUser);

// 🔥 FIX: Sirf logged-in user hi sare device se logout kar sakta hai
router.post("/logout-all", verifyUserAccess, logoutAllDevices);

// use for forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;