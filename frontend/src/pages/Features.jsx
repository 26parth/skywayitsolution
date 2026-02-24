import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AboutUsSection from "./AboutUsSection";
import {
  ShieldCheckIcon,
  UsersIcon,
  CommandLineIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

// FEATURES DATA (No change)
const ModernFeaturesData = [
  {
    icon: ShieldCheckIcon,
    title: "Government Approved Company",
    text: "Officially recognized and government-approved IT company.",
  },
  {
    icon: UsersIcon,
    title: "500+ Students Trained",
    text: "Successfully trained over 500 students with industry-focused, career-ready technical skills.",
  },
  {
    icon: CommandLineIcon,
    title: "Real Live Projects",
    text: "Gain real industry experience by working on actual client projects under expert guidance.",
  },
  {
    icon: CogIcon,
    title: "100% Practical Training",
    text: "Hands-on training with real-world implementation — not boring theory.",
  },
];

const Features = () => {
  return (
    <div
      id="features"
      className=" text-gray-100 text-center relative overflow-hidden overflow-x-hidden"
      style={{
        background: "#050D1C"
      }}
      bg-gray-900
    >

      {/* BACKGROUND GRID (No change) */}
      <div
        className="absolute inset-0 z-0 opacity-10"
      // style={{
      //   backgroundImage:
      //     "linear-gradient(#2f3e5c 1px, transparent 1px), linear-gradient(to right, #2f3e5c 1px, transparent 1px)",
      //   backgroundSize: "40px 40px",
      // }}
      ></div>

      <div className="container mx-auto px-4 relative z-10 ">
        {/* TITLE (No change) */}
        <motion.h2 className="text-center text-4xl sm:text-5xl font-extrabold mt-10">
          <div className="name inline-flex justify-center gap-2">
            <div className="cosmic" data-text="F"><span>F</span></div>
            <div className="cosmic" data-text="E"><span>E</span></div>
            <div className="cosmic" data-text="A"><span>A</span></div>
            <div className="cosmic" data-text="T"><span>T</span></div>
            <div className="cosmic" data-text="U"><span>U</span></div>
            <div className="cosmic" data-text="R"><span>R</span></div>
            <div className="cosmic" data-text="E"><span>E</span></div>
            <div className="cosmic" data-text="S"><span>S</span></div>
          </div>
        </motion.h2>




        {/* GRID */}
        <div
          className=" mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
             gap-12 overflow-hidden px-6 sm:px-4 "
          style={{ perspective: 1200 }}
        >

          {ModernFeaturesData.map((d, i) => {
            const Icon = d.icon;
            const ref = useRef(null);

            const { scrollYProgress } = useScroll({
              target: ref,
              // ⭐ MODIFIED: एनिमेशन को जल्दी पूरा करने के लिए
              offset: ["0.2 1", "0.6 0.5"], // <--- यहाँ 0.6 को 0.4 और 0.8 को 0.7 किया गया है
            });

            // IMPROVED: Smooth, Rubber/Elastic Effect with Stagger (No change)
            const rotateY = useTransform(scrollYProgress, [0, 1], [-90, 0]);

            const opacity = useTransform(scrollYProgress, [0.1, 1], [0, 1]);

            // Y-axis ट्रांसलेशन: 200px + index-based delay से 0 पर आता है (No change)
            const yStart = 200 + i * 50;
            const y = useTransform(scrollYProgress, [0, 1], [yStart, 0]);

            return (
              <motion.div
                ref={ref}
                key={i}
                style={{
                  rotateY,
                  opacity,
                  y,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
                // ⭐ MODIFIED: Spring transition को तेज और स्नैपी बनाने के लिए
                transition={{
                  type: "spring",
                  stiffness: 200, // 80 से 120 किया
                  damping: 30,    // 12 से 15 किया
                  mass: 0.5,
                }}
                className=" bg-white/15
                       bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 
p-6 lg:p-5 xl:p-6                     /* ↓ Padding balanced */
hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/20 
transition-all duration-500 ease-in-out 
flex flex-col items-center text-center 
min-h-[300px] lg:min-h-[330px] xl:min-h-[300px]  /* ↓ CARD HEIGHT FIXED */  
"    
 ////max-w-[450px] min-w-[300px]
              // style={{
              //   background: `
              //     radial-gradient(circle at 10% 70%, rgba(46,229,157,0.25), transparent 50%),
              //     radial-gradient(circle at 90% 20%, rgba(14,165,233,0.25), transparent 50%),
              //     radial-gradient(circle at 50% 35%, rgba(0,172,240,0.15), transparent 60%),
              //     linear-gradient(140deg, #07111B, #0B1A33 55%, #101A2C)
              //   `
              // }}
              >

                {/* ICON 3D preserved exactly same (No change) */}
                <motion.div
                  whileHover={{
                    rotateX: 10,
                    rotateY: -10,
                    translateZ: 120,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  className="relative w-23 h-23 mx-auto mb-7"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-black/60 blur-2xl"></div>
                  <div
                    className="absolute inset-0 rounded-3xl bg-[#0d1b3a] border border-white/10"
                    style={{
                      transform: "translateZ(35px)",
                      boxShadow: "0px 18px 30px rgba(0,0,0,0.7)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center"
                    style={{
                      transform: "translateZ(60px)",
                      boxShadow:
                        "0px 0px 30px rgba(56,189,248,0.5), 0px 10px 20px rgba(0,0,0,0.4)", // ⭐ MODIFIED: Shadow ko kam kiya
                    }}
                  >
                    <Icon
                      className="h-14 w-14 text-white"
                      style={{ transform: "translateZ(65px)" }}
                    />
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: "translateZ(120px)" }}
                  >
                    <Icon className="h-10 w-10 text-sky-300 opacity-90" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-semibold mb-3 text-sky-400">{d.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{d.text}</p>
              </motion.div>
            );
          })}
        </div>


        <AboutUsSection />
      </div>
    </div>
  );
};

export default Features;