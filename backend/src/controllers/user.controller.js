// backend/src/controllers/user.controller.js
import User from "../models/User.model.js";


/** Get current user (protected) */
export const profile = async (req, res, next) => {
  try {
    // auth middleware sets req.user
    const u = req.user;
    return res.json({
      success: true,
      user: {
        _id: u._id,
        fullname: u.fullname,
        email: u.email,
        contactNumber: u.contactNumber,
        role: u.role,
      },
    });
  } catch (err) {
    next(err);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { fullname, contactNumber } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullname = fullname || user.fullname;
    user.contactNumber = contactNumber || user.contactNumber;

    await user.save();

    return res.json({
      success: true,
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
