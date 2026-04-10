// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\backend\src\controllers\admission.controller.js
import { Admission } from "../models/Admission.model.js";
import Course from "../models/Course.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// 🔥 Cloudinary config (Ye credentials load karega)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const createAdmission = async (req, res) => {
  try {
    const {
      internName,
      address,
      dob,
      contactNo,
      joiningDate,
      courseDuration,
      courseProjectName,
      educationDetails,
      totalFees,
      courseId
    } = req.body;

    // ✅ USER FROM TOKEN
    const userId = req.user._id;

    // ✅ COURSE FETCH
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const photoFile = req.files?.photo?.[0];
    const signatureFile = req.files?.signature?.[0];


    // Validate files
    if (!photoFile || !signatureFile) {
      return res.status(400).json({ success: false, message: "Photo & Signature are required." });
    }


    // Validate required fields
    if (!internName || !address || !dob || !contactNo || !joiningDate || !courseDuration) {
      deleteFile(photoFile.filename);
      deleteFile(signatureFile.filename);
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    // Convert dates safely
    const dobDate = new Date(dob);
    const joiningDateObj = new Date(joiningDate);
    if (isNaN(dobDate) || isNaN(joiningDateObj)) {
      deleteFile(photoFile.filename);
      deleteFile(signatureFile.filename);
      return res.status(400).json({ success: false, message: "Invalid date format." });
    }

    let photoUrl = "";
    let signatureUrl = "";

    try {
      // 🔥 1. Upload Photo to Cloudinary
      const photoResult = await cloudinary.uploader.upload(photoFile.path, {
        folder: "admission_photos",
      });
      photoUrl = photoResult.secure_url;

      // 🔥 2. Upload Signature to Cloudinary
      const sigResult = await cloudinary.uploader.upload(signatureFile.path, {
        folder: "admission_signatures",
      });
      signatureUrl = sigResult.secure_url;

      // Upload hone ke baad local storage se files delete kar do
      if (fs.existsSync(photoFile.path)) fs.unlinkSync(photoFile.path);
      if (fs.existsSync(signatureFile.path)) fs.unlinkSync(signatureFile.path);

    } catch (uploadErr) {
      console.error("Cloudinary upload error in admission:", uploadErr);

      // Cleanup local files if upload failed
      if (fs.existsSync(photoFile.path)) fs.unlinkSync(photoFile.path);
      if (fs.existsSync(signatureFile.path)) fs.unlinkSync(signatureFile.path);

      return res.status(500).json({ success: false, message: "Failed to upload files to Cloudinary." });
    }

    // Create admission
    const admission = await Admission.create({
      userId,                        // ✅ CONNECTED
      courseId,                      // ✅ CONNECTED
      courseTitleSnapshot: course.title, // ✅ SNAPSHOT
      internName,
      address,
      dob,
      contactNo,
      joiningDate,
      courseDuration: course.duration, // ✅ AUTO FROM COURSE
      courseProjectName,
      educationDetails,
      totalFees: Number(course.price), // ✅ AUTO FEES
      photo: photoUrl,
      signature: signatureUrl,
    });

    res.status(201).json({ success: true, admission });

  } catch (err) {
    console.error(err);



    // Duplicate contact number
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Contact number already exists." });
    }

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File too large. Max 3MB allowed." });
    }

    // Delete uploaded files if error
    if (req.files?.photo?.[0]?.filename) deleteFile(req.files.photo[0].filename);
    if (req.files?.signature?.[0]?.filename) deleteFile(req.files.signature[0].filename);

    res.status(500).json({ success: false, message: err.message || "Server error." });
  }

  const deleteFile = (filename) => {
    const filePath = path.join(process.cwd(), "public/uploads/admission", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };
};

// ==== GET single Admission by ID ====
export const getAdmission = async (req, res) => {
  try {
    const adm = await Admission.findById(req.params.id);
    if (!adm) return res.status(404).json({ success: false, message: "Admission not found" });
    res.status(200).json({ success: true, admission: adm });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admission" });
  }
};

// ==== GET ALL ADMISSIONS ====
export const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, admissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admissions" });
  }
};


// ==== UPDATE ADMISSION ====
export const updateAdmission = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const updatedAdmission = await Admission.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      admission: updatedAdmission,
      message: "Admission updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update admission" });
  }
};

// ==== DELETE ADMISSION ====
export const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Admission deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admission" });
  }
};
// payment secion in admission form !! 

// ===== Add a payment =====
export const addPayment = async (req, res) => {
  try {
    const { admissionId, paymentId } = req.params; // paymentId optional for addPayment
    const { amount, date } = req.body;

    if (amount === undefined || amount === null || amount === "") {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const admission = await Admission.findById(admissionId);
    if (!admission) return res.status(404).json({ success: false, message: "Admission not found" });

    const paymentEntry = {
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
    };

    admission.paymentDetails.push(paymentEntry);
    await admission.save();

    return res.status(200).json({ success: true, message: "Payment added", admission });
  } catch (err) {
    console.error("addPayment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { admissionId, paymentId } = req.params;  // ⚡ must be admissionId
    const { amount, date } = req.body;

    const admission = await Admission.findById(admissionId);
    if (!admission) return res.status(404).json({ success: false, message: "Admission not found" });

    const payment = admission.paymentDetails.id(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    if (amount !== undefined && amount !== null && amount !== "") payment.amount = Number(amount);
    if (date) payment.date = new Date(date);

    await admission.save();

    return res.status(200).json({ success: true, message: "Payment updated", admission });
  } catch (err) {
    console.error("updatePayment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===== Delete a payment entry =====
export const deletePayment = async (req, res) => {
  try {
    const { admissionId, paymentId } = req.params;  // ⚡ must be admissionId

    const admission = await Admission.findById(admissionId);
    if (!admission) return res.status(404).json({ success: false, message: "Admission not found" });

    admission.paymentDetails = admission.paymentDetails.filter((p) => p._id.toString() !== paymentId);
    await admission.save();

    return res.status(200).json({ success: true, message: "Payment deleted", admission });
  } catch (err) {
    console.error("deletePayment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
