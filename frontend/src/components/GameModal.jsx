import React, { useState } from 'react';

// Define the Key Colors
const ACCENT_COLOR = '#88c9ff'; // Lighter Sky Blue for Glass/Border
const LIGHT_BLUE_BACKGROUND = '#ffffff1a'; // Very Light Transparent White/Blue for Glass Effect
const DARK_TEXT = '#FFFFFF'; // White text
const CARD_BACKGROUND = '#1F293780'; // Slightly opaque dark background for better contrast
const SUCCESS_COLOR = '#34D399'; // Green for success
const FONT_FAMILY = 'Roboto, "Segoe UI", Arial, sans-serif'; // Professional Font

const GameModal = ({ isOpen, onClose }) => {
  const [currentMemberName, setCurrentMemberName] = useState('');
  const [members, setMembers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // For hover simulation 
  const [addHover, setAddHover] = useState(false);
  const [selectHover, setSelectHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  if (!isOpen) return null;

  // --- Styles ---
  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const contentStyles = {
    // 🎨 LIGHT GLASS-MORPHISM EFFECT
    backgroundColor: LIGHT_BLUE_BACKGROUND, 
    backdropFilter: 'blur(10px)', 
    padding: '25px', 
    borderRadius: '16px',
    width: '95%',
    maxWidth: '500px',
    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`, 
    position: 'relative',
    border: `1px solid ${ACCENT_COLOR}99`, 
    color: DARK_TEXT,
    fontFamily: FONT_FAMILY,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  };
  
  // 🎯 UPDATED STYLE: Fixed Height and Scrolling for Tag Container
  const tagContainerStyle = { 
    minHeight: '40px',
    maxHeight: '120px', // Adjust this value to set the desired height (e.g., 3-4 lines of tags)
    overflowY: 'auto', // Enable scrolling when content exceeds max-height
    border: `1px solid ${ACCENT_COLOR}55`, 
    backgroundColor: CARD_BACKGROUND, 
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '15px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  };

  const tagStyle = {
    backgroundColor: `${ACCENT_COLOR}20`, 
    color: ACCENT_COLOR, 
    padding: '6px 12px',
    borderRadius: '20px', 
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    border: `1px solid ${ACCENT_COLOR}50`,
  };

  const removeIconStyle = {
    marginLeft: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: DARK_TEXT,
    fontSize: '16px',
    lineHeight: '1',
    opacity: 0.7,
  };

  const inputStyle = { 
    flexGrow: 1,
    padding: '12px',
    border: `2px solid ${ACCENT_COLOR}70`,
    backgroundColor: '#050b13', 
    color: DARK_TEXT,
    borderRadius: '8px',
    fontSize: '16px',
    marginRight: '10px',
    outline: 'none',
    fontFamily: FONT_FAMILY,
  };

  const buttonBaseStyle = {
    padding: '12px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    border: 'none',
    fontFamily: FONT_FAMILY,
    boxShadow: 'none',
  };

  // ⚡ TRANSPARENT BUTTON STYLES
  const submitButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: selectHover ? `${ACCENT_COLOR}30` : 'transparent', 
    border: `1px solid ${selectHover ? ACCENT_COLOR : ACCENT_COLOR}`,
    color: DARK_TEXT, 
  };
  
  const closeButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: closeHover ? `${CARD_BACKGROUND}80` : 'transparent',
    border: `1px solid ${closeHover ? DARK_TEXT : '#ffffff30'}`,
    color: DARK_TEXT,
  };
  
  const addButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: addHover ? `${SUCCESS_COLOR}30` : 'transparent',
    border: `1px solid ${addHover ? SUCCESS_COLOR : SUCCESS_COLOR}`,
    color: SUCCESS_COLOR, 
    fontWeight: '700',
  };

  const resultBoxStyle = {
    marginTop: '30px',
    padding: '25px',
    border: `2px dashed ${SUCCESS_COLOR}`,
    borderRadius: '12px',
    backgroundColor: CARD_BACKGROUND, 
    textAlign: 'center',
  };

  const winnerTextStyle = {
    color: SUCCESS_COLOR, 
    fontSize: '34px',
    fontWeight: '900',
    textShadow: '0 0 10px rgba(52, 211, 153, 0.5)',
  };
  
  // ☕🍩 PROFESSIONAL TREAT LOADER KEYFRAMES (Reverted to simple class-based style for this demo)
  const spinningKeyframes = `
    @keyframes pulse {
        0% { opacity: 0.5; text-shadow: none; }
        50% { opacity: 1; text-shadow: 0 0 8px ${ACCENT_COLOR}, 0 0 15px ${ACCENT_COLOR}50; }
        100% { opacity: 0.5; text-shadow: none; }
    }
    @keyframes roll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
    }
    .treat-scroll {
        white-space: nowrap;
        animation: roll 3s linear infinite;
        font-size: 30px;
        line-height: 1;
        display: flex;
        align-items: center;
    }
    .treat-scroll > span {
        margin-right: 15px;
    }
    
    /* Ensure treat-anim works properly if used, although we use treat-scroll now */
    @keyframes treatRoll {
        0% { content: "☕"; }
        33% { content: "🍩"; }
        66% { content: "🍪"; }
        100% { content: "☕"; }
    }
    .treat-anim::before {
        content: "☕";
        display: inline-block;
        animation: treatRoll 0.8s infinite step-end;
        font-size: 40px;
    }
  `;
  // --- End Styles ---

  // --- Logic (Working functions) ---
  const handleAddMember = () => {
    const name = currentMemberName.trim();
    if (name && !members.includes(name)) {
      setMembers([...members, name]);
      setCurrentMemberName('');
    }
  };

  const handleRemoveMember = (nameToRemove) => {
    setMembers(members.filter(name => name !== nameToRemove));
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        handleAddMember();
    }
  };

  const handleRandomSelect = () => {
    if (members.length < 2) {
      alert('Please add at least two members to run the selector.');
      return;
    }

    setWinner(null);
    setIsSpinning(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * members.length);
      const selectedWinner = members[randomIndex];
      setWinner(selectedWinner);
      setIsSpinning(false);
    }, 3000); 
  };

  const handleClose = () => {
    setCurrentMemberName('');
    setMembers([]);
    setWinner(null);
    setIsSpinning(false);
    onClose();
  };
  // --- End Logic ---


  return (
    <div style={modalStyles} onClick={handleClose}>
      <style>{spinningKeyframes}</style> 
      
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: ACCENT_COLOR, textAlign: 'center', fontSize: '24px', marginBottom: '25px', fontWeight: '700', textShadow: `0 0 10px ${ACCENT_COLOR}50` }}>
          🎲 Team Treat Duty Selector
        </h3>
        
        <p style={{marginBottom: '10px', opacity: 0.8, fontSize: '15px'}}>Enter team member names:</p>

        {/* Input and Add Button */}
        <div style={{ display: 'flex', marginBottom: '20px' }}>
            <input
                type="text"
                style={inputStyle}
                placeholder="Enter member's full name..."
                value={currentMemberName}
                onChange={(e) => setCurrentMemberName(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button 
                style={addButtonStyle} 
                onClick={handleAddMember}
                disabled={!currentMemberName.trim()}
                onMouseEnter={() => setAddHover(true)}
                onMouseLeave={() => setAddHover(false)}
            >
                Add
            </button>
        </div>
        
        {/* Display Added Members (Tags/Chips) */}
        {/* 🎯 यह कंटेनर अब एक निश्चित ऊंचाई (Max Height) का है, जिससे लेआउट स्थिर रहेगा। */}
        <div style={tagContainerStyle}>
            {members.length === 0 ? (
                // Note: Added height to the empty state to help maintain the container size when empty
                <p style={{ color: DARK_TEXT, margin: '0', opacity: 0.6, fontSize: '14px', lineHeight: '20px' }}>No members added. Start adding names for the draw.</p>
            ) : (
                members.map((name) => (
                    <div key={name} style={tagStyle}>
                        {name}
                        <span 
                            style={removeIconStyle} 
                            onClick={() => handleRemoveMember(name)}
                            title={`Remove ${name}`}
                        >
                            &times;
                        </span>
                    </div>
                ))
            )}
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: `1px solid ${ACCENT_COLOR}20`, marginTop: '20px' }}>
          <button 
            style={{...submitButtonStyle, marginRight: '10px'}} 
            onClick={handleRandomSelect} 
            disabled={isSpinning || members.length < 2} 
            onMouseEnter={() => setSelectHover(true)}
            onMouseLeave={() => setSelectHover(false)}
          >
            {isSpinning ? '🎯 Selecting...' : '🎯 Select Duty Holder'}
          </button>
          <button 
            style={closeButtonStyle} 
            onClick={handleClose}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
          >
            Close
          </button>
        </div>

        {/* --- Result Display --- */}
        {winner && (
          <div style={resultBoxStyle}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: SUCCESS_COLOR, marginBottom: '10px'}}>
                <span style={{fontSize: '30px', marginRight: '10px'}}>🎉</span>
                <h4 style={{fontSize: '20px', fontWeight: '700'}}>CONGRATULATIONS!</h4>
                <span style={{fontSize: '30px', marginLeft: '10px'}}>🎉</span>
            </div>
            
            <h1 style={winnerTextStyle}>{winner}</h1>
            <p style={{ fontWeight: 'bold', color: DARK_TEXT, fontSize: '16px', marginTop: '10px' }}>
                You've been randomly selected for the team treat duty! ☕🍩
            </p>
          </div>
        )}
        
        {/* --- Spinning Animation Display (Professional Treat Loader) --- */}
        {isSpinning && !winner && (
            <div style={resultBoxStyle}>
                <div style={{overflow: 'hidden', height: '30px', marginBottom: '15px'}}>
                    <div className="treat-scroll">
                        <span>☕</span>
                        <span>🍩</span>
                        <span>🍪</span>
                        <span>☕</span>
                        <span>🍩</span>
                        <span>🍪</span>
                        <span>☕</span>
                        <span>🍩</span>
                        <span>🍪</span>
                    </div>
                </div>
                
                <p style={{
                    color: ACCENT_COLOR, 
                    fontSize: '18px', 
                    fontWeight: '700',
                    animation: 'pulse 1.5s infinite', // Neon-style pulsing text
                    margin: '0',
                    lineHeight: '1',
                }}>
                    LOADING TREAT DUTY...
                </p>
                <p style={{color: DARK_TEXT, fontSize: '14px', opacity: 0.8, marginTop: '5px'}}>Running random selection algorithm.</p>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default GameModal;