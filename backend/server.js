import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import courseRoutes from "./src/routes/course.routes.js";
import cookieParser from "cookie-parser";
import admissionRoutes from "./src/routes/admission.routes.js";
import certificateRoutes from "./src/routes/certificate.routes.js";
import enquiryRoutes from "./src/routes/enquiry.routes.js";
import feedbackRoutes from "./src/routes/feedback.routes.js";

dotenv.config();
const app = express();

connectDB();

// ----------------------
// 🛡 Middlewares & Security
// ----------------------

// 1. 🔥 CookieParser (Isse hamesha top par hona chahiye taaki baki middlewares cookies read kar sakein)
app.use(cookieParser());

// 2. 🔥 COOP Headers (Google Popup block hone se rokne ke liye)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// 3. Body Parsers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// 4. CORS Settings (🔥 FIXED FOR PRODUCTION)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://skywayitsolution.vercel.app" // Teri actual Vercel wali live URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman ya bina origin wali requests ko allow karne ke liye
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy not allowed by Render'), false);
    }
  },
  credentials: true, // 🍪 Cookies pass karne ke liye ye mandatory hai
}));

// Static Files
app.use("/uploads", express.static("uploads"));

// ----------------------
// 🚀 API ROUTES 
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/admin/admission", admissionRoutes);
app.use("/api/admin/certificate", certificateRoutes);

app.use("/api/enquiry", enquiryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin/enquiry", enquiryRoutes);
app.use("/api/admin/feedback", feedbackRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SKYWAY IT SOLUTION API is running...",
  });
});

// 404 & Error Handlers
app.use((req, res) => { res.status(404).json({ message: "Route not found" }); });
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🔥 Server is running on port ${PORT}`); });