import React, { useEffect, useState } from "react";
import axiosAdmin from "../../lib/axiosAdmin";
import { toast } from "react-hot-toast";
import { Users, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"; // Icons add kiye
import { motion, AnimatePresence } from "framer-motion";

const avatarColors = [
  { bg: "rgba(14,165,233,0.15)", border: "rgba(14,165,233,0.25)", text: "#0ea5e9" },
  { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)",  text: "#10b981" },
  { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.2)", text: "#8b5cf6" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)",  text: "#f59e0b" },
];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const ShowUser = () => {
  const [users, setUsers]     = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch]   = useState("");
  
  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const fetchUsers = async () => {
    try {
      const res = await axiosAdmin.get("/users");
      setUsers(res.data || []);
    } catch {
      toast.error("Users load nahi ho paye");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Is user ko delete karna chahte hain?")) return;
    try {
      await axiosAdmin.delete(`/delete-user/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id, fullname, email, contactNumber } = editUser;
      await axiosAdmin.put(`/update-user/${_id}`, { fullname, email, contactNumber });
      toast.success("User updated");
      setEditUser(null);
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  // Search badalne par page 1 par reset kar do
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-6 lg:p-8">

      {/* Edit Modal (Wahi Purana Wala) */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-[#0f172a] border border-white/[0.08] rounded-2xl p-7 w-full max-w-md"
            >
              <h2 className="text-[16px] font-bold text-white tracking-tight mb-1">
                Edit User Profile
              </h2>
              <p className="text-[12px] text-slate-500 mb-6">
                Update account details below
              </p>

              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "fullname", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Contact", key: "contactNumber", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={editUser[key] || ""}
                      onChange={(e) => setEditUser({ ...editUser, [key]: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-sky-500/40 rounded-xl px-4 py-2.5 text-[13px] text-slate-200 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-white/[0.06]">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-5 py-2 text-[13px] font-semibold text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 text-[13px] font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Registered Users
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">All system accounts</p>
        </div>
        <div className="flex items-center gap-2 bg-sky-500/[0.1] border border-sky-500/[0.2] px-4 py-2 rounded-lg">
          <Users size={13} className="text-sky-400" />
          <span className="text-[12px] font-bold text-sky-400">
            Total: {users.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 rounded-xl w-full max-w-sm mb-5 focus-within:border-sky-500/40 transition-all">
        <Search size={14} className="text-slate-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-[13px] text-slate-300 w-full placeholder:text-slate-600"
        />
      </div>

      {/* Table (Yahan filtered ki jagah currentItems use kiya) */}
      <div className="bg-[#0f172a] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["User", "Contact", "Role", "Actions"].map((h, i) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest"
                  style={i === 3 ? { textAlign: "center" } : {}}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {currentItems.map((user, idx) => {
                const color = avatarColors[idx % avatarColors.length];
                return (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                          style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
                        >
                          {getInitials(user.fullname)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-200 leading-tight">
                            {user.fullname}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-400">{user.contactNumber || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${user.role === "admin" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditUser(user)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg hover:bg-sky-500/20 transition-all">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => deleteUser(user._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-rose-400 bg-rose-500/[0.08] border border-rose-500/15 rounded-lg hover:bg-rose-500/15 transition-all">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <Users size={32} className="mb-3 opacity-30" />
            <p className="text-[13px] font-medium">No users found</p>
          </div>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-[#0f172a] border border-white/[0.07] px-6 py-4 rounded-2xl">
          <p className="text-[12px] text-slate-500">
            Showing <span className="text-slate-300">{indexOfFirstItem + 1}</span> to <span className="text-slate-300">{Math.min(indexOfLastItem, filtered.length)}</span> of <span className="text-slate-300">{filtered.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-sky-500 text-white" 
                  : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUser;