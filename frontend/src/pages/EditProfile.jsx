// frontend/src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "../hooks/userQueries";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animation ke liye

const EditProfile = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetProfile();
    const update = useUpdateProfile();

    const [fullname, setFullname] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (data?.user) {
            setFullname(data.user.fullname || "");
            setContactNumber(data.user.contactNumber || "");
            setEmail(data.user.email || "");
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#050D1C" }}>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        update.mutate(
            { fullname, contactNumber },
            {
                onSuccess: () => {
                    alert("Profile updated successfully!");
                    navigate("/profile");
                },
                onError: (err) =>
                    alert(err.response?.data?.message || "Update failed"),
            }
        );
    };

    return (
        // Main Wrapper (Same Dark Background)
        <div className="min-h-screen w-full flex items-center justify-center relative px-4 py-10 overflow-hidden" 
             style={{ background: "#050D1C" }}>
            
            {/* Background Decor */}
            <div className="absolute inset-0 backdrop-blur-[2px]"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Form Card */}
                <div className="group relative rounded-3xl p-8 md:p-10 overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.15)] transition-all duration-500 hover:border-sky-500/30">
                    
                    {/* Shine Effect */}
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] transition-all duration-1000 group-hover:left-[100%]" />

                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Edit <span className="text-sky-400">Profile</span>
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">Keep your information up to date</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        
                        {/* Full Name Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                placeholder="Your Name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 transition-all"
                            />
                        </div>

                        {/* Email Input (Read Only) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email (Locked)</label>
                            <input
                                value={email}
                                readOnly
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
                                title="Email cannot be changed"
                            />
                        </div>

                        {/* Contact Number Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Contact Number</label>
                            <input
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="Phone Number"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 transition-all"
                            />
                        </div>

                        {/* Buttons Group */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={update.isLoading}
                                className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg active:scale-[0.98] group/btn"
                            >
                                {update.isLoading ? "Saving Changes..." : "Save Changes"}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="w-full border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditProfile;