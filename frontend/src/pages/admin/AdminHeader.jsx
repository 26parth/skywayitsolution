//C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\frontend\src\pages\admin\AdminHeader.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/adminAuthSlice";
import { User, LogOut, ChevronDown, Bell, Search, Hexagon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminHeader = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.adminAuth.admin);

  return (
    <nav className="w-full flex justify-between items-center px-8 py-3 bg-[#020617]/90 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-[100]">
      
      {/* ❌ Brand div HATA DIYA — sidebar already hai */}

      {/* Search */}
      <div className="hidden lg:flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-xl w-[340px] focus-within:border-sky-500/40 transition-all">
        <Search size={14} className="text-slate-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search users, commands..."
          className="bg-transparent border-none outline-none text-xs text-slate-300 w-full placeholder:text-slate-600"
        />
        <span className="text-[10px] text-slate-600 font-semibold border border-white/10 px-2 py-[2px] rounded-md tracking-wide">
          ⌘K
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        <div className="relative text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
          <Bell size={18} />
          <span className="absolute -top-[3px] -right-[3px] h-[7px] w-[7px] bg-sky-500 rounded-full border-2 border-[#020617]"></span>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center gap-2.5 cursor-pointer bg-white/[0.04] pl-1.5 pr-4 py-1.5 rounded-full border border-white/[0.08] hover:border-white/20 transition-all">
            <div className="w-[32px] h-[32px] bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center rounded-full font-bold text-[12px]">
              {admin?.fullname?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="hidden md:block">
              <p className="text-[12px] font-semibold text-white leading-tight">
                {admin?.fullname || "Admin"}
              </p>
              <p className="text-[9px] text-sky-500 font-bold uppercase tracking-[0.1em]">
                Root Access
              </p>
            </div>
            <ChevronDown
              size={12}
              className={`text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-[240px] bg-[#0c1527] rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden"
              >
                <div className="px-4 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                  <p className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.15em] mb-1">
                    Authenticated As
                  </p>
                  <p className="text-[12px] font-medium text-slate-200 truncate">
                    {admin?.email || "admin@skyway.com"}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => navigate("/admin/edit-profile")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate-400 hover:bg-white/[0.05] hover:text-sky-400 rounded-xl transition-all"
                  >
                    <User size={14} />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      dispatch(logoutAdmin());
                      navigate("/admin/login");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut size={14} />
                    Terminate Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
export default AdminHeader;