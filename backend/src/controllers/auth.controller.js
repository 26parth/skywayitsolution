// backend/src/controllers/auth.controller.js
import User from "../models/User.model.js";
import {
  createUserAccessToken,
  createUserRefreshToken,
  verifyUserRefreshToken,
} from "../utils/token.js";

/** Helper to set refresh cookie for users */
const setUserRefreshCookie = (res, token) => {
  const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";
  const secure = process.env.COOKIE_SECURE === "true";
  const sameSite = process.env.COOKIE_SAMESITE || "None";
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

/** Register user */
/** Register user */
export const registerUser = async (req, res, next) => {
  try {
    const { fullname, email, contactNumber, password } = req.body;

    if (!fullname || !email || !password || !contactNumber)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = new User({
      fullname,
      email,
      contactNumber,
      password,
      role: "student",
    });

    await user.save();

    // ❌ REMOVE: Access token
    // ❌ REMOVE: Refresh token
    // ❌ REMOVE: Cookie set

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please login manually.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/** Login user */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createUserAccessToken(user);
    const refreshToken = createUserRefreshToken(user);

    setUserRefreshCookie(res, refreshToken);

    return res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/** Refresh user access token */
export const refreshUserToken = async (req, res, next) => {
  try {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";
    const token = req.cookies?.[cookieName];
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let payload;
    try {
      payload = verifyUserRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = createUserAccessToken(user);
    // Optionally rotate refresh token (not rotating here for simplicity)
    return res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/** Logout user (clear cookie) */
export const logoutUser = async (req, res, next) => {
  try {
    const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";
    res.clearCookie(cookieName, { path: "/" });
    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
};


