import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// दृश्यता (visibility) ट्रैक करने के लिए हुक
import { useInView } from "react-intersection-observer"; 

// 🚨 फिक्स: अनसुलझे CSS इम्पोर्ट को हटाया गया, क्योंकि Tailwind CSS का उपयोग किया जा रहा है
// import "../styles/heading_team_member.css" 

// Project Data
const projectData = [
    { title: "E-Commerce", smallImage: "https://placehold.co/400x300/1e293b/a8a29e?text=E-Commerce" },
    { title: "FinTech Dashboard", smallImage: "https://placehold.co/400x300/1e293b/a8a29e?text=FinTech" },
    { title: "AI/ML Integration", smallImage: "https://placehold.co/400x300/1e293b/a8a29e?text=AI/ML" },
    { title: "Cyber Security", smallImage: "https://placehold.co/400x300/1e293b/a8a29e?text=Security" },
    { title: "Cloud Migration", smallImage: "https://placehold.co/400x300/1e293b/a8a29e?text=Cloud" }, 
];

// Framer Motion fadeIn Variant
const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// --- Project Card Component (Inner content) ---
// --- Project Card Component (Inner content) ---
const ProjectCardItem = ({ project, isStacked = false }) => {
    return (
        <div
            className={`
                group relative overflow-hidden rounded-3xl 
                transition-all duration-700
                backdrop-blur-xl 
                bg-white/10
                border border-white/20
                shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                ${!isStacked ? "hover:shadow-[0_15px_60px_rgba(14,165,233,0.5)] hover:border-sky-500" : ""}
            `}
//             style={{
//   background: "linear-gradient(135deg, #C0C0C0, #E8E8E8, #B8B8B8)"
// }}

        >

            {/* Image Section */}
            <div className="relative overflow-hidden rounded-t-3xl">
                <motion.img
                    src={project.smallImage}
                    alt={project.title}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            "https://placehold.co/400x300/1e293b/a8a29e?text=Placeholder";
                    }}
                />

                {/* Top gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="px-5 py-4 text-left">
                <h3 className="text-white text-2xl font-extrabold tracking-wide group-hover:text-sky-400 transition">
                    {project.title}
                </h3>

                <p className="text-gray-300 text-sm mt-1">
                    Explore Solution Details →
                </p>
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
        </div>
    );
};


// --- Mobile Swiping Card (Used only when isMobile === true) ---
const MobileSwipingCard = ({ project, index, isTop, onSwipe, totalCards, currentDirection }) => {

    // Stacking logic for non-top cards (Mobile View)
    if (!isTop) {
        // Calculate the visual index in the stack
        const visualIndex = (index - currentDirection.index + totalCards) % totalCards;
        if (visualIndex >= 4 || visualIndex === 0) return null;

        const scale = 1 - (visualIndex - 1) * 0.08;
        const yOffset = (visualIndex - 1) * 30;
        const rotate = (visualIndex - 1) * 3 * ((visualIndex - 1) % 2 === 0 ? -1 : 1);

        return (
            <motion.div
                className="absolute top-0 left-0 w-full h-full p-2 sm:p-4 md:p-0"
                initial={{ opacity: 0, scale: 0.9, y: yOffset + 50 }}
                animate={{
                    opacity: 1,
                    scale,
                    y: yOffset,
                    rotate,
                    transition: {
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                        delay: (visualIndex - 1) * 0.05,
                    }
                }}
                exit={{
                    opacity: 0,
                    transition: { duration: 0.2 }
                }}
                style={{
                    zIndex: totalCards - visualIndex,
                    // border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    originX: 0.5,
                    originY: 0.5
                }}
            >
                {/* isStacked=true ताकि hover scale न हो */}
                <ProjectCardItem project={project} isStacked={true} /> 
            </motion.div>
        );
    }

    // Top Card Variants (Swipe Exit)
    const cardVariants = {
        exit: (direction) => ({
            x: direction === 'right' ? 2000 : -2000,
            rotate: direction === 'right' ? 60 : -60,
            opacity: 0,
            scale: 0.8,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 20,
                mass: 1,
                duration: 0.4,
                ease: "easeOut"
            }
        }),
        initial: {
            x: 0,
            rotate: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 30 }
        }
    };

    return (
        <motion.div
            key={project.title}
            className="absolute top-0 left-0 w-full h-full cursor-grab p-2 sm:p-4 md:p-0 touch-none"
            style={{ zIndex: totalCards }}
            variants={cardVariants}
            initial="initial"
            custom={currentDirection.direction}
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
                const swipeDistance = info.offset.x;
                const swipeVelocity = info.velocity.x;
                const distanceThreshold = 50;
                const velocityThreshold = 100;

                if (Math.abs(swipeDistance) > distanceThreshold || Math.abs(swipeVelocity) > velocityThreshold) {
                    onSwipe(swipeDistance > 0 ? 'right' : 'left');
                }
            }}
            whileDrag={{ scale: 1.05, rotate: currentDirection.direction === 'right' ? 5 : -5, cursor: 'grabbing', filter: 'brightness(1.1)' }}
        >
            <ProjectCardItem project={project} />
            <div className="absolute inset-0 bg-transparent" />
        </motion.div>
    );
};

