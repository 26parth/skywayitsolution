import React from "react";
import { Outlet, Link } from "react-router-dom";
// Aap apna Sidebar/Slider component yahan import karein agar alag se banaya hai
// For now, main yahan ek simple sidebar de raha hoon

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- Sidebar (Slider) --- */}
      <div className="w-64 bg-slate-800 text-white p-5 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard Home</Link>
        <Link to="/admin/users" className="hover:text-blue-400">Manage Users</Link>
        <Link to="/admin/showadmission" className="hover:text-blue-400">Admissions</Link>
        <Link to="/admin/addcourse" className="hover:text-blue-400">Add Course</Link>
        <Link to="/admin/feedbacks" className="hover:text-blue-400">Feedbacks</Link>
        <Link to="/admin/enquiries" className="hover:text-blue-400">Enquiries</Link>
        <Link to="/admin/manage-admin" className="hover:text-blue-400">Manage Admin</Link>
        {/* Baaki links baad mein add kar sakte hain */}
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col">
        {/* Yahan Navbar ki tarah header banaya hai */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <span className="font-semibold">Dashboard Control</span>
          <button className="text-red-500 font-bold">Logout</button>
        </header>

        {/* Content Section: Jahan ShowUser/ShowAdmission load honge */}
        <main className="p-4 overflow-auto">
          <Outlet /> {/* Ye Outlet hi baki pages ko yahan dikhayega */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;