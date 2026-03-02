import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import { Users, GraduationCap, ArrowRight, LayoutDashboard } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
        title: "Total Users", 
        count: "10+", 
        path: "/admin/users", 
        icon: <Users size={24} />,
        color: "from-blue-600 to-blue-400",
        shadow: "shadow-blue-200"
    },
    { 
        title: "Total Admissions", 
        count: "5+", 
        path: "/admin/showadmission", 
        icon: <GraduationCap size={24} />,
        color: "from-emerald-600 to-teal-400",
        shadow: "shadow-emerald-200"
    },
    { 
        title: "New Requests", 
        count: "02", 
        path: "#", 
        icon: <LayoutDashboard size={24} />,
        color: "from-purple-600 to-pink-400",
        shadow: "shadow-purple-200"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Dashboard <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your users and admissions efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`relative group bg-gradient-to-br ${item.color} p-8 rounded-[2rem] shadow-xl ${item.shadow} cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
            >
              {/* Decorative Circle */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
                
                <h3 className="text-white/80 font-medium tracking-wide uppercase text-xs mb-1">
                  {item.title}
                </h3>
                
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-black text-white">{item.count}</p>
                  <div className="bg-white/10 p-2 rounded-full text-white group-hover:translate-x-2 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Placeholder for future sections */}
        <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                <LayoutDashboard size={40} />
             </div>
             <h2 className="text-xl font-bold text-gray-800">Quick Analytics Coming Soon</h2>
             <p className="text-gray-400 max-w-sm mx-auto mt-2">Hum yahan par graphs aur detailed tables add karne wale hain.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;