// --- Desktop Grid/Stack Card (Used only when isMobile === false) ---
const DesktopAnimatedCard = ({ project, index, isScrolledIntoView, totalCards }) => {
    
    // 🛠️ Variants: Stacked (जब inView false है) और Grid (जब inView true है)
    const variants = {
        // Initial state: Hidden, slightly skewed, and stacked in the center
        stacked: { 
            // x/y को 0 रखें
            x: 0, 
            y: 0, 
            opacity: 0.5, 
            scale: 1 - (index * 0.05), // पीछे के कार्ड थोड़े छोटे
            zIndex: totalCards - index,
            // थोड़ा रोटेशन
            rotate: index % 2 === 0 ? index * -1 : index * 1, 
            transition: { type: "spring", stiffness: 100, damping: 20 }
        },
        // Target state: Spread out in the grid
        grid: {
            x: 0, 
            y: 0, 
            opacity: 1,
            scale: 1,
            zIndex: 1,
            rotate: 0,
            // प्रत्येक कार्ड के लिए अनुक्रमिक देरी (sequential delay)
            transition: { 
                type: "spring", 
                stiffness: 40, // 60 से 40 किया गया (movement को और धीमा करने के लिए)
                damping: 20, // 18 से 20 किया गया (movement को smooth रखने के लिए)
                delay: index * 0.6 // 0.4 से 0.6 किया गया (सीक्वेंशियल डिले बढ़ाने के लिए)
            }
        }
    };

    // 🔴 फिक्स: जब stacked state में हों, तो card को absolute position दें ताकि वह horizontal space न ले और center में stack हो
    const layoutClasses = isScrolledIntoView 
        ? "p-4 md:w-1/2 lg:w-1/3" // Grid layout classes (takes up space)
        // Stack layout classes: absolute position it in the center and give it a fixed size
        : "p-4 absolute top-0 w-full max-w-sm left-1/2 transform -translate-x-1/2"; 

    return (
        <motion.div
            key={project.title}
            // 'layout' का उपयोग करें
            layout 
            className={layoutClasses} // Dynamic classes
            
            // animation को isScrolledIntoView पर switch करें
            variants={variants}
            initial="stacked" // शुरुआती अवस्था (स्क्रीन पर आने से पहले)
            animate={isScrolledIntoView ? "grid" : "stacked"} // inView के आधार पर स्विच करें
        >
            <ProjectCardItem project={project} />
        </motion.div>
    );
};


