import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // location use karenge path check karne ke liye
import { logout } from "../redux/authSlice";

const navLinks = [
  { label: "Home", to: "home" },
  { label: "Features", to: "features" },
  { label: "Courses", to: "courses" },
  { label: "Members", to: "teamMembers" },
  { label: "Project", to: "project" },
  { label: "Services", to: "ourServices" },
  { label: "Feedback", to: "feedback" },
  { label: "Contact", to: "footer" },
];

// ... (Variants same rahenge, no change)
const listContainerVariants = {
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -50, rotate: -5, scale: 0.8 },
  visible: {
    opacity: 1, x: 0, rotate: 0, scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 15 },
  },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Current path pata karne ke liye

  const { user } = useSelector((state) => state.auth);

  // --- Fixed Scroll Logic ---
  const handleScroll = (id) => {
    setOpen(false); // Menu close karo

    if (location.pathname !== "/") {
      // Agar user login/profile page par hai
      navigate("/"); // Pehle home par bhejo
      // Thoda delay taaki page load ho jaye, phir scroll kare
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // Agar user pehle se home par hai
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { x: "-100%", transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* --- TOP LEFT: LOGIN/PROFILE BUTTON (No UI Change) --- */}
      <div className="fixed top-5 left-5 z-[60]">
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-all uppercase tracking-wider text-sm border border-blue-400/30"
          >
            Login
          </button>
        ) : (
          <div 
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-1 pr-4 rounded-full border border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 border border-white/40 flex items-center justify-center text-white font-black text-lg shadow-inner">
              {user.fullname ? user.fullname[0].toUpperCase() : "U"}
            </div>
            <span className="text-white font-extrabold uppercase tracking-tighter text-xs">Profile</span>
          </div>
        )}
      </div>

      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-12 h-12 flex items-center justify-center fixed top-5 right-5 z-50 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-40"
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-full bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 flex flex-col items-center justify-center space-y-6"
              variants={sidebarVariants}
              initial="hidden" animate="visible" exit="exit"
            >
              <button
                className="fixed top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-md hover:bg-white/20 transition z-[300]"
                onClick={() => setOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <motion.div
                className="flex flex-col items-center justify-center space-y-6"
                variants={listContainerVariants}
                initial="hidden" animate="visible" exit="hidden"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    variants={menuItemVariants}
                    whileHover={{ rotateX: 5, rotateY: -5, y: -5, transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 10 } }}
                  >
                    {/* Changed <a> to <button> for better control, style remains same */}
                    <button
                      onClick={() => handleScroll(link.to)}
                      className="text-3xl font-extrabold uppercase tracking-widest text-white transition hover:text-blue-400 hover:text-shadow-[0_0_15px_rgba(60,180,255,0.8)]"
                      style={{ transformStyle: "preserve-3d", perspective: "1000px", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {link.label}
                    </button>
                  </motion.div>
                ))}

                {user && (
                  <motion.button
                    variants={menuItemVariants}
                    onClick={() => {
                      dispatch(logout());
                      setOpen(false);
                      navigate("/");
                    }}
                    className="mt-4 px-6 py-2 border border-red-500/50 text-red-500 font-bold uppercase tracking-widest text-xs rounded hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}