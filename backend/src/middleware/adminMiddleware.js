// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\backend\src\middleware\adminMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyAdminAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "No token provided" });

    let payload;
    try {
      // 🔥 Direct verify using Admin Secret
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ 
          code: "TOKEN_EXPIRED", 
          message: "Admin session expired." 
        });
      }
      return res.status(401).json({ message: "Invalid admin token" });
    }

    const admin = await User.findById(payload.id).select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    req.user = admin;
    next();
  } catch (err) {
    next(err);
  }
};