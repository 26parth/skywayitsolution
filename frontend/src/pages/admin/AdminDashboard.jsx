import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import {
  Users, GraduationCap, ArrowRight, BookOpen,
  MessageSquare, LayoutGrid, Activity, Clock, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ icon, label, value, change, changeType, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0f172a] border border-white/[0.07] rounded-2xl p-5"
  >
    <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-3`} style={{ color }}>
      {icon}
      {label}
    </div>
    <p className="text-[32px] font-extrabold text-white tracking-tight leading-none">{value}</p>
    <p className={`text-[11px] font-medium mt-2 ${
      changeType === "up" ? "text-emerald-500" :
      changeType === "down" ? "text-rose-400" :
      "text-slate-500"
    }`}>
      {change}
    </p>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const stats = [
    {
      icon: <Users size={13} />,
      label: "Total Users",
      value: "128",
      change: "↑ +12% this month",
      changeType: "up",
      color: "#0ea5e9",
    },
    {
      icon: <GraduationCap size={13} />,
      label: "New Admissions",
      value: "05",
      change: "Pending review",
      changeType: "neutral",
      color: "#8b5cf6",
    },
    {
      icon: <BookOpen size={13} />,
      label: "Active Courses",
      value: "08",
      change: "↑ 2 added recently",
      changeType: "up",
      color: "#10b981",
    },
    {
      icon: <MessageSquare size={13} />,
      label: "Enquiries",
      value: "14",
      change: "3 unread",
      changeType: "down",
      color: "#f59e0b",
    },
  ];

  const activity = [
    { initials: "PP", name: "Parth Parmar", action: "applied for", target: "MERN Stack", time: "2h ago", color: "#0ea5e9" },
    { initials: "RK", name: "Raj Kumar", action: "enrolled in", target: "React Pro", time: "5h ago", color: "#10b981" },
    { initials: "AS", name: "Ankit Shah", action: "submitted", target: "admission form", time: "1d ago", color: "#8b5cf6" },
    { initials: "NP", name: "Nisha Patel", action: "registered as", target: "new user", time: "1d ago", color: "#0ea5e9" },
  ];

  const quickActions = [
    {
      icon: <Users size={16} />,
      name: "Manage Users",
      sub: "128 total accounts",
      path: "/admin/users",
      badge: null,
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.1)",
    },
    {
      icon: <GraduationCap size={16} />,
      name: "Admissions",
      sub: "5 pending review",
      path: "/admin/showadmission",
      badge: "5 New",
      badgeColor: "text-emerald-500 bg-emerald-500/10",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      icon: <BookOpen size={16} />,
      name: "Add Course",
      sub: "8 courses active",
      path: "/admin/addcourse",
      badge: null,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 flex">

      {/* Slim Sidebar */}
      <aside className="hidden lg:flex w-[60px] flex-col items-center py-5 gap-2 bg-[#070d1a] border-r border-white/[0.06] flex-shrink-0">
        <div className="w-9 h-9 bg-sky-500 rounded-[10px] flex items-center justify-center mb-4">
          <ShieldCheck size={16} className="text-white" />
        </div>
        {[
          { icon: <LayoutGrid size={17} />, active: true },
          { icon: <Users size={17} />, path: "/admin/users" },
          { icon: <GraduationCap size={17} />, path: "/admin/showadmission" },
          { icon: <Activity size={17} /> },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => item.path && navigate(item.path)}
            className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all
              ${item.active
                ? "bg-sky-500/15 text-sky-400"
                : "text-slate-600 hover:bg-white/5 hover:text-slate-300"
              }`}
          >
            {item.icon}
          </button>
        ))}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
              <p className="text-[12px] text-slate-500 mt-1">{today}</p>
            </div>
           
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#0f172a] border border-white/[0.07] rounded-2xl p-5"
              >
                <div
                  className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: s.color }}
                >
                  {s.icon}
                  {s.label}
                </div>
                <p className="text-[32px] font-extrabold text-white tracking-tight leading-none">
                  {s.value}
                </p>
                <p className={`text-[11px] font-medium mt-2 ${
                  s.changeType === "up" ? "text-emerald-500" :
                  s.changeType === "down" ? "text-amber-400" :
                  "text-slate-500"
                }`}>
                  {s.change}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Activity Feed */}


            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="lg:col-span-2 bg-[#0f172a] border border-white/[0.07] rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-5">
                <ArrowRight size={13} className="text-sky-400" />
                Quick Actions
              </div>

              <div className="space-y-2">
                {quickActions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(q.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-sky-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center flex-shrink-0"
                        style={{ background: q.bg, color: q.color }}
                      >
                        {q.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-semibold text-slate-200">{q.name}</p>
                        <p className="text-[11px] text-slate-500">{q.sub}</p>
                      </div>
                    </div>
                    {q.badge ? (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${q.badgeColor}`}>
                        {q.badge}
                      </span>
                    ) : (
                      <ArrowRight
                        size={14}
                        className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;