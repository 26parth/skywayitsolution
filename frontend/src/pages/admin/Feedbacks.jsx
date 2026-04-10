import { 
  useAdminFeedbacks, 
  useDeleteFeedback, 
  usePinFeedback 
} from "../../hooks/adminEnquiryFeedback";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, PinOff, Trash2, MessageCircle, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react"; // Icons add kiye
import { toast } from "react-hot-toast";
import { useState } from "react"; // State import kiya

export default function Feedbacks() {
  const { data = [], isLoading } = useAdminFeedbacks();
  const del = useDeleteFeedback();
  const pin = usePinFeedback();

  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Ek page par 4 feedback cards
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePin = (id) => {
    pin.mutate(id, {
      onSuccess: () => toast.success("Feedback status updated"),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bhai, sure hai delete karna hai?")) {
      del.mutate(id, {
        onSuccess: () => {
          toast.success("Feedback deleted");
          // Page adjustment agar last item delete ho jaye
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-sky-500" size={40} />
        <p className="text-slate-400 font-mono tracking-widest uppercase text-xs">Loading Feedbacks...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0b1120] min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Customer Feedbacks</h2>
            <p className="text-sm text-slate-500">Manage what testimonials show on your landing page</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.08] px-5 py-2 rounded-xl flex items-center gap-3">
          <span className="text-sky-500 font-mono font-bold text-xl">{data.length}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">Total Reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {currentItems.length > 0 ? (
            currentItems.map((f) => (
              <motion.div
                key={f._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                  f.isPinned 
                  ? "border-sky-500/50 bg-sky-500/[0.03] shadow-[0_0_20px_rgba(14,165,233,0.05)]" 
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                }`}
              >
                {f.isPinned && (
                  <div className="absolute -top-3 -right-3 bg-sky-500 text-white p-1.5 rounded-lg shadow-lg rotate-12">
                    <Star size={14} fill="white" />
                  </div>
                )}

                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img 
                        src={f.userId?.profilePic || `https://ui-avatars.com/api/?name=${f.userId?.fullname}&background=random&color=fff`} 
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white/[0.05] group-hover:border-sky-500/30 transition-colors"
                        alt="User"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0b1120] ${f.userId ? "bg-green-500" : "bg-slate-500"}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-white truncate">
                          {f.userId?.fullname || "Former Student"}
                        </h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-black tracking-tighter uppercase ${
                          f.isPinned ? "bg-sky-500/20 text-sky-400" : "bg-slate-800 text-slate-500"
                        }`}>
                          {f.isPinned ? "Live on Web" : "Draft"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mb-3">{f.userId?.email || "user@deleted.com"}</p>
                      
                      <div className="relative">
                        <p className="text-slate-300 text-sm leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/[0.03] before:content-['“'] after:content-['”'] before:text-2xl before:text-slate-700 before:absolute before:-top-2 before:-left-1">
                          {f.feedback}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.05]">
                    <button 
                      onClick={() => handlePin(f._id)}
                      disabled={pin.isPending}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        f.isPinned 
                        ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white" 
                        : "bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white"
                      }`}
                    >
                      {f.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                      {f.isPinned ? "Unpin Review" : "Feature on Home"}
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(f._id)}
                      disabled={del.isPending}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10 transition-all shadow-lg shadow-red-500/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full text-center py-32 rounded-3xl border-2 border-dashed border-white/5"
            >
              <div className="inline-flex w-16 h-16 bg-white/[0.02] rounded-full items-center justify-center text-slate-700 mb-4">
                <MessageCircle size={32} />
              </div>
              <p className="text-slate-600 font-medium">No feedbacks received yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between bg-white/[0.02] border border-white/[0.08] px-6 py-4 rounded-2xl">
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
            Showing <span className="text-sky-500">{indexOfFirstItem + 1}</span> to <span className="text-sky-500">{Math.min(indexOfLastItem, data.length)}</span> of {data.length} feedbacks
          </p>
          
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-sky-500/10 hover:text-sky-400 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                  : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08]"
                }`}
              >
                {i + 1}
              </button>
            ))}

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
    </div>
  );
}