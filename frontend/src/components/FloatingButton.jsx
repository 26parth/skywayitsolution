import React, { useState } from 'react';

const FloatingButton = ({ onClick }) => {
  const ACCENT_COLOR = '#0ea5e9'; // Sky Blue Accent
  const DARK_COLOR = '#0c1d33'; // Deep Blue
  const FONT_FAMILY = 'Roboto, "Segoe UI", Arial, sans-serif'; // Professional Font

  const buttonStyle = {
    // Positioning
    position: 'fixed',
    bottom: '20px',
    right: '20px',
      zIndex: 2147483647, // ज्यादा priority
    willChange: 'transform, opacity',
    inset: 'auto 20px 20px auto', // iOS support
pointerEvents: 'auto',
    width: '64px',
    height: '64px',
    isolation: 'isolate',
contain: 'layout paint style',
    borderRadius: '50%',
     transform: 'translateZ(0)', // scroll bug fix
  WebkitTransform: 'translateZ(0)', // iPhone/Safari fix
  WebkitOverflowScrolling: 'touch', //
    
    // Professional Design
    background: `linear-gradient(145deg, ${ACCENT_COLOR}, #0c8be0)`, // Subtle gradient for depth
    color: DARK_COLOR, 
    boxShadow: `0 6px 15px rgba(14, 165, 233, 0.5), 0 0 8px rgba(14, 165, 233, 0.3)`, 
    
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
    // 🎲 ICON CHANGE
    fontSize: '32px', // Larger dice icon
    fontWeight: 'bold',
    border: 'none',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    fontFamily: FONT_FAMILY,
  };

  const hoverStyle = {
    background: `linear-gradient(145deg, #38bdf8, ${ACCENT_COLOR})`, 
    transform: 'scale(1.08)',
    boxShadow: `0 10px 25px rgba(14, 165, 233, 0.8), 0 0 15px rgba(14, 165, 233, 0.6)`, 
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{ ...buttonStyle, ...(isHovered ? hoverStyle : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Start Team Duty Selection Game"
    >
      🎲 {/* Game Icon (Dice) */}
    </button>
  );
};

export default FloatingButton;