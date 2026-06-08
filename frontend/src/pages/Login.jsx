//C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\frontend\src\pages\Login.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "../hooks/authQueries";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import axiosClient from "../lib/axiosClient";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-hot-toast";

const schema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const navigate = useNavigate();
    const mutation = useLogin();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (data) => {
        try {
            const res = await mutation.mutateAsync(data);
            dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
            if (res.user.role === "student" && !res.user.isProfileComplete) {
                navigate("/edit-profile?reason=complete_profile");
            } else {
                navigate("/");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Invalid email or password";
            toast.error(msg);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axiosClient.post("/auth/google-login", {
                token: credentialResponse.credential,
            });
            dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
            if (!res.data.isProfileComplete) {
                navigate("/edit-profile?reason=complete_profile");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error("Google login failed. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative px-4 overflow-hidden"
            style={{ background: "#050D1C" }}
        >
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="group relative rounded-3xl p-8 md:p-10 flex flex-col overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.1)] transition-all duration-500 hover:border-sky-500/30">

                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] transition-all duration-1000 ease-in-out group-hover:left-[100%]" />

                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Welcome <span className="text-sky-400">Back</span>
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Please enter your details to login
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-all ${errors.email
                                    ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/50"
                                    : "border-white/10 focus:border-sky-500/50 focus:ring-sky-500/50"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1 ml-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-sky-200 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-all ${errors.password
                                    ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/50"
                                    : "border-white/10 focus:border-sky-500/50 focus:ring-sky-500/50"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1 ml-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end !mt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group/btn relative disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">
                                {isSubmitting || mutation.isPending ? "Logging in..." : "Login"}
                            </span>
                            <span className="relative z-10 group-hover/btn:translate-x-1 transition-transform">
                                →
                            </span>
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#111827] px-2 text-gray-500 font-bold">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google login failed")}
                            theme="filled_black"
                            shape="pill"
                            text="signin_with"
                        />
                    </div>

                    <div className="mt-6 text-center relative z-10">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <button
                                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                                onClick={() => navigate("/register")}
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}