import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  setLogLevel,
} from 'firebase/firestore';
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import logo from "../assets/skyway-logo3.png";

// Note: `logo` import will likely fail in this environment, so we rely on the LOGO_URL fallback.
// const logo = "../assets/skyway-logo3.png";

// Use global variables for Firebase configuration if present
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {};
const initialAuthToken =
  typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Placeholder for the "Skyway" logo (High-contrast for the dark theme)
const LOGO_URL =
  "https://placehold.co/300x300/4ECDC4/050D1C?text=SKYWAY+IT";

const COLORS = {
  background: "#050D1C",
  accent: "#4ECDC4", // Teal/Cyan
  primaryText: "#FFFFFF",
  secondaryText: "#B0D0E0",
  neonBlue: "#52c0ff",
};

// Firestore logging level
setLogLevel('error');

const App = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Parallax setup
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 70, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 70, damping: 18 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    if (window.innerWidth < 901) return;
    const rect = ref.current.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const mouseX = e.clientX - rect.left - w / 2;
    const mouseY = e.clientY - rect.top - h / 2;
    x.set(mouseX / w);
    y.set(mouseY / h);
  };

  // Firebase Initialization and Authentication
  useEffect(() => {
    try {
      if (Object.keys(firebaseConfig).length === 0) {
        console.warn(
          "Firebase configuration missing. Running in non-authenticated mode."
        );
        setIsLoading(false);
        setIsAuthReady(true);
        return;
      }

      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authService = getAuth(app);

      setDb(firestore);
      setAuth(authService);

      const unsubscribe = onAuthStateChanged(authService, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
        setIsAuthReady(true);
      });

      const handleSignIn = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authService, initialAuthToken);
          } else {
            await signInAnonymously(authService);
          }
        } catch (e) {
          console.error("Firebase Sign-In Error:", e);
          setError("Authentication failed. Please check the console for details.");
        } finally {
          setIsLoading(false);
        }
      };

      handleSignIn();
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase Initialization Error:", e);
      setError("Failed to initialize Firebase. " + e.message);
      setIsLoading(false);
      setIsAuthReady(true);
    }
  }, []);

  // Use the logo placeholder
  const logoSrc = LOGO_URL;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
        body { 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden; 
        }

        :root {
          --bg: ${COLORS.background};
          --text-primary: ${COLORS.primaryText};
          --text-secondary: ${COLORS.secondaryText};
          --accent-color: ${COLORS.accent};
          --neon-blue: ${COLORS.neonBlue};
        }
        .home-root {
          min-height: 100vh;
          width: 100vw; 
          display: flex;
          align-items: center; 
          justify-content: center;
          padding: 0 1rem;
          box-sizing: border-box;
          background: var(--bg);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
        }
        .container { 
          max-width: 1280px; 
          margin: auto; 
          width: 100%; 
          z-index: 5; 
          padding: 0;
        }
        .hero { 
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 7rem 0; 
          gap: 2.2rem;
          width: 100%;
        }
        @media (max-width: 900px) {
          .home-root { align-items: center; padding: 0 1rem; }
          .hero { 
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 0; 
            gap: 1.5rem; 
          }
        }

        .mobile-logo-section { display: none; }
        @media (max-width: 900px) {
          .mobile-logo-section { display: flex; flex-direction: column; align-items: center; width: 100%; padding: 0; margin-bottom: 0.5rem; }
          .mobile-logo-wrap { position: relative; width: 100%; max-width: 230px; min-width: 90px; height: auto; margin: 1.3rem auto; display: flex; align-items: center; justify-content: center; }
          .logo-backdrop-mobile {
            position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            width: 78vw; max-width: 230px; min-width: 110px; height: 39vw; max-height: 230px; min-height: 110px;
            background: radial-gradient(circle,rgba(82,192,255,0.2) 0%,rgba(5,13,28,0.9) 70%);
            filter: blur(16px); opacity: 0.89; z-index: 1; border-radius: 50%;
          }
          .hero-logo-img-mobile {
            position: relative; display: block; margin: auto; z-index: 2; background: transparent; border-radius: 50%;
            width: 38vw; min-width: 72px; max-width: 110px; height: 38vw; min-height: 72px; max-height: 110px; object-fit: contain;
            /* Enhanced Neon Glow for Mobile */
            box-shadow: 
              0 0 10px 3px rgba(255, 255, 255, 0.4), /* White sparkle */
              0 0 18px 5px var(--neon-blue), /* Stronger Blue glow */
              0 0 12px 2px var(--accent-color); /* Cyan glow */
            filter: brightness(1.2) contrast(1.15) drop-shadow(0 0 7px var(--neon-blue));
            transition: filter 0.3s, box-shadow 0.3s;
          }
        }

        .hero-left { max-width: 700px; text-align: left; flex: 1; min-width: 320px; padding-left: 1rem; }
        @media (max-width: 900px) {
          .hero-left { text-align: center; width: 100%; padding-left: 0; padding: 0 1.5rem; box-sizing: border-box; }
        }
        .subheading { text-transform: uppercase; letter-spacing: 5px; font-size: 0.92rem; margin-bottom: 0.6rem; color: var(--text-secondary);}
        .title { font-size: 4rem; font-weight: 900; line-height: 1.11; margin-bottom: 1.7rem; }
        @media (max-width: 900px) { .title { font-size: 2.3rem; margin-bottom: 1rem; } }
        .gradient-text { 
          background: linear-gradient(to right, var(--neon-blue), var(--accent-color)); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          filter: drop-shadow(0 0 7px var(--neon-blue));
        }
        .subtitle { font-size: 1.18rem; color: var(--text-secondary); margin-bottom: 2.2rem; line-height: 1.55; max-width: 560px; }
        @media (max-width:900px) { .subtitle { margin-bottom: 2rem; font-size: 1.05rem; } }
        .cta-row { display: flex; flex-direction: row; gap: 1.3rem; margin-top: 2rem; align-items: center; justify-content: flex-start; }
        @media (max-width:900px) { .cta-row { justify-content: center; margin-top: 1.5rem; } }
        .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 100px; font-weight: 700; font-size: 1.07rem; padding: 1rem 2.1rem; transition: all 0.3s ease-in-out; min-height: 48px; white-space: nowrap; }
        @media (max-width: 480px) { .cta-row { flex-direction: column; gap: 0.8rem; } .btn { width: 100%; max-width: 280px; font-size: 1rem; padding: 0.9rem 1.5rem; } }
        
        /* Modified Primary Button Style (Transparent with Border, Fills on Hover) */
        .btn.primary { 
          background: transparent; 
          color: var(--accent-color); /* Border color/Text color */
          border: 2px solid var(--accent-color); 
          box-shadow: 0 0 12px 0 rgba(78, 205, 196, 0.4); /* Soft initial glow */
        }
        .btn.primary:hover { 
          background: var(--accent-color); /* Button fill on hover */
          color: var(--bg); /* Dark text on hover */
          border-color: var(--accent-color);
        }

        .hero-right {
          position: relative; width: 340px; height: 340px; min-width: 200px;
          display: flex; align-items: center; justify-content: center; perspective: 1100px;
        }
        @media (max-width: 900px) { .hero-right { display: none !important; } }
        .logo-backdrop {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 120%; height: 120%; z-index: 1;
          background: radial-gradient(circle,rgba(82,192,255,0.3) 0%,rgba(5,13,28,.95) 85%);
          filter: blur(18px); opacity: 0.55; border-radius: 50%;
        }
        .logo-image-wrapper {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
          width: 75%; height: 75%; z-index: 2;
          display: flex; align-items: center; justify-content: center; background: transparent;
        }
        .hero-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          background: transparent;
          /* Enhanced Neon Glow for Desktop */
          box-shadow: 
            0 0 12px 4px rgba(255, 255, 255, 0.4), /* White sparkle */
            0 0 35px 10px var(--neon-blue), /* Strong Blue glow */
            0 0 20px 5px var(--accent-color); /* Cyan glow */
          filter: brightness(1.2) 
            contrast(1.15) 
            drop-shadow(0 0 8px var(--neon-blue));
          transition: transform 0.22s cubic-bezier(.44,2.1,.29,1), box-shadow 0.22s, filter 0.22s;
        }
        .hero-logo-img:hover {
          transform: scale(1.05) rotateY(2deg) rotateX(-1.5deg); 
          box-shadow: 
            0 0 20px 5px rgba(255, 255, 255, 0.5),
            0 0 50px 15px var(--neon-blue), 
            0 0 30px 8px var(--accent-color);
          filter: brightness(1.25) contrast(1.2); 
        }
        `}
      </style>

      <div className="home-root">
        <header className="hero container">
          {/* MOBILE LOGO HERO BLOCK */}
          <div className="mobile-logo-section">
            <div className="mobile-logo-wrap">
              <div className="logo-backdrop-mobile"></div>
              <img
                src={logo}
                alt="Skyway IT Solution Logo"
                className="hero-logo-img-mobile"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/108x108/CCCCCC/333333?text=Logo";
                }}
              />
            </div>
          </div>
          <div className="hero-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="subheading"
            >
              SCALABLE. SECURE. INNOVATIVE.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="title"
            >
              SKYWAY <span className="gradient-text">IT</span> SOLUTION
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="subtitle"
            >
              Elevating enterprises through robust, scalable, and secure IT infrastructures.<br />
              Let's architect the future of your business.
            </motion.p>
            <motion.div
              className="cta-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.71 }}
            >
              <motion.a
                className="btn primary"
                href="#services"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Our Services →
              </motion.a>
              {/* Secondary button has been removed */}
            </motion.div>
          </div>
          {/* DESKTOP LOGO */}
          <motion.div
            className="hero-right"
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              x.set(0);
              y.set(0);
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 55,
              duration: 1.0,
              delay: 0.28,
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="logo-backdrop"></div>
            <motion.div className="logo-image-wrapper">
              <motion.img
                src={logo}
                alt="Skyway IT Solution Logo"
                className="hero-logo-img"
                transition={{ type: "spring", stiffness: 260, damping: 12 }}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/300x300/CCCCCC/333333?text=Logo";
                }}
              />
            </motion.div>
          </motion.div>
        </header>
      </div>
    </div>
  );
};

export default App;