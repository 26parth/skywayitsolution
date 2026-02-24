// frontend/src/pages/admin/AdminRegister.jsx
import React, { useState } from "react";
import { useAdminRegister } from "../../hooks/adminQueries";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [form, setForm] = useState({ fullname: "", email: "", contactNumber: "", password: "" });
  const register = useAdminRegister();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register.mutateAsync(form);
      alert("Admin created. Now login.");
      navigate("/admin/login");

      // Optionally redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Admin Register (Temporary)</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Full name" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
        <input required placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <input required placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
}
