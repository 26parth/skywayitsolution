import React, { useEffect, useState } from "react";
import axiosClient from "../lib/axiosClient";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        if (err.response?.status === 401) dispatch(logout());
      }
    }
    if (auth.accessToken) fetchProfile();
  }, [auth.accessToken, dispatch]);


  const handleLogout = async () => {
    try {
      // Backend ko bolo cookie aur session delete kare
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      // 🔥 CRITICAL: Redux ko saaf karo aur login par bhejo
      dispatch(logout());
      navigate("/login", { replace: true });

      // Optional: Full page reload taaki koi memory na bache
      window.location.reload();
    }
  };

  // 🔥 NEW: Handle Logout All Devices
  const handleLogoutAll = async () => {
    if (!window.confirm("Are you sure you want to log out from all devices?")) return;

    try {
      await axiosClient.post("/auth/logout-all");
      alert("Logged out from all devices!");
    } catch (err) {
      console.error("Logout all error", err);
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
      window.location.reload();
    }
  };

  if (!auth.accessToken) return null;

  return (
    <div className="min-h-screen w-full bg-[#050D1C] py-12 px-4 flex justify-center items-start overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl">

          {/* 🔥 PROFILE INCOMPLETE ALERT */}
          {profile && !profile.isProfileComplete && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-pulse">
              <span className="text-xl">⚠️</span>
              <p className="font-semibold">Your profile is incomplete. Please fill all details to access all features.</p>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-white/10 pb-10">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-sky-500/30 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
              {profile?.profilePic ? (
                <img src={profile.profilePic} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-sky-600 flex items-center justify-center text-4xl font-black text-white">
                  {profile?.fullname?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">{profile?.fullname}</h1>
              <p className="text-sky-400 font-medium">{profile?.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 uppercase font-bold tracking-widest">{profile?.role}</span>
                {profile?.course && <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full text-[10px] text-sky-400 uppercase font-bold tracking-widest">{profile.course}</span>}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <InfoBox label="Contact" value={profile?.contactNumber} />
            <InfoBox label="Gender" value={profile?.gender} />
            <InfoBox label="DOB" value={profile?.dob ? new Date(profile.dob).toLocaleDateString() : null} />
            <InfoBox label="Qualification" value={profile?.qualification} />
            <InfoBox label="Blood Group" value={profile?.bloodGroup} />
            <InfoBox label="LinkedIn" value={profile?.linkedin} isLink />
            <InfoBox label="GitHub" value={profile?.githublink} isLink />
            <div className="md:col-span-2 lg:col-span-3">
              <InfoBox label="Skills & Interests" value={profile?.skillsInterests?.join(", ")} />
            </div>
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox label="Current Address" value={profile?.currentAddress} />
              <InfoBox label="Permanent Address" value={profile?.permanentAddress} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/edit-profile" className="flex-1 bg-white text-black text-center font-bold py-4 rounded-2xl hover:bg-sky-500 hover:text-white transition-all">Edit Details</Link>

            <button onClick={handleLogout} className="flex-1 border border-red-500/50 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all">Logout Current</button>

            {/* 🔥 NEW BUTTON */}
            <button onClick={handleLogoutAll} className="flex-1 bg-red-600/20 border border-red-600 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all">Logout All Devices</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoBox({ label, value, isLink }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-sky-500/30 transition-all">
      <p className="text-[10px] text-sky-300 font-black uppercase tracking-widest mb-1">{label}</p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-white font-medium text-sm hover:text-sky-400 truncate block">Visit Profile</a>
      ) : (
        <p className="text-white font-medium text-sm">{value || "Not Set"}</p>
      )}
    </div>
  );
}