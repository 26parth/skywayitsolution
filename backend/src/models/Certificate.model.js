// backend/src/models/Certificate.model.js
import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    // 🔗 STUDENT (REGISTERED USER)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 ADMISSION RECORD
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", CertificateSchema);
