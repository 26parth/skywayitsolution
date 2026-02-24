// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useLogin } from "../hooks/authQueries";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animation ke liye

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const mutation = useLogin();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(form);
      navigate("/Profile");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    // Background Wrapper (Wahi dark theme jo slider mein thi)
    <div className="min-h-screen w-full flex items-center justify-center relative px-4 overflow-hidden" 
         style={{ background: "#050D1C" }}>
      
      {/* Background Blur Elements */}
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      
      {/* Login Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="group relative rounded-3xl p-8 md:p-10 flex flex-col overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.1)] transition-all duration-500 hover:border-sky-500/30">
          
          {/* Shine Effect (Hover par dikhega) */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] transition-all duration-1000 ease-in-out group-hover:left-[100%]" />

          {/* Heading */}
          <div className="mb-8 text-center">
             <h2 className="text-3xl font-bold text-white tracking-tight">
               Welcome <span className="text-sky-400">Back</span>
             </h2>
             <p className="text-gray-400 mt-2 text-sm">Please enter your details to login</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 relative z-10">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Email</label>
              <input 
                required 
                type="email"
                placeholder="Enter your email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              />
            </div>

            {/* Submit Button (Course Card Apply button jaisa style) */}
            <button 
              type="submit" 
              disabled={mutation.isLoading}
              className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group/btn overflow-hidden relative"
            >
              <span className="relative z-10">
                {mutation.isLoading ? "Logging in..." : "Login"}
              </span>
              <span className="relative z-10 group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-gray-400 text-sm">
              Don't have an account?{""}
              <button className="text-sky-400 hover:text-sky-300 font-semibold transition-colors" onClick={() => navigate("/register")}>Sign Up</button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}