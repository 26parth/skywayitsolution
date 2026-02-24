import React from "react";
import { motion } from "framer-motion";

const FeedbackSection = () => {
  const spring = {
    type: "spring",
    stiffness: 120,
    damping: 12,
  };

  const testimonials = [
    {
      id: 1,
      name: "Akash Sharma",
      role: "Full-Stack Developer",
      quote:
        "This training helped me build real-world projects and boosted my confidence to crack interviews.",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Priya Verma",
      role: "Data Scientist",
      quote:
        "Real client tasks and expert mentorship made this the best learning experience of my career.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Rohit Kumar",
      role: "UI/UX Designer",
      quote:
        "I never imagined I would learn so much so quickly. Excellent teaching and hands-on practice!",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  return (
    <div className="pt-1 pb-10 px-6 bg-gray-900" 
style={{
        background: "#050D1C" //050D1C
      }}

>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-1"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            <div className="name inline-flex justify-center gap-2">
              <div className="cosmic" data-text="F"><span>F</span></div>
              <div className="cosmic" data-text="E"><span>E</span></div>
              <div className="cosmic" data-text="E"><span>E</span></div>
              <div className="cosmic" data-text="D"><span>D</span></div>
              <div className="cosmic" data-text="B"><span>B</span></div>
              <div className="cosmic" data-text="A"><span>A</span></div>
              <div className="cosmic" data-text="C"><span>C</span></div>
              <div className="cosmic" data-text="K"><span>K</span></div>
            </div>
          </h2>
          
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...spring, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ rotateX: 10, rotateY: -10, scale: 1.03 }}
              className=" p-7 rounded-2xl shadow-xl border border-blue-500/20 
                         hover:shadow-blue-600/30 transform-gpu transition-all  bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-500 ease-out hover:bg-gradient-to-br hover:from-sky-900/40 hover:via-white/5 hover:to-transparent hover:border-sky-500/50 hover:shadow-[0_0_50px_rgba(14,165,233,0.2)] "
                      
            >
              {/* Avatar 3D Pop */}
              <motion.div
                whileHover={{
                  y: -10,
                  scale: 1.1,
                  rotateZ: 3,
                }}
                transition={spring}
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg mb-4"
              >
                <img
                  src={t.avatar}
                  className="w-full h-full object-cover"
                  alt={t.name}
                />
              </motion.div>

              {/* Name + Role */}
              <h3 className="text-white font-semibold text-xl">{t.name}</h3>
              <p className="text-blue-300 text-sm mb-4">{t.role}</p>

              {/* Quote */}
              <p className="text-gray-300 italic relative pl-4">
                <span className="text-blue-400 text-4xl absolute -left-2 -top-4">
                  “
                </span>
                {t.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
