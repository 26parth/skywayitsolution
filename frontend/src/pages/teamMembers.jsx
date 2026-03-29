import React, { useState, useEffect } from "react"; // useEffect इम्पोर्ट किया गया है
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faVimeo,
    faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import "../styles/heading_team_member.css"

// --- Data remains the same ---
const teamMembers = [
    {
        img: "/img/team/Naresh-thakor.jpeg",
        name: "Naresh Thkaor",
        designation: "DJANGO Developer/MERN STACK Developer",
        socialLinks: [
            { icon: faTwitter, href: "#!" },
            { icon: faLinkedin, href: "#!" },
            { icon: faVimeo, href: "#!" },
        ],
    },
    {
        img: "/img/team/Anil-Raval.jpeg",
        name: "Anil Raval",
        designation: "DJANGO Developer",
        socialLinks: [
            { icon: faTwitter, href: "#!" },
            { icon: faLinkedin, href: "#!" },
            { icon: faVimeo, href: "#!" },
        ],
    },
    {
        img: "/img/team/Dipak-thakor.jpeg",
        name: "Dipak Thakor",
        designation: "MERN STACK Developer/Laravel Developer",
        socialLinks: [
            { icon: faTwitter, href: "#!" },
            { icon: faLinkedin, href: "#!" },
            { icon: faVimeo, href: "#!" },
        ],
    },
    {
        img: "/img/team/parth-parmar.jpeg",
        name: "Parth Parmar",
        designation: "MERN STACK Developer",
        socialLinks: [
            { icon: faTwitter, href: "#!" },
            { icon: faLinkedin, href: "#!" },
            { icon: faVimeo, href: "#!" },
        ],
    },
];
// -----------------------------

