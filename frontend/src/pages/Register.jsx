import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRegister } from "../hooks/authQueries";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { motion } from "framer-motion";

const schema = z.object({
  fullname: z.string().min(2, "Enter 2+ characters"),
  email: z.string().email("Enter valid email"),
  contactNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10 digit number"),
  password: z.string()
    .min(6, "6+ characters")
    .regex(/[0-9]/, "Enter one number")
    .regex(/[!@#$%^&*]/, "One special character"),
});

export default function Register() {
  const navigate = useNavigate();
  const mutation = useRegister();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await mutation.mutateAsync(data);

      // ✅ Register hote hi auto-login — Redux mein credentials set karo
      dispatch(setCredentials({
        user: res.user,
        accessToken: res.accessToken,
      }));

      // ✅ Seedha edit-profile par bhejo — login ki zaroorat nahi
      navigate("/edit-profile?reason=complete_profile");

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "#050D1C" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="rounded-3xl p-8 bg-white/10 border border-white/10 backdrop-blur-md">

          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Create <span className="text-sky-400">Account</span>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest">
                Full Name
              </label>
              <input
                {...register("fullname")}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
              {errors.fullname && (
                <p className="text-red-400 text-xs mt-1">{errors.fullname.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest">
                Contact Number
              </label>
              <input
                {...register("contactNumber")}
                placeholder="9876543210"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
              {errors.contactNumber && (
                <p className="text-red-400 text-xs mt-1">{errors.contactNumber.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-sky-200 uppercase tracking-widest">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-sky-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting || mutation.isPending ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-sky-400 font-semibold"
            >
              Sign in
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  );
}