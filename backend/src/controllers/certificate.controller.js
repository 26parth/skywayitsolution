import path from "path";
import mongoose from "mongoose";
import { sendCertificateEmail } from "../utils/brevoMailer.js";
import { Admission } from "../models/Admission.model.js";
import Certificate from "../models/Certificate.model.js";
import crypto from "crypto";

export const sendCertificateByAdmin = async (req, res) => {
  try {
    const { admissionId } = req.body;

    if (!admissionId)
      return res.status(400).json({ message: "admissionId is required" });

    if (!mongoose.Types.ObjectId.isValid(admissionId))
      return res.status(400).json({ message: "Invalid admissionId" });

    if (!req.file)
      return res.status(400).json({ message: "Certificate file is required" });

    const admission = await Admission.findById(admissionId)
      .populate("userId", "email fullname");

    if (!admission || !admission.userId)
      return res.status(404).json({ message: "User not found" });

    const filePath = path.resolve(req.file.path);

    // ✅ Send email
    await sendCertificateEmail(
      admission.userId.email,
      admission.userId.fullname,
      filePath
    );

    // ✅ Save certificate record
    await Certificate.create({
      userId: admission.userId._id,
      admissionId,
      fileName: req.file.filename,
      token: crypto.randomBytes(20).toString("hex"),
    });

    res.json({
      success: true,
      message: "Certificate sent successfully",
    });

  } catch (error) {
    console.error("CERTIFICATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Certificate sending failed",
    });
  }
};
