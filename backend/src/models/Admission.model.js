import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // ✅ ADD (REAL RELATION)
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        // ✅ ADD (SNAPSHOT – certificate safe)
        courseTitleSnapshot: {
            type: String,
            required: true,
        },

        internName: { type: String, required: true, trim: true },
        address: { type: String, required: true },
        dob: { type: Date, required: true },

        contactNo: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{10}$/, "Invalid contact number"],
        },


        joiningDate: { type: Date, required: true },
        courseDuration: { type: String, required: true },
        courseProjectName: { type: String, default: "" },
        educationDetails: { type: String, default: "" },
        totalFees: { type: Number, default: 0 },

        photo: { type: String, required: true },
        signature: { type: String, required: true },

        paymentDetails: [
            {
                date: { type: Date },
                amount: { type: Number, default: 0 },
            },
        ],
    },
    { timestamps: true }
);

export const Admission = mongoose.model("Admission", admissionSchema);
