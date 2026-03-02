import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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


// 🔥 Load environment variables FIRST
dotenv.config();
const app = express();
app.use(cookieParser());

// ----------------------
// 🔥 Connect Database
// ----------------------
connectDB();

// ----------------------
// 🛡 Middlewares
// ----------------------
app.use(express.json());

// ----------------------
// 🛡 CORS
// ----------------------
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ----------------------
// 🛡 Middlewares
// ----------------------
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static Files
app.use("/uploads", express.static("uploads"));

// ----------------------
// 🚀 API ROUTES
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/admission", admissionRoutes); // for user-side form
app.use("/api/admin/admission", admissionRoutes); // for admin-side form
app.use("/api/admin/certificate", certificateRoutes);


// PUBLIC
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/feedback", feedbackRoutes);

// admin
app.use("/api/admin/enquiry", enquiryRoutes);
app.use("/api/admin/feedback", feedbackRoutes);


// ----------------------
// ❤️ Health Check
// ----------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SKYWAY IT SOLUTION API is running...",
    environment: process.env.NODE_ENV || "development",
  });
});

// ----------------------
// ❌ 404 Handler
// ----------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------
// ❌ Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

// ----------------------
// 🚀 Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
  console.log(`🌐 Allowed Frontend: ${FRONTEND_URL}`);
});
