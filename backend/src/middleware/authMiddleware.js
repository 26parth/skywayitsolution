// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\backend\src\middleware\authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyUserAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    let payload;
    try {
      // 🔥 token.js nikalne ke baad direct verification
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Agar token expire hai toh specific code bhejo taaki frontend refresh trigger kare
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ 
          code: "TOKEN_EXPIRED", 
          message: "Your session has expired." 
        });
      }
      return res.status(401).json({ message: "Invalid access token" });
    }

    // Payload mein 'id' hota hai jo humne controller mein set kiya tha
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    // Role check for extra security
    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};