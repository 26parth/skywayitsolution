// frontend/src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../lib/axiosClient";

export default function ResetPassword() {
  const { token } = useParams(); // URL se token extract karne ke liye
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords match nahi ho rahe!");

    setLoading(true);
    try {
      await axiosClient.post(`/auth/reset-password/${token}`, { password });
      alert("Password reset ho gaya! Ab aap login kar sakte ho.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired session!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative px-4 overflow-hidden" style={{ background: "#050D1C" }}>
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="group relative rounded-3xl p-8 md:p-10 flex flex-col overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.1)] transition-all duration-500 hover:border-sky-500/30">
          
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-white">New <span className="text-sky-400">Password</span></h2>
            <p className="text-gray-400 mt-2 text-sm">Apna naya strong password set karein.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">New Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Confirm Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? "Updating..." : "Update Password"} →
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}