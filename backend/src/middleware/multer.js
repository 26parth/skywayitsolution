// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\backend\src\middleware\multer.js

import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 🔥 FIX: Added image mimetypes
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Images (JPEG, JPG, PNG) are allowed!"), false);
    }
  }
});

export default upload;