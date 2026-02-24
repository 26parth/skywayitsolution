// backend/src/controllers/admin.controller.js
import User from "../models/User.model.js";
import {
  createAdminAccessToken,
  createAdminRefreshToken,
  verifyAdminRefreshToken
} from "../utils/token.js";
import bcrypt from "bcryptjs";

/**
 * Helper: Set refresh token cookie
 */
const setRefreshCookie = (res, token) => {
  const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";
  const secure = process.env.COOKIE_SECURE === "true";
  const sameSite = process.env.COOKIE_SAMESITE || "none";
  const domain = process.env.COOKIE_DOMAIN || undefined;

  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  if (domain) cookieOptions.domain = domain;

  res.cookie(cookieName, token, cookieOptions);
};

/**
 * Admin Register (NO AUTO LOGIN)
 */
export const registerAdmin = async (req, res, next) => {
  try {
    const { fullname, email, contactNumber, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Admin already exists" });

    const admin = new User({
      fullname,
      email,
      contactNumber: contactNumber || "0000000000",
      password,
      role: "admin",
    });

    await admin.save();

    // ❌ NO ACCESS TOKEN
    // ❌ NO REFRESH TOKEN
    // ❌ NO COOKIE SET
    // REGISTER KA MATLAB LOGIN NAHI HAI!

    res.status(201).json({
      success: true,
      message: "Admin registered successfully. Please login manually.",
      admin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        contactNumber: admin.contactNumber,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Login
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin")
      return res.status(401).json({ message: "Invalid admin credentials" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid admin credentials" });

    const accessToken = createAdminAccessToken(admin);
    const refreshToken = createAdminRefreshToken(admin);

    setRefreshCookie(res, refreshToken);

    res.json({
      success: true,
      accessToken,
      admin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        contactNumber: admin.contactNumber,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Refresh Admin Token
 */
export const refreshAdminToken = async (req, res, next) => {
  try {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";
    const token = req.cookies?.[cookieName];

    if (!token)
      return res.status(401).json({ message: "No refresh token" });

    let payload;
    try {
      payload = verifyAdminRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const admin = await User.findById(payload.id);
    if (!admin)
      return res.status(401).json({ message: "Admin not found" });

    const accessToken = createAdminAccessToken(admin);

    res.json({
      success: true,
      accessToken,
      admin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        contactNumber: admin.contactNumber,
      },
    });
  } catch (err) {
    next(err);
  }
};



/**
 * Admin Logout
 */
export const logoutAdmin = async (req, res, next) => {
  try {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";

    res.clearCookie(cookieName, { path: "/" });

    return res.json({
      success: true,
      message: "Admin logged out",
    });
  } catch (err) {
    next(err);
  }
};
