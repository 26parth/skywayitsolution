import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { TextField, Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdmissionForm } from "../hooks/admissionQuery";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


const MAX_FILE_SIZE = 3 * 1024 * 1024;
const RATIO_MIN = 0.65;
const RATIO_MAX = 0.85;


const AdmissionForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const user = useSelector((state) => state.auth.user); // 👈 YAHI
    const [photoFile, setPhotoFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const mutation = useAdmissionForm();

    // ✅ useLocation hook yaha component ke andar
    const location = useLocation();
    const { courseId, courseTitle, courseDuration, price } = location.state || {};

    React.useEffect(() => {
        if (courseDuration) {
            setValue("courseDuration", courseDuration);
        }
        if (price) {
            setValue("totalFees", price);
        }
        if (user?.contactNumber) {
            setValue("contactNo", user.contactNumber);
        }
        if (courseTitle) {
            setValue("courseProjectName", courseTitle); // 👈 IMPORTANT
        }
    }, [courseDuration, price, user, courseTitle, setValue]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image for photo.");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Photo must be 3MB or less.");
            return;
        }
        const img = new Image();
        img.onload = () => {
            const ratio = img.width / img.height;
            if (ratio < RATIO_MIN || ratio > RATIO_MAX) {
                toast.error("Photo should be portrait (approx. 3:4 aspect ratio).");
                return;
            }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
            toast.success("Photo accepted.");
        };
        img.onerror = () => {
            toast.error("Unable to read the photo file.");
        };
        img.src = URL.createObjectURL(file);
    };

    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image for signature.");
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Signature must be 3MB or less.");
            return;
        }

        setSignatureFile(file);
        setSignaturePreview(URL.createObjectURL(file));
        toast.success("Signature accepted.");  // ✅ success message

    };


    const onSubmit = (data) => {
        if (!photoFile) {
            toast.error("Please upload passport photo (<=3MB).");
            return;
        }
        if (!signatureFile) {
            toast.error("Please upload signature image (<=3MB).");
            return;
        }
        if (!courseId || !courseTitle) {
            toast.error("Course data missing. Please apply from course page.");
            return;
        }
        


        const fd = new FormData();
        Object.keys(data).forEach((k) => {
            if (k !== "photo" && k !== "signature") {
                fd.append(k, data[k] ?? "");
            }
        });

        fd.append("photo", photoFile);
        fd.append("signature", signatureFile);

        fd.append("courseId", courseId);
        fd.append("courseTitleSnapshot", courseTitle);
        fd.append("userId", user._id);



        mutation.mutate(fd, {
            onSuccess: () => {
                toast.success("Admission submitted successfully!");
                reset();
                setPhotoFile(null);
                setSignatureFile(null);
                setPhotoPreview(null);
                setSignaturePreview(null);
            },
            onError: (err) => {
                const msg = err?.response?.data?.message || err?.message || "Submission failed";
                toast.error(msg);
            },
        });
    };


    const gridClasses = "grid grid-cols-1 sm:grid-cols-3 gap-y-4 items-center";
    const labelClasses = "sm:col-span-1 text-base font-medium text-gray-700";
    const inputClasses = "sm:col-span-2";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8"
        >
            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl p-6 sm:p-10">
                {/* HEADER */}
                <header className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        SKYWAY IT SOLUTION
                    </h1>
                    <p className="text-sm text-gray-500 mb-4">
                        FIRST FLOOR, LAL BHUVAN, GH-6 CIRCLE, SECTOR 22, GANDHINAGAR
                    </p>
                    <div className="text-center border-y-2 border-gray-300 py-2">
                        <h2 className="text-xl font-extrabold tracking-wider">
                            ADMISSION FORM
                        </h2>
                    </div>
                </header>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* INPUTS */}
                    <div className="space-y-4">
                        {/* Intern Name */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Intern Name</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                {...register("internName", { required: "Intern Name is required" })}
                                error={!!errors.internName}
                                helperText={errors.internName?.message}
                            />
                        </div>

                        {/* Address */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Address</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                {...register("address", { required: "Address is required" })}
                                error={!!errors.address}
                                helperText={errors.address?.message}
                            />
                        </div>

                        {/* DOB */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Date of Birth</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register("dob", { required: "Date of Birth is required" })}
                                error={!!errors.dob}
                                helperText={errors.dob?.message}
                            />
                        </div>

                        {/* Contact */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Contact No.</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                type="tel"
                                InputProps={{ readOnly: true }}   // 👈 ADD THIS
                                {...register("contactNo", {
                                    required: "Contact No. is required",
                                })}
                                error={!!errors.contactNo}
                                helperText={errors.contactNo?.message}
                            />

                        </div>

                        {/* Joining Date */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Course Joining date</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register("joiningDate", { required: "Joining Date is required" })}
                                error={!!errors.joiningDate}
                                helperText={errors.joiningDate?.message}
                            />
                        </div>

                        {/* Duration */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Course Duration</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                {...register("courseDuration", { required: "Course Duration is required" })}
                                error={!!errors.courseDuration}
                                helperText={errors.courseDuration?.message}
                            />
                        </div>

                        {/* Course Project */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Courses / Project Name</label>
                            <TextField
                                className={inputClasses}
                                fullWidth
                                size="small"
                                {...register("courseProjectName", {
                                    required: "Course / Project Name is required",
                                })}
                                error={!!errors.courseProjectName}
                                helperText={errors.courseProjectName?.message}
                            />
                        </div>


                        {/* Education */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Education(Sem) Details</label>
                            <TextField className={inputClasses} fullWidth size="small" {...register("educationDetails")} />
                        </div>

                        {/* Total Fees */}
                        <div className={gridClasses}>
                            <label className={labelClasses}>Course Total Fees</label>
                            <TextField className={inputClasses} fullWidth size="small" type="number" {...register("totalFees")} />
                        </div>
                    </div>

                    {/* SIGNATURE + PHOTO */}
                    <div className="flex flex-col sm:flex-row gap-6 mt-8 pt-4 border-t border-gray-200">
                        {/* Placeholder Signature */}
                        <div className="flex-1">
                            <label className="block text-base font-medium text-gray-700 mb-2">
                                Signature Of Student
                            </label>

                            {/* Upload Box */}
                            <div className="border border-gray-300 rounded h-20 w-full flex items-center justify-center bg-gray-50 relative">

                                {/* Image Preview */}
                                {signaturePreview ? (
                                    <img
                                        src={signaturePreview}
                                        alt="Signature Preview"
                                        className="h-full w-full object-contain p-1"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-400">(Upload Signature)</p>
                                )}

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    name="signature"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        if (!file.type.startsWith("image/")) {
                                            toast.error("Please upload a valid image for signature.");
                                            return;
                                        }

                                        if (file.size > 3 * 1024 * 1024) {
                                            toast.error("Signature must be 3MB or less.");
                                            return;
                                        }

                                        setSignatureFile(file);                     // state
                                        setSignaturePreview(URL.createObjectURL(file)); // preview
                                        toast.success("Signature accepted.");       // success toast
                                    }}


                                />
                            </div>
                        </div>


                        {/* PHOTO */}
                        <div className="w-full sm:w-48 flex flex-col items-center">
                            <label className="block text-base font-medium text-gray-700 mb-2">PHOTO</label>
                            <div className="border-4 border-gray-300 bg-gray-100 p-1 w-full h-48 flex flex-col items-center justify-center">
                                {photoFile ? (
                                    <img
                                        src={URL.createObjectURL(photoFile)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <p className="text-gray-500 text-sm">Upload Photo (Max 3MB)</p>
                                )}

                                <input
                                    type="file"
                                    name="photo"
                                    id="photo-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="label"
                                    htmlFor="photo-upload"
                                    size="small"
                                    className="mt-2"
                                >
                                    {photoFile ? "Change Photo" : "Select Photo"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section (disabled) */}
                    <div className="mt-6 pointer-events-none opacity-60 relative">
                        <span className="text-red-600 text-sm absolute -top-5 left-2 font-semibold">
                            🔒 Payment Details Disabled (Cash Only)
                        </span>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Details (DATE/AMOUNT)</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                                            DATE
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                                            AMOUNT
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Array(4).fill(0).map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <TextField fullWidth size="small" variant="standard" disabled />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <TextField fullWidth size="small" variant="standard" disabled />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            size="large"
                            component={motion.button}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Submit Admission Form
                        </Button>
                    </div>
                </form>
            </div>

            <ToastContainer />
        </motion.div>
    );
};

export default AdmissionForm;  // ✔ FIXED position
