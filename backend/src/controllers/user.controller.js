// backend/src/controllers/user.controller.js
import User from "../models/User.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Get current user (protected) */
export const profile = async (req, res, next) => {
  try {
    const u = await User.findById(req.user._id).select("-password"); // Pura data mangao password ke bina

    if (!u) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      user: u, // 🔥 Pura object bhej do, frontend apne aap sari fields utha lega
    });
  } catch (err) {
    next(err);
  }
};



export const updateProfile = async (req, res, next) => {
  try {
    // 1. Destructure all fields from model
    const {
      fullname, contactNumber, gender, dob,
      qualification, linkedin, githublink, course,
      currentAddress, permanentAddress, bloodGroup, skillsInterests
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Update with new values or keep old ones
    user.fullname = fullname || user.fullname;
    user.contactNumber = contactNumber || user.contactNumber;
    user.gender = gender || user.gender;
    user.dob = dob || user.dob;
    user.qualification = qualification || user.qualification;
    user.linkedin = linkedin || user.linkedin;
    user.githublink = githublink || user.githublink;
    user.course = course || user.course;
    user.currentAddress = currentAddress || user.currentAddress;
    user.permanentAddress = permanentAddress || user.permanentAddress;
    user.bloodGroup = bloodGroup || user.bloodGroup;



    // Handle array (skillsInterests)
    if (skillsInterests) {
      user.skillsInterests = Array.isArray(skillsInterests)
        ? skillsInterests
        : skillsInterests.split(",").map(s => s.trim());
    }

    // Condition A: Kya profile ko Profile Page par bhejne layak Mandatory fields fill ho gayi hain?
    const isMandatoryFilled = user.fullname && user.contactNumber && user.gender;

    if (isMandatoryFilled) {
      user.isProfileComplete = true; // DB me true ho jayega taaki lock khul sake
    } else {
      user.isProfileComplete = false;
    }

    // 🔥 NEW ADDITION: Warning Message ka logic (Checking if EVERYTHING is filled)
    const allFields = [
      user.fullname, user.contactNumber, user.gender, user.dob,
      user.qualification, user.linkedin, user.githublink, user.course,
      user.currentAddress, user.permanentAddress, user.bloodGroup
    ];

    // Agar koi bhi field khali hai to warning dikhayenge
    const isEverythingFilled = allFields.every(field => field !== "" && field !== null && field !== undefined);

    // Ye property hum response me bhej rahe hain (Ye DB me save nahi hogi, transient hai)
    const showIncompleteWarning = !isEverythingFilled;

    if (req.file) {
      try {
        // Local path se Cloudinary par upload kar rahe hain
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "skyway_profiles", // Cloudinary pe ek folder ban jayega
        });

        // Database me secure URL save kar lo
        user.profilePic = result.secure_url;

        // Upload hone ke baad local server ke space ko clean up karo
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        // Agar folder me file reh gayi ho tab bhi error handle karo
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    // 5. Save (Using validateModifiedOnly to avoid password validation errors)
    await user.save({ validateModifiedOnly: true });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      showIncompleteWarning, // 🔥 Ye variable frontend ko alert dikhane me help karega
      user // Fresh updated user for Redux
    });
  } catch (err) {
    next(err);
  }
};
// ✅ ADMIN: Get all students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    next(err);
  }
};


// ✅ ADMIN: Update any user
export const adminUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullname, email, contactNumber, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.contactNumber = contactNumber || user.contactNumber;
    user.role = role || user.role;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ ADMIN: Delete user
export const adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
