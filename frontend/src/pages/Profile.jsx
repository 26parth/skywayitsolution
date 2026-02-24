// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animation ke liye

export default function Profile() {
  const auth = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axiosClient.get("/user/profile");
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    }

    if (auth.accessToken) {
      fetchProfile();
    }
  }, [auth.accessToken]);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      setProfile(null);
      navigate("/login");
    }
  };

  if (!auth.accessToken) {
    navigate("/login");
    return null;
  }

  return (
    // Main Container (Same Dark Background)
    <div className="min-h-screen w-full flex items-center justify-center relative px-4 py-12 overflow-hidden" 
         style={{ background: "#050D1C" }}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Profile Card */}
        <div className="group relative rounded-[2rem] p-8 md:p-12 overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_60px_rgba(14,165,233,0.15)] transition-all duration-500 hover:border-sky-500/30">
          
          {/* Shine Effect */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] transition-all duration-1000 group-hover:left-[100%]" />

          {/* Top Section: Avatar & Title */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-[0_0_20px_rgba(14,165,233,0.4)] border-4 border-white/10">
              {profile ? profile.fullname.charAt(0).toUpperCase() : "?"}
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">User <span className="text-sky-400">Dashboard</span></h2>
            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold">Student Profile</p>
          </div>

          {profile ? (
            <div className="space-y-6 relative z-10">
              {/* Info Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                  <p className="text-xs text-sky-200 uppercase font-bold tracking-tighter mb-1">Full Name</p>
                  <p className="text-white font-medium">{profile.fullname}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
                  <p className="text-xs text-sky-200 uppercase font-bold tracking-tighter mb-1">Email ID</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all md:col-span-2">
                  <p className="text-xs text-sky-200 uppercase font-bold tracking-tighter mb-1">Contact Number</p>
                  <p className="text-white font-medium">{profile.contactNumber}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <Link
                  to="/edit-profile"
                  className="flex-1 text-center bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg active:scale-95"
                >
                  Edit Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex-1 border border-red-500/50 text-red-400 font-bold py-3.5 rounded-xl hover:bg-red-500/10 hover:border-red-500 transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your profile details...</p>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}