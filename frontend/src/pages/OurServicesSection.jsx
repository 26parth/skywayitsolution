import React from "react";
import { motion } from "framer-motion";

// Heroicons 
import { 
    CodeBracketIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    ChartBarIcon,
    RocketLaunchIcon,
    LightBulbIcon
} from "@heroicons/react/24/outline";

// Animation Config
const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 0.5,
};

const viewPortProps = {
    once: true,
    amount: 0.1,
};

const serviceContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
        },
    },
};

const serviceItem = {
    hidden: { opacity: 0, y: 50, scale: 0.85 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: springTransition,
    },
};

// ⭐ IMPROVED SERVICE CONTENT  
const servicesData = [
    {
        icon: CodeBracketIcon,
        title: "Live Project Development",
        description:
            "Work on real-world, production-ready applications and gain hands-on experience by building solutions for actual client needs.",
    },
    {
        icon: AcademicCapIcon,
        title: "Professional Bootcamps",
        description:
            "Expert-designed, structured training programs to help you master complex technologies with confidence and practical depth.",
    },
    {
        icon: BriefcaseIcon,
        title: "Industry Internship",
        description:
            "Government-approved internships focusing on practical skills, teamwork, workflows, and real corporate project exposure.",
    },
    {
        icon: ChartBarIcon,
        title: "Career Guidance & Mentoring",
        description:
            "Receive personalized career roadmaps, resume polishing, and interview preparation from senior industry mentors.",
    },
    {
        icon: RocketLaunchIcon,
        title: "100% Placement Assistance",
        description:
            "We connect skilled students with hiring partners and support them throughout their placement and interview journey.",
    },
    {
        icon: LightBulbIcon,
        title: "Technology Consulting",
        description:
            "Get expert insights on technology adoption, digital transformation, and optimizing IT infrastructure to boost performance.",
    },
];

const OurServicesSection = () => {
    return (
        <div 
            className="pt-5 pb-15 lg:pt-8 lg:pb-8 relative z-10 px-6 sm:px-8 lg:px-12 "
            style={{ background: "#050D1C" }}
        >
            <div className="container mx-auto px-4 text-center">

                {/* ⭐ HEADING — SAME AS YOUR DEFAULT  */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewPortProps}
                    transition={{ ...springTransition, duration: 0.6 }}
                >
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-sky-400 mb-3 tracking-tight">
                        <div className="name inline-flex justify-center gap-2">
                            <div className="cosmic" data-text="S"><span>S</span></div>
                            <div className="cosmic" data-text="E"><span>E</span></div>
                            <div className="cosmic" data-text="R"><span>R</span></div>
                            <div className="cosmic" data-text="V"><span>V</span></div>
                            <div className="cosmic" data-text="I"><span>I</span></div>
                            <div className="cosmic" data-text="C"><span>C</span></div>
                            <div className="cosmic" data-text="E"><span>E</span></div>
                            <div className="cosmic" data-text="S"><span>S</span></div>
                        </div>
                    </h2>
                </motion.div>

                {/* ⭐ SERVICES GRID */}
                <motion.div
                    variants={serviceContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewPortProps}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 "
                >
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={serviceItem}
                            className="p-8 group rounded-xl shadow-2xl 
                                       bg-white/5 border border-white/10 backdrop-blur-md 
                                       transition-all duration-300 hover:-translate-y-2 
                                       hover:border-sky-500 hover:shadow-sky-800/50 text-left  bg-white/10"
                        >
                            {/* ⭐ ICON FIXED — PERFECT CIRCLE */}
                            <div className="mb-6 flex justify-start">
                                <div
                                    className="h-12 w-12 flex items-center justify-center 
                                               rounded-full bg-sky-500/10 shadow-lg shadow-sky-900/40 
                                               transition-all duration-500 
                                               group-hover:bg-sky-500 group-hover:shadow-sky-500/50"
                                >
                                    <service.icon className="h-7 w-7 text-sky-400 transition-colors duration-500 group-hover:text-white" />
                                </div>
                            </div>

                            {/* ⭐ TEXT SECTION — IMPROVED */}
                            <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                                {service.title}
                            </h3>

                            <p className="text-gray-300 text-[15px] leading-relaxed opacity-90">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default OurServicesSection;
