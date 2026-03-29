// backend/src/controllers/user.controller.js
import User from "../models/User.model.js";

/** Get current user (protected) */
// backend/src/controllers/user.controller.js

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

// backend/src/controllers/user.controller.js

// backend/src/controllers/user.controller.js

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

    // 3. Profile Completion Logic
    // Industry Logic: Check if all critical fields are present
if (user.fullname && user.contactNumber && user.gender && user.currentAddress && user.qualification) {
      user.isProfileComplete = true;
    } else {
      user.isProfileComplete = false;
    }

    // 4. Handle File (Profile Pic)
    if (req.file) {
      user.profilePic = req.file.path;
    }

    // 5. Save (Using validateModifiedOnly to avoid password validation errors)
    await user.save({ validateModifiedOnly: true });

    return res.json({
      success: true,
      message: "Profile updated successfully",
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
