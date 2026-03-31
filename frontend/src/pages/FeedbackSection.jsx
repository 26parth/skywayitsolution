import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../lib/axiosClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const FeedbackSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
      // Sirf itna path do, baseURL apne aap Render ka utha lega
const res = await axiosClient.get("/feedback/visible");
        if (res.data?.feedbacks) setTestimonials(res.data.feedbacks);
      } catch (err) { console.error("❌ Error:", err); }
      finally { setLoading(false); }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="py-20 px-6" style={{ background: "#050D1C" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Feedback <span className="text-sky-500">& Reviews</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-4">What Our Clients Say About Us</p>
          <div className="w-24 h-1 bg-sky-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-white text-center">Loading Feedbacks...</div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="feedback-swiper pb-14"
          >
            {testimonials.length > 0 ? (
              testimonials.map((t) => {
                const user = t.userId; 
                // Priority: User's Profile Pic -> UI Avatars Initials
                const profileImg = user?.profilePic || `https://ui-avatars.com/api/?name=${user?.fullname || 'U'}&background=0ea5e9&color=fff&bold=true&length=2`;

                return (
                  <SwiperSlide key={t._id}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 h-[280px] flex flex-col relative"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sky-400/50 flex-shrink-0 shadow-lg shadow-sky-500/10">
                          <img 
                            src={profileImg} 
                            alt={user?.fullname}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${user?.fullname || 'U'}&background=0ea5e9&color=fff&bold=true`;
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg line-clamp-1">{user?.fullname || "Skyway User"}</h3>
                          <p className="text-sky-400 text-xs font-medium tracking-wider uppercase">Verified Feedback</p>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <p className="text-gray-300 italic leading-relaxed text-sm md:text-base line-clamp-4">
                          <span className="text-sky-500 text-2xl font-serif">“</span>
                          {t.feedback}
                          <span className="text-sky-500 text-2xl font-serif">”</span>
                        </p>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              })
            ) : (
              <p className="text-center text-gray-500 col-span-full">No feedbacks to display.</p>
            )}
          </Swiper>
        )}
      </div>

      <style>{`
        .swiper-pagination-bullet { background: #38bdf8 !important; }
        .swiper-pagination-bullet-active { width: 25px !important; border-radius: 10px !important; }
      `}</style>
    </div>
  );
};

export default FeedbackSection;