// Team Member Card Component (Fixed: Color change logic refined for mobile tap)
const TeamMemberItem = ({ member, isActive, setIsActive }) => {

    // Detail section पर क्लिक करने पर केवल detail view को टॉगल करना चाहिए।
    const handleDetailClick = (e) => {
        // e.stopPropagation() यह सुनिश्चित करता है कि यह क्लिक ऊपर के Swipe Click को ट्रिगर न करे
        e.stopPropagation();
        if (setIsActive) {
            setIsActive(prev => !prev);
        }
    };

    return (
        <div className="group relative h-full w-full ">
            <img src={member.img} alt={member.name} className="h-auto w-full mx-auto" />
            <div
                // ONLY THIS DIV should handle the detail toggle click
                onClick={handleDetailClick}
                className={`
                    absolute -bottom-12 left-[10%] p-5 w-[80%] shadow-xl text-center overflow-hidden z-[1] 
                    duration-300 transition-all cursor-pointer
                    
                    // --- BACKGROUND COLOR LOGIC FIX ---
                    // Active State: Sky Blue
                    ${isActive
                        ? 'bg-blue-600 pt-7 px-5 pb-20 text-white'
                        : 'bg-white dark:bg-slate-800 dark:text-white' // Inactive State
                    }

                    // Desktop Hover Classes (blue-600)
                    group-hover:bg-blue-600 group-hover:pt-7 group-hover:px-5 group-hover:pb-20 group-hover:text-white
                    
                    // Ensure dark mode background is applied correctly
                    ${!isActive && 'dark:bg-slate-800'}
                `}
            >
                <h3 className="text-xl font-semibold leading-normal opacity-80 mb-1">
                    {member.name}
                </h3>
                <p className="text-[17px] leading-normal opacity-80 mb-2">
                    {member.designation}
                </p>
                <div className={`
                    absolute w-full left-0 top-auto mt-1 transition-all duration-300
                    
                    // Desktop Hover Classes
                    opacity-0 translate-y-7 group-hover:opacity-100 group-hover:translate-y-0

                    // Mobile/Tap Active Classes (isActive prop based)
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}
                `}>
                    <ul className="flex justify-center items-center">
                        {member.socialLinks.map((item, i) => (
                            <li key={i}>
                                <a
                                    href={item.href}
                                    onClick={e => e.stopPropagation()} // Social link पर क्लिक करने से detail toggle नहीं होना चाहिए
                                    className="w-10 h-10 text-[26px] text-center hover:text-sky-500 mt-2 mr-2 opacity-90 p-0 relative z-[1] inline-flex justify-center items-center before:absolute before:w-full before:h-full before:opacity-0 before:translate-y-full before:bg-slate-800 before:-z-[1] hover:before:opacity-100 hover:before:translate-y-0 transition duration-300"
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

TeamMemberItem.propTypes = {
    member: PropTypes.object.isRequired,
    isActive: PropTypes.bool,
    setIsActive: PropTypes.func, // New prop
};


// Interactive Card Component (Fixed: Resets detail state on component mount/update)
const InteractiveCard = ({ member, index, isTop, onSwipe, totalCards, currentDirection }) => {

    // State is local to top card only
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);

    // FIX: useEffect added to ensure detail state is FALSE when card becomes the top card.
    // यह सुनिश्चित करता है कि जब कार्ड वापस स्टैक में आता है (भले ही वह टॉप पर हो),
    // तो डिटेल बंद ही रहे।
    useEffect(() => {
        if (isTop) {
            // isTop होने पर detail state को false पर सेट करें
            setIsDetailOpen(false);
        }
    }, [member.name, isTop]); // Dependency on member.name or isTop

    // Stacking logic for non-top cards (unchanged)
    if (!isTop) {
        const positionFromTop = index - currentDirection.index;
        const visualIndex = positionFromTop < 0 ? positionFromTop + totalCards : positionFromTop;

        if (visualIndex >= 4) return null;

        const scale = 1 - visualIndex * 0.1;
        const yOffset = visualIndex * 40;
        const rotateValue = visualIndex * 4 * (visualIndex % 2 === 0 ? 1 : -1);

        return (
            <motion.div
                className="absolute top-0 left-0 w-full h-full p-12 lg:p-0"
                initial={{ opacity: 0, scale: 0.9, y: yOffset + 50, rotate: rotateValue * 0.5 }}
                animate={{
                    opacity: 1,
                    scale,
                    y: yOffset,
                    rotate: rotateValue,
                    transition: {
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                        delay: visualIndex * 0.05,
                    }
                }}
                exit={{
                    opacity: 0,
                    transition: { duration: 0.2 }
                }}
                style={{
                    zIndex: totalCards - visualIndex,
                    border: visualIndex > 0 ? '4px solid rgba(255, 255, 255, 0.2)' : 'none',
                    originX: 0.5,
                    originY: 0.5
                }}
            >
                <TeamMemberItem member={member} isActive={false} />
            </motion.div>
        );
    }

    // Animation variants for the top card (Smoother, Sweeping Exit)
    const cardVariants = {
        exit: (direction) => ({
            x: direction === 'right' ? 4000 : -4000,
            rotate: direction === 'right' ? 250 : -250,
            opacity: 0,
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 40,
                damping: 15,
                mass: 1.2,
                restSpeed: 0.001,
                restDelta: 0.001,
            }
        }),
        initial: {
            x: 0,
            rotate: 0,
            opacity: 1,
            scale: 1
        }
    };

    // Function to reset detail view on drag start (smoothly close detail on drag)
    const handleDragStart = () => {
        setIsDetailOpen(false); // Smoothly closes the detail section
    }

    // Only drag end triggers the swipe action
    const handleDragEnd = (event, info) => {
        // detail state DragStart में पहले ही बंद हो चुका है

        const swipeDistance = info.offset.x;
        const swipeVelocity = info.velocity.x;

        const distanceThreshold = 60;
        const velocityThreshold = 100;

        if (Math.abs(swipeDistance) > distanceThreshold || Math.abs(swipeVelocity) > velocityThreshold) {
            onSwipe(swipeDistance > 0 ? 'right' : 'left');
        }
    };

    // Click handler for the whole card (to trigger swipe)
    const handleSwipeClick = (e) => {
        // यह तब कॉल होता है जब पूरे कार्ड पर क्लिक किया जाता है (लेकिन detail div पर नहीं)
        // detail div में e.stopPropagation() यह सुनिश्चित करेगा कि detail click यहां न आए
        onSwipe('right');
    }

    return (
        <motion.div
            key={member.name}
            className="absolute top-0 left-0 w-full h-full p-12 lg:p-0 touch-none"
            style={{ x, rotate, zIndex: totalCards }}
            variants={cardVariants}
            initial="initial"
            custom={currentDirection.direction}
            exit="exit"

            // Main card click functionality (Click to swipe)
            onClick={handleSwipeClick}

            // Drag event handlers
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}

            drag="x"
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}

            whileDrag={{ scale: 1.15, cursor: 'grabbing', filter: 'brightness(1.2)' }}
        >
            {/* Pass state and state setter to the item component */}
            <TeamMemberItem member={member} isActive={isDetailOpen} setIsActive={setIsDetailOpen} />

            {/* No extra overlay needed as motion.div handles click and drag */}
        </motion.div>
    );
};

InteractiveCard.propTypes = {
    member: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isTop: PropTypes.bool.isRequired,
    onSwipe: PropTypes.func.isRequired,
    totalCards: PropTypes.number.isRequired,
    currentDirection: PropTypes.object.isRequired,
};

// Main Component - Unchanged logic
const TeamMember12 = () => {
    const totalCards = teamMembers.length;
    const [swipeState, setSwipeState] = useState({ index: 0, direction: 'right' });

    const handleSwipe = (direction) => {
        setSwipeState(prev => ({
            index: (prev.index + 1) % totalCards,
            direction: direction,
        }));
    };

    const reversedMembers = [...teamMembers].reverse();

    return (
        <section className="ezy__team12 dark py-3 md:py-4 text-zinc-900 dark:text-white overflow-hidden"
            style={{
                background: "#050D1C"
            }}

        >
            <div className="container px-4 mx-auto">
                <div className="flex justify-center text-center">
                    <div className="sm:max-w-md">
                        <div className="flex justify-center">
                            <div className="name">
                                <div className="cosmic" data-text="M"><span>M</span></div>
                                <div className="cosmic" data-text="E"><span>E</span></div>
                                <div className="cosmic" data-text="M"><span>M</span></div>
                                <div className="cosmic" data-text="B"><span>B</span></div>
                                <div className="cosmic" data-text="E"><span>E</span></div>
                                <div className="cosmic" data-text="R"><span>R</span></div>
                                <div className="cosmic" data-text="S"><span>S</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center  mb-15 md:mb-20 mt-[-20px]">

                    <div className="relative w-full max-w-sm h-[550px]">
                        <AnimatePresence
                            initial={false}
                            custom={swipeState.direction}
                        >
                            {reversedMembers.map((member, i) => {
                                const isCurrentTop = i === swipeState.index;

                                if (i === swipeState.index || i === (swipeState.index + 1) % totalCards || i === (swipeState.index + 2) % totalCards || i === (swipeState.index + 3) % totalCards) {
                                    return (
                                        <InteractiveCard
                                            key={member.name}
                                            member={member}
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
                </div>
            </div>
        </section>
    );
};

export default TeamMember12;