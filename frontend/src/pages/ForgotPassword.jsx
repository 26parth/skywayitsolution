// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../lib/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Kuch galat hua, phir se try karein!");
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
            <h2 className="text-3xl font-bold text-white">Reset <span className="text-sky-400">Password</span></h2>
            <p className="text-gray-400 mt-2 text-sm">Apna email dalein, hum aapko reset link bhej denge.</p>
          </div>

          {message ? (
            <div className="text-center">
              <div className="bg-sky-500/10 text-sky-400 p-4 rounded-xl text-sm mb-6 border border-sky-500/20">
                {message}
              </div>
              <button onClick={() => navigate("/login")} className="text-sky-400 hover:text-sky-300 font-semibold transition-colors text-sm">
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Email</label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? "Sending link..." : "Send Reset Link"} →
              </button>

              <div className="text-center mt-4">
                <button type="button" onClick={() => navigate("/login")} className="text-gray-400 hover:text-white text-sm transition-colors">
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}