// --- Main Project Component ---
export const Project = () => {
    const totalCards = projectData.length;
    const [swipeState, setSwipeState] = useState({ index: 0, direction: 'right' });
    const [isMobile, setIsMobile] = useState(false); // मोबाइल/डेस्कटॉप को ट्रैक करने के लिए

    // useInView हुक का उपयोग
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.6, // 0.1 से 0.6 किया गया (एनिमेशन तभी शुरू होगा जब 60% दिख रहा हो)
    });

    // isScrolledIntoView तभी true होगा जब हम डेस्कटॉप पर हों और सेक्शन दिख रहा हो
    const isScrolledIntoView = inView && !isMobile;

    // Resize Listener: मोबाइल/डेस्कटॉप को सही ढंग से निर्धारित करने के लिए
    useEffect(() => {
        const checkMobile = () => {
            // Tailwind's 'md' breakpoint is 768px
            setIsMobile(window.innerWidth < 768); 
        };
        
        checkMobile(); // Initial check
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSwipe = (direction) => {
        setSwipeState(prev => ({
            index: (prev.index + 1) % totalCards,
            direction: direction,
        }));
    };

    // mobile/stacking logic के लिए डाटा को reverse करना ज़रूरी है
    const reversedProjectData = [...projectData].reverse();
    const themeColor = "text-sky-400";

    // 🚨 एक नया कंपोनेंट जो heading_team_member.css में इस्तेमाल होने वाले styles को लागू करता है
    const CosmicText = ({ text }) => (
        <div className="flex justify-center mb-4">
            <style jsx="true">{`
                .name {
                    display: flex;
                    gap: 10px; /* Adjust spacing between letters */
                }
                .cosmic {
                    font-size: 3rem; /* Adjust size */
                    font-weight: 900;
                    color: #fff;
                    position: relative;
                    text-shadow: 0 0 10px rgba(14, 165, 233, 0.5); /* Sky blue glow */
                    perspective: 1000px;
                    text-transform: uppercase;
                }
                .cosmic span {
                    display: inline-block;
                    transition: transform 0.5s ease-out;
                }
                /* Pseudo-element for the cosmic effect - Not strictly necessary but adds depth */
                /*
                .cosmic::before {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    color: #0ea5e9;
                    filter: blur(5px);
                    z-index: -1;
                }
                */
            `}</style>
            <div className="name">
                {text.split('').map((char, index) => (
                    <div 
                        key={index}
                        className="cosmic" 
                        data-text={char}
                    >
                        <span>{char}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        // ref को section पर जोड़ें
        <section 
    ref={ref} 
    id="portfolio" 
    className="
        text-center 
        overflow-hidden 
        md:pt-0 md:pb-8 
        pt-1 pb-1
    " 
style={{
        background: "#050D1C"    //050D1C
      }}
>

            <div className="container mx-auto px-4">

                {/* Heading (CosmicText Component का उपयोग करके) */}
                <motion.h2
                    className={`text-5xl font-extrabold ${themeColor} mb-1`}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeIn}
                >
                    <CosmicText text="PROJECTS" />
                </motion.h2>

                {/* <motion.div
                    className="h-1 w-20 mx-auto mb-6 bg-sky-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    transition={{ duration: 0.8 }}
                /> */}

                <motion.p
                    className="text-gray-300 max-w-2xl mx-auto text-lg mb-4"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                >
                    {/* {isMobile 
                        ? 'हमारे नवीनतम प्रोजेक्ट्स को देखने के लिए कार्ड को **खींचें (Drag) या स्वाइप करें**। (मोबाइल व्यू)'
                        : 'जैसे ही आप सेक्शन में स्क्रॉल करेंगे, कार्ड केंद्र से फैलकर ग्रिड में व्यवस्थित हो जाएंगे। (डेस्कटॉप व्यू)'
                    } */}
                </motion.p>

                {/* 🛠️ मुख्य डिस्प्ले कंटेनर: लॉजिक isMobile पर निर्भर करता है */}
                <div className="flex justify-center items-start"> 
                    {isMobile ? (
                        
                        // 🔵 MOBILE VIEW: स्टैक्ड कार्ड डिस्प्ले (Drag/Swipe Logic)
                       <div className="relative w-full max-w-sm h-[410px] sm:h-[400px] mx-auto overflow-visible">


                            <AnimatePresence
                                initial={false}
                                custom={swipeState.direction}
                            >
                                {reversedProjectData.map((project, i) => {
                                    // mobile logic uses reversed data for correct stacking order
                                    const isCurrentTop = i === swipeState.index;

                                    if (i === swipeState.index || (i === (swipeState.index + 1) % totalCards) || (i === (swipeState.index + 2) % totalCards) || (i === (swipeState.index + 3) % totalCards)) {
                                        return (
                                            <MobileSwipingCard
                                                key={project.title}
                                                project={project}
                                                index={i}
                                                isTop={isCurrentTop}
                                                onSwipe={handleSwipe}
                                                totalCards={totalCards}
                                                currentDirection={swipeState}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </AnimatePresence>
                        </div>
                        
                    ) : (
                        
                        // 🟢 DESKTOP VIEW: कार्ड्स को स्टैक या ग्रिड में दिखाएं
                        <motion.div
                            // 🔴 फिक्स: 'relative' class जोड़ा गया ताकि 'absolute' child सही ढंग से position हो सके
                            className={`w-full max-w-5xl flex transition-all duration-1000 relative 
                                ${isScrolledIntoView ? 'flex-wrap justify-center' : 'justify-center items-center '}
                            `}
                            // जब inView false हो तो cards stack हो सकें
                            style={{ minHeight: isScrolledIntoView ? 'auto' : '450px' }}
                        >
                            {/* Desktop logic uses non-reversed data */}
                            {projectData.map((project, i) => (
                                <DesktopAnimatedCard
                                    key={project.title}
                                    project={project}
                                    index={i}
                                    isScrolledIntoView={isScrolledIntoView}
                                    totalCards={totalCards}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>

            </div>
        </section>
    );
};