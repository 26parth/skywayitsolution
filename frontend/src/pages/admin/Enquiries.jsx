import { useAdminEnquiries, useDeleteEnquiry } from "../../hooks/adminEnquiryFeedback";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Mail, User, MessageSquare, Inbox, Loader2, ChevronLeft, ChevronRight } from "lucide-react"; // Icons add kiye
import { toast } from "react-hot-toast";
import { useState } from "react"; // State import kiya

export default function Enquiries() {
  const { data = [], isLoading } = useAdminEnquiries();
  const del = useDeleteEnquiry();

  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      del.mutate(id, {
        onSuccess: () => {
          toast.success("Enquiry deleted successfully");
          // Agar current page khaali ho jaye delete ke baad
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        },
        onError: () => toast.error("Failed to delete enquiry")
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="animate-spin text-sky-500" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Fetching Enquiries...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0b1120] min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
          <Inbox size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Customer Enquiries</h2>
          <p className="text-sm text-slate-500">Manage and respond to user messages</p>
        </div>
        <div className="ml-auto bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-lg">
          <span className="text-sky-500 font-mono font-bold">{data.length}</span>
          <span className="text-slate-500 text-xs ml-2 uppercase tracking-tighter">Total</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] rounded-2xl border border-dashed border-white/10">
          <p className="text-slate-500">No enquiries found at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            <AnimatePresence mode='popLayout'>
              {/* Sirf currentItems map honge */}
              {currentItems.map((e) => (
                <motion.div
                  key={e._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="group relative bg-[#0f172a] border border-white/[0.08] hover:border-sky-500/40 rounded-2xl p-5 transition-all duration-300 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">
                          <User size={14} className="text-sky-400" />
                          <span className="text-sm font-semibold text-slate-200">{e.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={14} />
                          <span className="text-xs hover:text-sky-400 cursor-pointer transition-colors">{e.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start bg-black/20 p-4 rounded-xl border border-white/[0.02]">
                        <MessageSquare size={16} className="text-slate-600 mt-1 shrink-0" />
                        <p className="text-slate-400 text-sm leading-relaxed italic">
                          "{e.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(e._id)}
                        disabled={del.isPending}
                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 border border-red-500/20 shadow-lg shadow-red-500/5"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between bg-[#0f172a] border border-white/[0.07] px-6 py-4 rounded-2xl">
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Page <span className="text-sky-500 font-bold">{currentPage}</span> of {totalPages}
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-sky-500/10 hover:text-sky-400 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                        currentPage === i + 1 
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
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-sky-500/10 hover:text-sky-400 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}