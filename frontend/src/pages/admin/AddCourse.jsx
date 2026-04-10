import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import API from "../../lib/axiosAdminCourse";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { BookOpen, Clock, IndianRupee, FileText, Plus } from "lucide-react";

// ─── Reusable Dark Input Component ──────────────────────────────────
const DarkInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
        <Icon size={16} />
      </div>
      <input
        {...props}
        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-sky-500/40 rounded-xl pl-11 pr-4 py-3 text-[14px] text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:bg-white/[0.05]"
      />
    </div>
  </div>
);

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await API.post("/", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course added successfully!");
      // Form reset taaki user wahi page par naya entry kar sake
      setFormData({
        title: "",
        description: "",
        duration: "",
        price: "",
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.duration || !formData.price) {
      toast.error("Please fill all fields");
      return;
    }
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0f172a] border border-white/[0.08] rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
            <Plus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Add New Course</h1>
            <p className="text-[12px] text-slate-500">Create a new professional course entry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <DarkInput
            label="Course Title"
            icon={BookOpen}
            name="title"
            placeholder="e.g. Full Stack Web Development"
            value={formData.title}
            onChange={handleChange}
          />

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Description
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-4 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                <FileText size={16} />
              </div>
              <textarea
                name="description"
                placeholder="Briefly describe the course content..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-sky-500/40 rounded-xl pl-11 pr-4 py-3 text-[14px] text-slate-200 outline-none transition-all placeholder:text-slate-600 h-32 resize-none focus:bg-white/[0.05]"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DarkInput
              label="Duration"
              icon={Clock}
              name="duration"
              placeholder="e.g. 3 Months"
              value={formData.duration}
              onChange={handleChange}
            />
            <DarkInput
              label="Price (₹)"
              icon={IndianRupee}
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/10"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={18} />
                <span>Publish Course</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCourse;