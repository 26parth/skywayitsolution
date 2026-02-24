// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useRegister } from "../hooks/authQueries";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { motion } from "framer-motion"; // Animation ke liye

export default function Register() {
  const [form, setForm] = useState({ fullname: "", email: "", contactNumber: "", password: "" });
  const navigate = useNavigate();
  const mutation = useRegister();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());  // clears leftover user
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    // Background Wrapper (Dark Premium Theme)
    <div className="min-h-screen w-full flex items-center justify-center relative px-4 py-10 overflow-hidden" 
         style={{ background: "#050D1C" }}>
      
      {/* Background Blur Elements */}
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      
      {/* Register Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="group relative rounded-3xl p-8 md:p-10 flex flex-col overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.1)] transition-all duration-500 hover:border-sky-500/30">
          
          {/* Shine Effect */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] transition-all duration-1000 ease-in-out group-hover:left-[100%]" />

          {/* Heading */}
          <div className="mb-6 text-center">
             <h2 className="text-3xl font-bold text-white tracking-tight">
               Create <span className="text-sky-400">Account</span>
             </h2>
             <p className="text-gray-400 mt-2 text-sm">Join us and start your learning journey</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 relative z-10">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required 
                placeholder="John Doe" 
                value={form.fullname} 
                onChange={(e)=>setForm({...form,fullname:e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required 
                type="email"
                placeholder="email@example.com" 
                value={form.email} 
                onChange={(e)=>setForm({...form,email:e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 transition-all"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Contact Number</label>
              <input 
                required 
                placeholder="+91 00000 00000" 
                value={form.contactNumber} 
                onChange={(e)=>setForm({...form,contactNumber:e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={(e)=>setForm({...form,password:e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={mutation.isLoading}
              className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg active:scale-[0.98] group/btn overflow-hidden relative"
            >
              <span className="relative z-10">
                {mutation.isLoading ? "Creating Account..." : "Register Now"}
              </span>
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}