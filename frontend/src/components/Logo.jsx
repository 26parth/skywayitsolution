import React from 'react';
import { gsap } from "gsap"; // For the animation logic
import { useEffect } from 'react';

// 🎨 Colour Palette (Aapke project ke COLORS se liya gaya)
const PRIMARY_BLUE = "#0072FF"; // Sky Blue
const BACKGROUND_COLOR = "#0B1A33";

const Logo = () => {
    // GSAP animation logic
    useEffect(() => {
        // Logo animation (jo Home.jsx mein thi, ab yahan apply hogi)
        gsap.to(".skyway-logo-html", {
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            rotationX: 3,
            rotationY: 5,
            scale: 1.02,
            y: -10,
        });
    }, []);

    // Logo ka HTML structure
    return (
        <div className="skyway-logo-html">
            {/* Main Logo Element: Ek aisi shape jo S aur W ko represent kare */}
            <div className="logo-base">
                {/* Do overlapping elements for the abstract shape */}
                <div className="line-1"></div>
                <div className="line-2"></div>
            </div>
            
            {/* Optional: Initials agar aap add karna chahte hain */}
            <div className="logo-initials">SW</div>
        </div>
    );
};

export default Logo;