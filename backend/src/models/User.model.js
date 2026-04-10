// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\backend\src\models\User.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: [true, "Full name is required"], trim: true }, // *
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true }, // *

    contactNumber: {
        type: String,
        required: function () { return !this.isGoogleUser; },
        validate: {
            validator: function (v) {
                return !v || /^\d{10}$/.test(v);
            },
            message: "Contact number must be exactly 10 digits!"
        }
    },

    password: {
        type: String,
        select: false,
        required: function () { return !this.isGoogleUser; },
        validate: {
            validator: function (v) {
                if (!this.isModified('password')) return true;
                return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(v);
            },
            message: "Password must be at least 6 characters with 1 number and 1 special character!"
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // 🔥 NEW OPTIONAL FIELDS (Skyway IT Solution Specific)
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    qualification: { type: String },
    linkedin: { type: String },
    githublink: { type: String },
    course: { type: String },
    dob: { type: Date },
    currentAddress: { type: String },
    permanentAddress: { type: String },
    bloodGroup: { type: String },
    skillsInterests: [{ type: String }], // Array for multiple skills

    profilePic: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
}, { timestamps: true });

// Password hashing logic (Same as before)
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;