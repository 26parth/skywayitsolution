import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // 🔥 Redux se hamesha latest user data milta hai
  const { user } = useSelector((state) => state.auth);

  const handleScroll = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
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
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* --- Hamburger Button --- */}
      <button
        onClick={() => setOpen(true)}
        className="w-12 h-12 flex items-center justify-center fixed top-5 right-5 z-50 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-full bg-slate-900 border-r border-white/10 shadow-2xl z-50 flex flex-col items-center justify-center"
              variants={sidebarVariants}
              initial="hidden" animate="visible" exit="exit"
            >

              {/* --- LOGIN/PROFILE SECTION --- */}
              <div className="absolute top-5 left-5">
                {!user ? (
                  <button
                    onClick={() => { navigate("/login"); setOpen(false); }}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-all uppercase tracking-wider text-sm border border-blue-400/30"
                  >
                    Login
                  </button>
                ) : (
                  <div
                    onClick={() => { navigate("/profile"); setOpen(false); }}
                    className="flex items-center space-x-3 bg-white/10 p-1 pr-4 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-all shadow-lg"
                  >
                    {/* 🔥 DYNAMIC PROFILE PHOTO OR INITIAL LOGIC */}

                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white border border-white/20">
                      {user?.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          key={user.profilePic} // 🔥 Force re-render on change
                        />
                      ) : (
                        <span className="font-black text-lg uppercase">
                          {user?.fullname ? user.fullname[0] : "U"}
                        </span>
                      )}
                    </div>
                    <span className="text-white font-extrabold uppercase tracking-tighter text-xs">
                      {user.fullname ? user.fullname.split(" ")[0] : "Profile"}
                    </span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition"
                onClick={() => setOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Links */}
              <motion.div
                className="flex flex-col items-center justify-center space-y-6"
                variants={listContainerVariants}
                initial="hidden" animate="visible" exit="hidden"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    variants={menuItemVariants}
                    whileHover={{ rotateX: 5, rotateY: -5, y: -5, transition: { duration: 0.3 } }}
                  >
                    <button
                      onClick={() => handleScroll(link.to)}
                      className="text-3xl font-extrabold uppercase tracking-widest text-white hover:text-blue-400 transition"
                    >
                      {link.label}
                    </button>
                  </motion.div>
                ))}

                
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}