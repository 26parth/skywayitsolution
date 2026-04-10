//C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\frontend\src\pages\EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "../hooks/userQueries";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import SubmitButton from "../components/SubmitButton"; // Import karo

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetProfile();
    const update = useUpdateProfile();

    const [form, setForm] = useState({
        fullname: "", contactNumber: "", gender: "", dob: "",
        qualification: "", linkedin: "", githublink: "", course: "",
        currentAddress: "", permanentAddress: "", bloodGroup: "", skillsInterests: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (data?.user) {
            setForm({
                ...data.user,
                dob: data.user.dob ? data.user.dob.split('T')[0] : "",
                skillsInterests: data.user.skillsInterests?.join(", ") || ""
            });
        }
    }, [data]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Contact Number must be 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(form.contactNumber)) {
            return alert("Please enter a valid 10-digit contact number!");
        }

        // 2. Mandatory Fields Check (Sirf 3 fields)
        const isMandatoryFilled = form.fullname && form.contactNumber && form.gender;
        if (!isMandatoryFilled) {
            return alert("Please fill all mandatory fields (Name, Contact, Gender)!");
        }

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === "skillsInterests") {
                formData.append(key, form[key].split(",").map(s => s.trim()));
            } else {
                formData.append(key, form[key]);
            }
        });

        if (selectedFile) {
            // Backend controller me tune `req.file` manga hai jiska fieldname 'profilePic' expect ho raha hai
            formData.append("profilePic", selectedFile);
        }


        // 🔥 FIX: Ab frontend se `isProfileComplete` bhejane ki zaroorat nahi hai.
        // Backend khud un mandatory 3 fields ke basis pe isse database me true/false handle kar lega!
        update.mutate(formData, {
            onSuccess: (res) => {
                // 🔥 FIX: Check karo response me kya aa raha hai, mostly res.data me hota hai sab kuch
                const updatedUser = res.data?.user || res.user;

                if (updatedUser) {
                    dispatch(setCredentials({ user: updatedUser, accessToken }));
                }

                alert("Profile Updated Successfully!");
                navigate("/");
            },
            onError: (err) => alert(err.response?.data?.message || "Update failed"),
        });
    };
    if (isLoading) return <div className="min-h-screen bg-[#050D1C] flex items-center justify-center text-sky-400">Loading Form...</div>;

    return (
        <div className="min-h-screen bg-[#050D1C] py-12 px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8">
                <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-tighter italic">Update <span className="text-sky-500">Profile</span></h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload Section */}
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-dashed border-sky-500/50 p-1 mb-4">
                            {preview || form.profilePic ? (
                                <img
                                    src={
                                        preview ||
                                        (form.profilePic?.startsWith('http')
                                            ? form.profilePic
                                            : `http://localhost:5000${form.profilePic}`) // 👈 Backend URL yahan daalo
                                    }
                                    className="w-full h-full object-cover rounded-2xl"
                                    alt="User Profile"
                                />
                            ) : (
                                <div className="h-full w-full bg-white/5 flex items-center justify-center text-[10px] text-gray-500">No Image</div>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/jpeg, image/jpg, image/png" // 🔥 Sirf images allow karne ke liye
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                // Frontend validation: Agar image na ho toh filter out kardo
                                if (!file.type.startsWith("image/")) {
                                    alert("Please upload a valid image file (JPG, JPEG, PNG)!");
                                    e.target.value = null; // Input reset karne ke liye
                                    return;
                                }

                                setSelectedFile(file);
                                setPreview(URL.createObjectURL(file));
                            }}
                            className="text-xs text-gray-400 file:bg-sky-500/20 file:text-sky-400 file:border-0 file:rounded-full file:px-4 file:py-2 cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" name="fullname" value={form.fullname} onChange={handleChange} />
                        <Input label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} />

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-sky-300 uppercase ml-2">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500">
                                <option value="" className="bg-slate-900">Select</option>
                                <option value="Male" className="bg-slate-900">Male</option>
                                <option value="Female" className="bg-slate-900">Female</option>
                                <option value="Other" className="bg-slate-900">Other</option>
                            </select>
                        </div>

                        <Input label="DOB" name="dob" type="date" value={form.dob} onChange={handleChange} />
                        <Input label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} />
                        <Input label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
                        <Input label="LinkedIn Link" name="linkedin" value={form.linkedin} onChange={handleChange} />
                        <Input label="GitHub Link" name="githublink" value={form.githublink} onChange={handleChange} />
                        <Input label="Skills (Comma Separated)" name="skillsInterests" value={form.skillsInterests} onChange={handleChange} />
                        <Input label="Course/Interest" name="course" value={form.course} onChange={handleChange} />
                        <div className="md:col-span-2">
                            <Input label="Current Address" name="currentAddress" value={form.currentAddress} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <Input label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} />
                        </div>
                    </div>

                    // Sabse clean industry standard approach:
                    <SubmitButton
                        isSubmitting={update.isPending}  // ← TanStack Query khud track karta hai!
                        label="Update Profile"
                        loadingLabel="Updating..."
                        color="primary"
                    />
                </form>
            </motion.div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-sky-300 uppercase ml-2">{label}</label>
        <input {...props} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500 placeholder:text-gray-600 transition-all" />
    </div>
);

export default EditProfile;