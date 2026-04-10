import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosAdmin from "../../lib/axiosAdmin";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Phone, User, Settings, Loader2 } from "lucide-react";

const fetchAdmins = async () => {
  const { data } = await axiosAdmin.get("/admins");
  return data.admins;
};

const Manageadmin = () => {
  const { data: admins, isLoading, isError } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-sky-500 mb-4" size={40} />
      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Loading Admin Database...</p>
    </div>
  );

  if (isError) return (
    <div className="p-10 text-center text-red-500 bg-[#0b1120] min-h-screen">
      <p className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 inline-block">
        ⚠️ Error fetching admins. Check your connection or permissions.
      </p>
    </div>
  );

  return (
    <div className="p-8 bg-[#0b1120] min-h-screen text-slate-200">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Admins</h1>
          <p className="text-sm text-slate-500">Manage administrative access and roles</p>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-lg">
          <span className="text-sky-500 font-bold font-mono">{admins?.length}</span>
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Active Admins</span>
        </div>
      </div>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f172a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                <th className="p-5 text-[11px] font-bold text-slate-500 uppercase tracking-[2px]">Admin User</th>
                <th className="p-5 text-[11px] font-bold text-slate-500 uppercase tracking-[2px]">Email Address</th>
                <th className="p-5 text-[11px] font-bold text-slate-500 uppercase tracking-[2px]">Contact</th>
                <th className="p-5 text-[11px] font-bold text-slate-500 uppercase tracking-[2px]">Access Role</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((admin, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={admin._id} 
                  className="border-b border-white/[0.03] hover:bg-sky-500/[0.02] transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-slate-200">{admin.fullname}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-sky-400 transition-colors">
                      <Mail size={14} />
                      <span className="text-sm">{admin.email}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone size={14} />
                      <span className="text-sm font-mono">{admin.contactNumber}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                      <span className="bg-sky-500/10 text-sky-500 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-sky-500/20">
                        {admin.role}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer hint */}
      <div className="mt-6 flex items-center gap-2 text-slate-600">
        <Settings size={14} className="animate-spin-slow" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Only SuperAdmins can modify these records</p>
      </div>
    </div>
  );
};

export default Manageadmin;