import { 
  useAdminFeedbacks, 
  useDeleteFeedback, 
  usePinFeedback 
} from "../../hooks/adminEnquiryFeedback";

export default function Feedbacks() {
  const { data = [], isLoading } = useAdminFeedbacks();
  const del = useDeleteFeedback();
  const pin = usePinFeedback();

  if (isLoading) return <p className="text-white p-5">Loading Feedbacks...</p>;

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 border-b border-slate-700 pb-3">
        Customer Feedbacks <span className="text-sm font-normal text-slate-400">({data.length})</span>
      </h2>

      <div className="grid gap-4">
        {data.length > 0 ? (
          data.map((f) => (
            <div 
              key={f._id} 
              className={`p-5 rounded-lg border transition-all ${
                f.isPinned 
                ? "border-sky-500 bg-sky-900/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]" 
                : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {/* User Profile Pic in Admin for reference */}
                  <img 
                    src={f.userId?.profilePic || `https://ui-avatars.com/api/?name=${f.userId?.fullname}`} 
                    className="w-12 h-12 rounded-full border border-slate-600"
                    alt=""
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg">{f.userId?.fullname || "Deleted User"}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        f.isPinned ? "bg-sky-500 text-white" : "bg-slate-600 text-slate-300"
                      }`}>
                        {f.isPinned ? "Pinned & Live" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{f.userId?.email || "No Email"}</p>
                    <p className="text-slate-200 italic bg-black/20 p-3 rounded border-l-4 border-slate-600">
                      "{f.feedback}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => pin.mutate(f._id)}
                    className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                      f.isPinned 
                      ? "bg-amber-500 hover:bg-amber-600 text-white" 
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                    }`}
                  >
                    {f.isPinned ? "📍 Unpin" : "📌 Pin to Home"}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if(window.confirm("Are you sure you want to delete this?")) {
                        del.mutate(f._id);
                      }
                    }}
                    className="px-4 py-2 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 text-sm transition-all"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-xl">
             <p className="text-slate-500">No feedbacks received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}