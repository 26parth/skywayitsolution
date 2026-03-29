import React, { useState } from "react";
import { useLogin } from "../hooks/authQueries";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { GoogleLogin } from '@react-oauth/google';

// ❌ Isko delete karo: import axios from "axios";
// 🔥 FIX 1: Apne custom axiosClient ko import karo jisme withCredentials pehle se true hai!
import axiosClient from "../lib/axiosClient"; 

import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const mutation = useLogin();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await mutation.mutateAsync(form);
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));

      if (res.user.role === "student" && !res.user.isProfileComplete) {
        navigate("/edit-profile?reason=complete_profile");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // 🔥 FIX 2: Is function ko ab hum axiosClient se hit karenge
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Direct axios ki jagah axiosClient use karo
      const res = await axiosClient.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));

      if (res.data.isProfileComplete === false) {
        navigate("/edit-profile?reason=complete_profile");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
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

          {/* 🔥 Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#111827] px-2 text-gray-500 font-bold">Or continue with</span></div>
          </div>

          {/* 🔥 Google Button Container */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
              text="signin_with"
            />
          </div>

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