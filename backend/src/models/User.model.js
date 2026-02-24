// backend/src/models/User.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Invalid email address"],
        },
        contactNumber: {
            type: String,
            required: true,
            // unique: true,   // 👈 MUST
            validate: {
                validator: (v) => /^[0-9]{10,15}$/.test(v),
                message: "Invalid contact number",
            },
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
