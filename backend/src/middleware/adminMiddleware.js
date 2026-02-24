import { verifyAdminAccessToken } from "../utils/token.js";
import User from "../models/User.model.js";

export const verifyAdminAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token)
      return res.status(401).json({ message: "No token provided" });

    let payload;

    try {
      payload = verifyAdminAccessToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const admin = await User.findById(payload.id).select("-password");

    if (!admin)
      return res.status(401).json({ message: "Admin not found" });

    if (admin.role !== "admin")
      return res.status(403).json({ message: "Admin access required" });

    req.user = admin;
    next();
  } catch (err) {
    next(err);
  }
};