import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/adminAuthSlice";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

const AdminHeader = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector((state) => state.adminAuth.admin);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  return (
    <div className="w-full flex justify-between items-center px-8 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      {/* Dashboard Brand Name */}
      <div className="font-black text-xl tracking-tight text-blue-600">
        SKYWAY <span className="text-gray-800">ADMIN</span>
      </div>
      
      {/* Profile Section */}
      <div
        className="relative group"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Profile Trigger */}
        <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-50 transition-all">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center rounded-full shadow-md font-bold text-lg">
            {admin?.fullname?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-800 leading-tight">{admin?.fullname || "Admin User"}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider">Super Admin</p>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>

        {/* Dropdown Menu (Professional Look) */}
        <div className={`absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 origin-top-right ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
             <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Account</p>
             <p className="text-sm font-semibold text-gray-700 truncate">{admin?.email || "admin@skyway.com"}</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => navigate("/admin/edit-profile")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
            >
              <User size={18} /> Edit Profile
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
            >
              <Settings size={18} /> Settings
            </button>
            
            <div className="my-1 border-t border-gray-100"></div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;