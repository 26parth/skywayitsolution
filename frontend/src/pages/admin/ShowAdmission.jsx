import React, { useRef, useEffect, useState } from "react";
import axiosAdmin from "../../lib/axiosAdmin";
import { toast } from "react-toastify";
import {
  GraduationCap, Plus, Pencil, Trash2,
  Award, IndianRupee, X, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Reusable dark input ───────────────────────────────────────────────
const DarkInput = ({ label, ...props }) => (
  <div>
    {label && (
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
    )}
    <input
      {...props}
      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-sky-500/40 rounded-xl px-4 py-2.5 text-[13px] text-slate-200 outline-none transition-all placeholder:text-slate-600"
    />
  </div>
);

// ─── Reusable Modal shell ──────────────────────────────────────────────
const Modal = ({ open, onClose, title, subtitle, children, footer }) => (
  <AnimatePresence>
    {open && (
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
          className="bg-[#0f172a] border border-white/[0.08] rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[16px] font-bold text-white tracking-tight">{title}</h2>
              {subtitle && <p className="text-[12px] text-slate-500 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors ml-4 mt-0.5"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">{children}</div>

          {footer && (
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/[0.06]">
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const BtnCancel = ({ onClick, label = "Cancel" }) => (
  <button
    onClick={onClick}
    className="px-5 py-2 text-[13px] font-semibold text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-all"
  >
    {label}
  </button>
);

const BtnPrimary = ({ onClick, label, icon }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-5 py-2 text-[13px] font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all"
  >
    {icon}{label}
  </button>
);

// ─── Avatar colors ─────────────────────────────────────────────────────
const avatarColors = [
  { bg: "rgba(14,165,233,0.15)", border: "rgba(14,165,233,0.25)", text: "#0ea5e9" },
  { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)", text: "#10b981" },
  { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.2)", text: "#8b5cf6" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)", text: "#f59e0b" },
];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmt = (dateStr) => {
  try { return new Date(dateStr).toLocaleDateString("en-IN"); }
  catch { return "—"; }
};

// ══════════════════════════════════════════════════════════════════════
const ShowAdmission = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // — Add payment
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  // — Edit payment
  const [showEditPayModal, setShowEditPayModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // — Edit admission
  const [showEditAdmModal, setShowEditAdmModal] = useState(false);
  const [editAdmission, setEditAdmission] = useState(null);

  // — Certificate
  const [certAdmission, setCertAdmission] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const fileRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const { data } = await axiosAdmin.get("/admission");
      setAdmissions(data.admissions || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Pagination Logic ───────────────────────────────────────────────
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = admissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(admissions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpanded(null); // Close expanded rows when switching pages
  };

  // ── Delete admission ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admission record?")) return;
    try {
      await axiosAdmin.delete(`/admission/${id}`);
      setAdmissions((prev) => prev.filter((a) => a._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ── Edit admission ─────────────────────────────────────────────────
  const openEditAdmission = (admission) => {
    setEditAdmission({
      ...admission,
      dob: admission.dob?.slice(0, 10) || "",
      joiningDate: admission.joiningDate?.slice(0, 10) || "",
    });
    setShowEditAdmModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAdmission((prev) => ({ ...prev, [name]: value }));
  };

  const submitEditAdmission = async () => {
    try {
      const formData = new FormData();
      Object.keys(editAdmission).forEach((key) => {
        formData.append(key, editAdmission[key]);
      });
      const { data } = await axiosAdmin.put(`/admission/${editAdmission._id}`, formData);
      toast.success("Admission updated");
      setAdmissions((prev) =>
        prev.map((a) => (a._id === data.admission._id ? data.admission : a))
      );
      setShowEditAdmModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // ── Add Payment ────────────────────────────────────────────────────
  const openAddPayment = (admissionId) => {
    setSelectedAdmissionId(admissionId);
    setPaymentAmount("");
    setPaymentDate("");
    setShowAddModal(true);
  };

  const submitAddPayment = async () => {
    if (!paymentAmount) return toast.error("Enter amount");
    try {
      const { data } = await axiosAdmin.post(
        `/admission/${selectedAdmissionId}/payment`,
        { amount: Number(paymentAmount), date: paymentDate || new Date().toISOString() }
      );
      toast.success("Payment added");
      setAdmissions((prev) =>
        prev.map((a) => (a._id === data.admission._id ? data.admission : a))
      );
      setShowAddModal(false);
      setPaymentAmount("");
      setPaymentDate("");
      setSelectedAdmissionId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add payment");
    }
  };

  // ── Edit Payment ───────────────────────────────────────────────────
  const openEditPayment = (admissionId, payment) => {
    setSelectedAdmissionId(admissionId);
    const d = payment.date ? new Date(payment.date) : new Date();
    setEditingPayment({ paymentId: payment._id, amount: payment.amount, date: payment.date });
    setPaymentAmount(payment.amount);
    setPaymentDate(d.toISOString().slice(0, 10));
    setShowEditPayModal(true);
  };

  const submitEditPayment = async () => {
    if (!editingPayment || !paymentAmount) return toast.error("Enter amount");
    try {
      const { data } = await axiosAdmin.put(
        `/admission/${selectedAdmissionId}/payment/${editingPayment.paymentId}`,
        { amount: Number(paymentAmount), date: paymentDate || new Date().toISOString() }
      );
      toast.success("Payment updated");
      setAdmissions((prev) =>
        prev.map((a) => (a._id === data.admission._id ? data.admission : a))
      );
      setShowEditPayModal(false);
      setEditingPayment(null);
      setPaymentAmount("");
      setPaymentDate("");
      setSelectedAdmissionId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment");
    }
  };

  // ── Delete Payment ─────────────────────────────────────────────────
  const handleDeletePayment = async (admissionId, paymentId) => {
    if (!window.confirm("Delete this payment entry?")) return;
    try {
      const { data } = await axiosAdmin.delete(
        `/admission/${admissionId}/payment/${paymentId}`
      );
      toast.success("Payment deleted");
      setAdmissions((prev) =>
        prev.map((a) => (a._id === data.admission._id ? data.admission : a))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete payment");
    }
  };

  // ── Certificate ────────────────────────────────────────────────────
  const openCertificate = (admission) => {
    setCertAdmission(admission);
    setCertFile(null);
    fileRef.current?.click();
  };

  const sendCertificate = async () => {
    if (!certAdmission) return;
    if (!certFile) return toast.error("Please select certificate PDF");
    const fd = new FormData();
    fd.append("certificate", certFile);
    fd.append("admissionId", certAdmission._id);
    try {
      await axiosAdmin.post("/certificate/send", fd);
      toast.success("Certificate sent successfully");
      setCertAdmission(null);
      setCertFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Certificate sending failed");
    }
  };

  const handleImgError = (e) => {
    if (!e.target.dataset.errorHandled) {
      e.target.dataset.errorHandled = "true";
      e.target.src = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
    }
  };
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admissions</h1>
          <p className="text-[12px] text-slate-500 mt-1">All intern admission records</p>
        </div>
        <div className="flex items-center gap-2 bg-sky-500/[0.1] border border-sky-500/[0.2] px-4 py-2 rounded-lg">
          <GraduationCap size={13} className="text-sky-400" />
          <span className="text-[12px] font-bold text-sky-400">
            Total: {admissions.length}
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && admissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <GraduationCap size={36} className="mb-3 opacity-30" />
          <p className="text-[13px] font-medium">No admission records found</p>
        </div>
      )}

      {!loading && admissions.length > 0 && (
        <>
          <div className="space-y-4">
            {currentItems.map((item, idx) => {
              const color = avatarColors[idx % avatarColors.length];
              const totalPaid = item.paymentDetails?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
              const due = (item.totalFees || 0) - totalPaid;
              const isExpanded = expanded === item._id;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#0f172a] border border-white/[0.07] rounded-2xl overflow-hidden"
                >
                  <div className="p-5 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                        style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
                      >
                        {getInitials(item.internName)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white leading-tight">{item.internName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.contactNo}</p>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Course</p>
                      <p className="text-[12px] text-slate-300 font-medium">{item.courseProjectName || "—"}</p>
                      <p className="text-[11px] text-slate-500">{item.courseDuration || "—"}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Joining</p>
                      <p className="text-[12px] text-slate-300">{fmt(item.joiningDate)}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Fees</p>
                      <p className="text-[12px] text-emerald-400 font-semibold">₹{totalPaid} paid</p>
                      <p className={`text-[11px] ${due > 0 ? "text-rose-400" : "text-slate-500"}`}>
                        {due > 0 ? `₹${due} due` : "Fully paid"}
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3 flex flex-wrap items-center gap-2 justify-end">
                      <button onClick={() => openEditAdmission(item)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg hover:bg-sky-500/20 transition-all">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-rose-400 bg-rose-500/[0.08] border border-rose-500/15 rounded-lg hover:bg-rose-500/15 transition-all">
                        <Trash2 size={11} /> Delete
                      </button>
                      <button onClick={() => openCertificate(item)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all">
                        <Award size={11} /> Certificate
                      </button>
                      <button onClick={() => setExpanded(isExpanded ? null : item._id)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-slate-400 bg-white/[0.04] border border-white/[0.07] rounded-lg hover:bg-white/[0.08] transition-all">
                        <IndianRupee size={11} /> Payments {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-white/[0.06]">
                        <div className="p-5 grid grid-cols-12 gap-6">
                       <div className="col-span-12 sm:col-span-3 flex gap-6 items-center justify-center sm:justify-start border-r border-white/[0.05]">
                          <div className="text-center group">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Photo</p>
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-sky-500/50 transition-all shadow-lg">
                              <img
                                src={item.photo} // Direct Cloudinary URL from DB
                                alt="Intern"
                                className="w-full h-full object-cover"
                                onError={handleImgError}
                              />
                            </div>
                          </div>

                            <div className="text-center group">
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Signature</p>
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-sky-500/50 transition-all bg-white/5 shadow-lg">
                                <img
                                  src={item.signature} // Direct Cloudinary URL from DB
                                  alt="Sign"
                                  className="w-full h-full object-contain p-1"
                                  onError={handleImgError}
                                />
                              </div>
                            </div>


                          </div>
                          <div className="col-span-12 sm:col-span-4 grid grid-cols-2 gap-3">
                            {[{ label: "DOB", value: fmt(item.dob) }, { label: "Address", value: item.address }, { label: "Education", value: item.educationDetails }, { label: "Total Fees", value: `₹${item.totalFees || 0}` }].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">{label}</p>
                                <p className="text-[12px] text-slate-300">{value || "—"}</p>
                              </div>
                            ))}
                          </div>
                          <div className="col-span-12 sm:col-span-5">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] text-slate-600 uppercase tracking-widest">Payment History</p>
                              <button onClick={() => openAddPayment(item._id)} className="flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all">
                                <Plus size={11} /> Add Payment
                              </button>
                            </div>
                            {item.paymentDetails?.length > 0 ? (
                              <div className="space-y-2">
                                {item.paymentDetails.map((p) => (
                                  <div key={p._id} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5">
                                    <div>
                                      <p className="text-[13px] font-semibold text-emerald-400">₹{p.amount}</p>
                                      <p className="text-[10px] text-slate-500 mt-0.5">{fmt(p.date)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <button onClick={() => openEditPayment(item._id, p)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg hover:bg-sky-500/20 transition-all">
                                        <Pencil size={10} /> Edit
                                      </button>
                                      <button onClick={() => handleDeletePayment(item._id, p._id)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-400 bg-rose-500/[0.08] border border-rose-500/15 rounded-lg hover:bg-rose-500/15 transition-all">
                                        <Trash2 size={10} /> Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 border-t border-white/[0.06] mt-2">
                                  <p className="text-[11px] text-slate-500">Total paid</p>
                                  <p className="text-[13px] font-bold text-emerald-400">₹{totalPaid}</p>
                                </div>
                                {due > 0 && (
                                  <div className="flex justify-between items-center">
                                    <p className="text-[11px] text-slate-500">Remaining</p>
                                    <p className="text-[13px] font-bold text-rose-400">₹{due}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-[12px] text-slate-600 py-4 text-center">No payments yet</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ── Pagination Controls ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-30 hover:bg-white/[0.08] transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all ${currentPage === i + 1
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08]"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-30 hover:bg-white/[0.08] transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setCertFile(e.target.files?.[0] || null)} />

      <AnimatePresence>
        {certAdmission && certFile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 bg-[#0f172a] border border-white/[0.1] rounded-2xl px-5 py-4 flex items-center gap-4 z-50 shadow-2xl">
            <Award size={16} className="text-purple-400" />
            <div>
              <p className="text-[12px] font-semibold text-white">Certificate ready for <span className="text-purple-400">{certAdmission.internName}</span></p>
              <p className="text-[10px] text-slate-500 mt-0.5">{certFile.name}</p>
            </div>
            <button onClick={sendCertificate} className="px-4 py-1.5 text-[12px] font-bold text-white bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all">Send</button>
            <button onClick={() => { setCertAdmission(null); setCertFile(null); }} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={showEditAdmModal} onClose={() => setShowEditAdmModal(false)} title="Edit Admission" subtitle="Update intern admission details" footer={<><BtnCancel onClick={() => setShowEditAdmModal(false)} /><BtnPrimary onClick={submitEditAdmission} label="Update" /></>}>
        {editAdmission && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><DarkInput label="Intern Name" name="internName" value={editAdmission.internName || ""} onChange={handleEditChange} placeholder="Full name" /></div>
            <DarkInput label="Contact No" name="contactNo" value={editAdmission.contactNo || ""} onChange={handleEditChange} placeholder="Contact" />
            <DarkInput label="DOB" type="date" name="dob" value={editAdmission.dob || ""} onChange={handleEditChange} />
            <div className="col-span-2"><DarkInput label="Address" name="address" value={editAdmission.address || ""} onChange={handleEditChange} placeholder="Address" /></div>
            <DarkInput label="Joining Date" type="date" name="joiningDate" value={editAdmission.joiningDate || ""} onChange={handleEditChange} />
            <DarkInput label="Course Duration" name="courseDuration" value={editAdmission.courseDuration || ""} onChange={handleEditChange} placeholder="e.g. 3 months" />
            <DarkInput label="Project Name" name="courseProjectName" value={editAdmission.courseProjectName || ""} onChange={handleEditChange} placeholder="Project" />
            <DarkInput label="Education" name="educationDetails" value={editAdmission.educationDetails || ""} onChange={handleEditChange} placeholder="Education" />
            <div className="col-span-2"><DarkInput label="Total Fees (₹)" type="number" name="totalFees" value={editAdmission.totalFees || ""} onChange={handleEditChange} placeholder="0" /></div>
          </div>
        )}
      </Modal>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Payment" subtitle="Record a new payment entry" footer={<><BtnCancel onClick={() => setShowAddModal(false)} /><BtnPrimary onClick={submitAddPayment} label="Add Payment" icon={<Plus size={13} />} /></>}>
        <DarkInput label="Amount (₹)" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount" />
        <DarkInput label="Date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
      </Modal>

      <Modal open={showEditPayModal} onClose={() => setShowEditPayModal(false)} title="Edit Payment" subtitle="Update this payment entry" footer={<><BtnCancel onClick={() => setShowEditPayModal(false)} /><BtnPrimary onClick={submitEditPayment} label="Save Changes" /></>}>
        <DarkInput label="Amount (₹)" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount" />
        <DarkInput label="Date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
      </Modal>
    </div>
  );
};

export default ShowAdmission;