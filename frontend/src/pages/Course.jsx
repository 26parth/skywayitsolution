import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../lib/axiosPublic";

// 1. Framer Motion Variants (Code-1 Style)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

export default function CourseSlider() {
  const navigate = useNavigate();

  /* ---------------- BACKEND LOGIC (Code-2) ---------------- */
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/");
      setCourses(res?.data?.courses || []);
    } catch (err) {
      console.error(err);
      setError("Courses load nahi ho pa rahe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleBuyCourse = (course) => {
    navigate("/admissionform", {
      state: {
        courseId: course._id,
        courseTitle: course.title,
        courseDuration: course.duration,
        price: course.price,
      },
    });
  };

  /* ---------------- EMBLA CAROUSEL SETUP (Code-1 & 2 Merge) ---------------- */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    breakpoints: {
      '(max-width: 768px)': { align: 'center' }
    }
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onScroll = useCallback((api) => {
    if (!api) return;
    const progress = Math.max(0, Math.min(1, api.scrollProgress()));
    setScrollProgress(progress * 100);
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll(emblaApi);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("select", onScroll);
  }, [emblaApi, onScroll]);

  /* ---------------- UI LOADING STATES ---------------- */
  if (loading) return <div className="text-center text-white py-10 font-bold">Loading Premium Courses...</div>;
  if (error) return <div className="text-center text-red-400 py-10">{error}</div>;

  /* ---------------- FINAL UI (Code-1 Look + Code-2 Data) ---------------- */
  return (
    <div className="w-full flex justify-center relative px-0 sm:px-8 py-8 overflow-hidden" style={{ background: "#050D1C" }}>
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-[90rem] mx-auto relative z-10 flex flex-col gap-2 sm:gap-3 lg:gap-4">
        
        {/* Heading (Code-1 Style) */}
        <div className="text-center">
          <div className="name flex justify-center gap-1">
            {"COURSES".split("").map((letter, i) => (
              <div key={i} className="cosmic" data-text={letter}><span>{letter}</span></div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons (Code-1 Style) */}
        <div className="flex justify-between items-center px-6 lg:px-2">
          <div className="flex-1 hidden sm:block"></div>
          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => emblaApi && emblaApi.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-300 disabled:opacity-30 group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">❮</span>
            </button>
            <button
              onClick={() => emblaApi && emblaApi.scrollNext()}
              disabled={!canScrollNext}
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-300 disabled:opacity-30 group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform">❯</span>
            </button>
          </div>
        </div>

        {/* Carousel / Slider */}
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <motion.div className="flex touch-pan-y" variants={containerVariants} initial="hidden" animate="visible">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                variants={cardVariants}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] min-w-0 px-4 sm:px-0 sm:pl-6"
              >
                {/* Premium Card Design from Code-1 */}
                <div className="group h-full relative rounded-3xl p-8 flex flex-col justify-between overflow-hidden bg-white/20 border border-white/10 backdrop-blur-md transition-all duration-500 ease-out hover:bg-gradient-to-br hover:from-sky-900/40 hover:via-white/5 hover:to-transparent hover:border-sky-500/50 hover:shadow-[0_0_50px_rgba(14,165,233,0.2)] min-h-[400px]">
                  
                  {/* Shine Effect */}
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg] transition-all duration-1000 ease-in-out group-hover:left-[200%]" />

                  {/* Badge */}
                  {course.badge && (
                    <div className="absolute top-6 right-6">
                      <span className="bg-sky-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                        {course.badge}
                      </span>
                    </div>
                  )}

                  {/* Course Info */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-5">
                      <span className="bg-white/10 text-sky-200 text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-white/10 group-hover:bg-sky-500/20 group-hover:text-white transition-all duration-300">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-sky-100 transition-colors duration-300">
                      {course.title}
                    </h3>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center text-gray-400 text-sm gap-3 group-hover:text-gray-200 transition-colors">
                        <span className="p-1.5 rounded-md bg-white/5 border border-white/5 group-hover:border-sky-500/30 group-hover:bg-sky-500/10">⏱</span>
                        {course.duration}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm gap-3 group-hover:text-gray-200 transition-colors">
                        <span className="p-1.5 rounded-md bg-white/5 border border-white/5 group-hover:border-sky-500/30 group-hover:bg-sky-500/10">💰</span>
                        ₹{course.price}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (Logic from Code-2) */}
                  <div className="pt-6 mt-6 border-t border-white/10 group-hover:border-sky-500/30 transition-colors duration-500 relative z-10">
                    <div className="flex gap-3">
                      <button className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-sky-50 transition-all shadow-lg group/btn overflow-hidden relative">
                        <span className="relative z-10 group-hover/btn:translate-x-1 transition-transform inline-block">Details</span>
                      </button>
                      <button 
                        onClick={() => handleBuyCourse(course)}
                        className="flex-1 border border-white/30 text-white font-semibold py-3 rounded-xl hover:bg-sky-500/20 hover:border-sky-400 transition-all group/btn"
                      >
                        <span className="group-hover/btn:scale-105 inline-block transition-transform">Apply</span>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full h-[2px] bg-white/10 rounded-full mt-4 overflow-hidden max-w-[300px] mx-auto sm:mx-6 lg:mx-2">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-blue-600 shadow-[0_0_15px_#0ea5e9] transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

      </div>
    </div>
  );
}