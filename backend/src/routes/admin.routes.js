// backend/src/routes/admin.routes.js
import express from "express";
import { registerAdmin, loginAdmin, refreshAdminToken, logoutAdmin } from "../controllers/admin.controller.js";
import { getAllStudents, adminUpdateUser, adminDeleteUser } from "../controllers/user.controller.js";
import { verifyAdminAccess } from "../middleware/adminMiddleware.js";

const router = express.Router();

// TEMP: register route (only use once, then remove/disable)
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Refresh token — browser will send cookie
router.post("/refresh-token", refreshAdminToken);



// Protected example route (test)
router.get("/me", verifyAdminAccess, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Logout
router.post("/logout", logoutAdmin);


router.get("/users", getAllStudents);
router.put("/update-user/:id", adminUpdateUser);
router.delete("/delete-user/:id", adminDeleteUser);
export default router;
