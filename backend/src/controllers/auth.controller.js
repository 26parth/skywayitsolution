import User from "../models/User.model.js";
import sessionModel from "../models/session.model.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// 🛡️ INTERNAL HELPERS (Replaces token.js)
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

// Is function ko replace karo purane wale se
const setUserRefreshCookie = (res, token) => {
  const cookieName = process.env.USER_REFRESH_COOKIE || "user_jid";

  // 🔥 FIX: Localhost par secure false rakhna padega wrna browser block kar dega
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProd, // Production me true, Local me false
    sameSite: isProd ? "None" : "Lax", // Local me Lax work karega
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// ==========================================
// 🚀 CONTROLLERS
// ==========================================

/** Register user */
export const registerUser = async (req, res, next) => {
  try {
    const { fullname, email, contactNumber, password } = req.body;

    if (!fullname || !email || !password || !contactNumber)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const user = new User({
      fullname,
      email,
      contactNumber,
      password,
      role: "student",
    });

    await user.save();

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await sessionModel.create({
      user: user._id,
      refreshTokenHash: hashToken(refreshToken),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    setUserRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) { next(err); }
};

/** Login user */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== "student") {
      return res.status(401).json({ message: "Invalid student credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await sessionModel.create({
      user: user._id,
      refreshTokenHash: hashToken(refreshToken),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

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
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) { next(err); }
};

/** Google Login */
export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fullname: name,
        email: email,
        profilePic: picture,
        isGoogleUser: true,
        isProfileComplete: false,
      });
      await user.save();
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await sessionModel.create({
      user: user._id,
      refreshTokenHash: hashToken(refreshToken),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // 🔥 FIX 1: Google login par ab cookie set hogi browser mein!
    setUserRefreshCookie(res, refreshToken);

    const isDone = !!user.contactNumber || user.isProfileComplete;

    return res.json({
      success: true,
      accessToken,
      isProfileComplete: isDone,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        contactNumber: user.contactNumber,
        isProfileComplete: isDone,
        role: user.role
      }
    });
  } catch (err) { next(err); }
};
/** Refresh User Token with Rotation */
export const refreshUserToken = async (req, res, next) => {
  try {
    const cookieName = process.env.USER_REFRESH_COOKIE || "user_jid";
    const token = req.cookies?.[cookieName];

    if (!token) return res.status(401).json({ message: "Session expired" });

    // 1. Verify Token (In-controller logic)
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const hash = hashToken(token);

    // 2. Find Session
    const session = await sessionModel.findOne({
      refreshTokenHash: hash,
      revoked: false,
    });

    if (!session) {
      // Security Alert: Reuse detected
      await sessionModel.updateMany({ user: payload.id }, { revoked: true });
      res.clearCookie(cookieName, { path: "/" });
      return res.status(403).json({ message: "Token reuse detected. All sessions revoked." });
    }

    const user = await User.findById(payload.id);
    if (!user || user.role !== "student") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 3. New Tokens & Rotation
    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    const newHash = hashToken(newRefreshToken);

    session.refreshTokenHash = newHash;
    await session.save();

    setUserRefreshCookie(res, newRefreshToken);

    res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber, // Ye missing tha
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) {
    res.clearCookie(process.env.USER_REFRESH_COOKIE || "user_jid", { path: "/" });
    next(err);
  }
};
    

/** Logout Current Device */
export const logoutUser = async (req, res, next) => {
  try {
    const cookieName = process.env.USER_REFRESH_COOKIE || "user_jid";
    const token = req.cookies?.[cookieName];

    if (token) {
      // DB se session hatana zaroori hai
      await sessionModel.deleteOne({ refreshTokenHash: hashToken(token) });
    }

    // Cookie ko poori tarah expire karke kill karo
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    return res.json({ success: true, message: "Logged out from this device" });
  } catch (err) { next(err); }
};

/** Logout From All Devices */
export const logoutAllDevices = async (req, res, next) => {
  try {
    // 🔥 FIX 2: req.user se user ID tabhi milegi jab route protected hoga
    const userId = req.user._id;
    const cookieName = process.env.USER_REFRESH_COOKIE || "user_jid";

    // DB se saari valid sessions hatado
    await sessionModel.deleteMany({ user: userId });

    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    return res.json({ success: true, message: "Logged out from all devices successfully" });
  } catch (err) { next(err); }
};