// backend/src/controllers/admin.controller.js
import User from "../models/User.model.js";
import sessionModel from "../models/session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ==========================================
// 🛡️ ADMIN INTERNAL HELPERS
// ==========================================

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const setAdminRefreshCookie = (res, token) => {
  const cookieName = process.env.ADMIN_REFRESH_COOKIE || "admin_jid";
  
  // 🔥 FIX 1: Localhost compatibility set ki hai
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProd, // Local pe false rahega
    sameSite: isProd ? "None" : "Lax", // Local me Lax work karega
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// ==========================================
// 🚀 ADMIN CONTROLLERS
// ==========================================

/** Admin Register (Manual login required) */
export const registerAdmin = async (req, res, next) => {
  try {
    const { fullname, email, contactNumber, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Admin already exists" });

    const admin = new User({
      fullname,
      email,
      contactNumber: contactNumber || "0000000000",
      password,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully. Please login manually.",
      admin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) { next(err); }
};

/** Admin Login */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email }).select("+password");

    if (!admin || admin.role !== "admin")
      return res.status(401).json({ message: "Invalid admin credentials" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid admin credentials" });

    const accessToken = createAccessToken(admin);
    const refreshToken = createRefreshToken(admin);

    // Create Admin Session
    await sessionModel.create({
      user: admin._id,
      refreshTokenHash: hashToken(refreshToken),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    setAdminRefreshCookie(res, refreshToken);

    res.json({
      success: true,
      accessToken,
      admin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) { next(err); }
};

/** Refresh Admin Token (Rotation Logic) */
export const refreshAdminToken = async (req, res, next) => {
  try {
    const cookieName = process.env.ADMIN_REFRESH_COOKIE || "admin_jid";
    const token = req.cookies?.[cookieName];

    if (!token) return res.status(401).json({ message: "Admin session expired" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid admin session" });
    }

    const hash = hashToken(token);
    const session = await sessionModel.findOne({ refreshTokenHash: hash, revoked: false });

    if (!session) {
      await sessionModel.updateMany({ user: payload.id }, { revoked: true });
      res.clearCookie(cookieName, { path: "/" });
      return res.status(403).json({ message: "Security Alert: Admin session reuse detected." });
    }

    const admin = await User.findById(payload.id);
    if (!admin || admin.role !== "admin") return res.status(401).json({ message: "Unauthorized" });

    const accessToken = createAccessToken(admin);
    const newRefreshToken = createRefreshToken(admin);
    
    session.refreshTokenHash = hashToken(newRefreshToken);
    await session.save();

    setAdminRefreshCookie(res, newRefreshToken);

    res.json({
      success: true,
      accessToken,
      admin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) { 
    res.clearCookie(process.env.ADMIN_REFRESH_COOKIE || "admin_jid", { path: "/" });
    next(err); 
  }
};

// backend/src/controllers/admin.controller.js

/** Admin Logout (Current Device) */
export const logoutAdmin = async (req, res, next) => {
  try {
    const cookieName = process.env.ADMIN_REFRESH_COOKIE || "admin_jid";
    const token = req.cookies?.[cookieName];

    if (token) {
      await sessionModel.deleteOne({ refreshTokenHash: hashToken(token) });
    }

    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie(cookieName, { 
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/" 
    });

    return res.json({ success: true, message: "Admin logged out from this device" });
  } catch (err) { next(err); }
};

export const logoutAdminAllDevices = async (req, res, next) => {
  try {
    // req.user hume verifyAdminAccess middleware se milega
    const adminId = req.user._id; 
    const cookieName = process.env.ADMIN_REFRESH_COOKIE || "admin_jid";

    // 1. DB se is admin ki saari sessions ura do
    await sessionModel.deleteMany({ user: adminId });

    // 2. Cookie clear kar do
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie(cookieName, { 
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/" 
    });

    return res.json({ success: true, message: "Logged out from all devices successfully" });
  } catch (err) { next(err); }
};

/** Get All Admins */
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json({ success: true, count: admins.length, admins });
  } catch (err) { next(err); }
};