import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// Animation Config
const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 0.5,
};

const viewPortProps = {
  once: true,
  amount: 0.2,
};


const AboutUsSection = () => {
  return (
    // ⭐ FULL SECTION GAP FIX → px-6 sm:px-8 lg:px-12
    <div className="mt-15 md:pt-1 pb-8 relative z-10 px-6 sm:px-8 lg:px-12">

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* LEFT IMAGE BLOCK */}
          <motion.div
            initial={{ opacity: 0, x: -150, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={viewPortProps}
            transition={{ ...springTransition, delay: 0.1, duration: 1.0 }}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden 
                       shadow-2xl shadow-sky-900/50 transform hover:scale-[1.02] 
                       transition-transform duration-500 ease-out"
          >
            <div className="absolute inset-0 bg-gray-900/70 border-4 border-sky-600/50 
                            flex items-center justify-center text-center p-8">
              <span className="text-gray-400 text-lg italic font-light">
                [Company Office Image Placeholder]
                <br />
                Your core team working on next-gen solutions.
              </span>
            </div>
          </motion.div>

          {/* RIGHT TEXT BLOCK */}
          <div className="text-left">

            <motion.h3
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewPortProps}
              transition={{ ...springTransition, delay: 0.3 }}
              className="text-sm font-semibold uppercase text-sky-400 mb-2 tracking-widest"
            >
              Why Choose Us?
            </motion.h3>

            <motion.h2
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewPortProps}
              transition={{ ...springTransition, delay: 0.4 }}
              className="text-5xl font-extrabold text-white tracking-tight mb-4"
            >
              Excellence in Practical Training
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewPortProps}
              transition={{ ...springTransition, delay: 0.5 }}
              className="text-gray-300 mb-8 leading-relaxed text-lg border-l-4 border-sky-500 pl-4"
            >
              <span className="text-sky-400 font-medium">
                We are an officially recognized IT company
              </span>{" "}
              delivering high-quality, practical internships and bootcamps.
              Our mission is to prepare students for real industry challenges through
              hands-on training and live project experience.
            </motion.p>

            {/* CHECKLIST ITEMS */}
           
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUsSection;
