// backend/src/middleware/authMiddleware.js
import { verifyUserAccessToken } from "../utils/token.js";
import User from "../models/User.model.js";

export const verifyUserAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let payload;
    try {
      payload = verifyUserAccessToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
