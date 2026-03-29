// frontend/src/components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/adminAuthSlice";
import axiosAdmin from "../../lib/axiosAdmin";

const AdminLayout = () => {
  const { accessToken, isLoading } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Dropdown handle karne ke liye

  if (isLoading) return null; 

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // 1. 🔥 Standard Logout (Sirf is device se)
  const handleLogout = async () => {
    try {
      await axiosAdmin.post("/logout"); 
      dispatch(logoutAdmin()); 
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
      dispatch(logoutAdmin()); 
    }
  };

  // 2. 🔥 Logout All Devices (Sari sessions kill karne ke liye)
  const handleLogoutAll = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out from ALL devices? You will need to login again everywhere.");
    if (!confirmLogout) return;

    try {
      await axiosAdmin.post("/logout-all"); 
      dispatch(logoutAdmin()); 
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout from all devices failed", err);
      dispatch(logoutAdmin()); 
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050D1C]"> 
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-6 border-r border-white/10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-sky-400 tracking-wider">SKYWAY ADMIN</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Management Suite</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link to="/admin/dashboard" className="p-3 rounded-lg hover:bg-white/5 transition-all">Dashboard</Link>
          <Link to="/admin/users" className="p-3 rounded-lg hover:bg-white/5 transition-all">Manage Users</Link>
          <Link to="/admin/showadmission" className="p-3 rounded-lg hover:bg-white/5 transition-all">Admissions</Link>
          <Link to="/admin/addcourse" className="p-3 rounded-lg hover:bg-white/5 transition-all">Add Course</Link>
          <Link to="/admin/enquiries" className="p-3 rounded-lg hover:bg-white/5 transition-all">Enquiries</Link>
          <Link to="/admin/manage-admin" className="p-3 rounded-lg hover:bg-white/5 transition-all text-sky-200">Admins</Link>
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-8 flex justify-between items-center text-white">
          <span className="text-sm font-medium text-gray-400">Welcome, Admin</span>
          
          {/* 🔥 Logout Actions Container */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-4 py-2 bg-slate-800 text-white border border-white/10 rounded-lg hover:bg-slate-700 transition-all text-sm font-bold flex items-center gap-2"
            >
              Account Options
              <span>{isMenuOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                {/* Single Device Logout */}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-slate-700 transition-all flex flex-col"
                >
                  <span>Logout</span>
                  <span className="text-xs text-gray-400">Only from this device</span>
                </button>

                <div className="border-t border-white/5"></div>

                {/* All Devices Logout */}
                <button 
                  onClick={handleLogoutAll}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all flex flex-col"
                >
                  <span>Logout From All Devices</span>
                  <span className="text-xs text-red-300/60">Terminates all active sessions</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#020817]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;