import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Heroicons for contact info
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
// Lucide-react for robust social media icons
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

// 🔥 FIX: fetch ki jagah axiosClient import karo unauthorized error ke liye
import axiosClient from "../lib/axiosClient";

// --- Animation Configuration ---
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

// --- EnquiryForm Component ---
const EnquiryForm = ({ springTransition, viewPortProps }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // 🔥 FIX: Direct Render URL pass kiya taaki localhost ki error na aaye
      const response = await axiosClient.post("/api/enquiry", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Enquiry sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error sending enquiry.");
    } finally {
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-shrink-0 w-full p-1">
      <h3 className="text-2xl font-bold text-sky-400 mb-6">Enquiry Form</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 items-start">
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewPortProps}
          transition={{ ...springTransition, delay: 0.2 }}
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your Name"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewPortProps}
          transition={{ ...springTransition, delay: 0.3 }}
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your Email"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <motion.textarea
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewPortProps}
        transition={{ ...springTransition, delay: 0.4 }}
        placeholder="Your Inquiry Message"
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows="6"
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
      ></motion.textarea>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewPortProps}
        transition={{ ...springTransition, delay: 0.5 }}
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors duration-300 transform hover:scale-105 disabled:opacity-50"
      >
        {status === "sending" ? "SENDING..." : "SEND ENQUIRY"}
      </motion.button>
    </form>
  );
};

// --- FeedbackForm Component ---
const FeedbackForm = ({ springTransition, viewPortProps }) => {
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // 🔥 FIX: Direct Render URL pass kiya taaki localhost ki error na aaye
      const response = await axiosClient.post("/api/feedback", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Feedback submitted! Thank you.");
        setFormData({ name: "", email: "", feedback: "" });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting feedback.");
    } finally {
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-shrink-0 w-full p-1">
      <h3 className="text-2xl font-bold text-sky-400 mb-6">Feedback Form</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 items-start">
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewPortProps}
          transition={{ ...springTransition, delay: 0.2 }}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your Name (Optional)"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewPortProps}
          transition={{ ...springTransition, delay: 0.3 }}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your Email (Optional)"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <motion.textarea
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewPortProps}
        transition={{ ...springTransition, delay: 0.4 }}
        placeholder="Your Feedback/Suggestion"
        required
        value={formData.feedback}
        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
        rows="6"
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
      ></motion.textarea>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewPortProps}
        transition={{ ...springTransition, delay: 0.5 }}
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors duration-300 transform hover:scale-105 disabled:opacity-50"
      >
        {status === "sending" ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
      </motion.button>
    </form>
  );
};

// --- Footer Section Component ---
const FooterSection = () => {
  const [currentForm, setCurrentForm] = useState('enquiry');
  const handleFormChange = (formType) => setCurrentForm(formType);

  const flipVariants = {
    hidden: (direction) => ({
      rotateY: direction === 'next' ? -90 : 90,
      opacity: 0,
      transition: { duration: 0.3 }
    }),
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { ...springTransition, duration: 0.6 }
    },
    exit: (direction) => ({
      rotateY: direction === 'next' ? 90 : -90,
      opacity: 0,
      transition: { duration: 0.3 }
    }),
  };

  const direction = useRef('next');
  const prevForm = useRef(currentForm);

  if (currentForm !== prevForm.current) {
    direction.current = (currentForm === 'feedback' && prevForm.current === 'enquiry') ? 'next' : 'prev';
    prevForm.current = currentForm;
  }

  return (
    <div className="pt-12 pb-5 lg:pt-15 lg:pb-2 relative z-10 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 10% 70%, rgba(46,229,157,0.25), transparent 50%),
          radial-gradient(circle at 90% 20%, rgba(14,165,233,0.25), transparent 50%),
          radial-gradient(circle at 50% 35%, rgba(0,172,240,0.15), transparent 60%),
          linear-gradient(140deg, #07111B, #0B1A33 55%, #101A2C)
        `
      }}
    >
      <div className="container mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-4 items-start">
          {/* LEFT SIDE: FLIP FORM CONTAINER */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewPortProps}
            transition={{ ...springTransition, delay: 0.1 }}
            className="text-left relative w-full lg:w-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              GET IN <span className="text-sky-400">TOUCH</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg">
              {currentForm === 'enquiry'
                ? "Please fill out the enquiry form or switch to leave feedback."
                : "We value your opinion. Please share your valuable feedback below."}
            </p>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => handleFormChange('enquiry')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${currentForm === 'enquiry'
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                Enquiry
              </button>
              <button
                onClick={() => handleFormChange('feedback')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${currentForm === 'feedback'
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                Feedback
              </button>
            </div>

            <div className="relative w-full h-[550px] sm:h-[510px] xs:h-[480px]" style={{ perspective: 1000 }}>
              <AnimatePresence custom={direction.current}>
                {currentForm === 'enquiry' && (
                  <motion.div
                    key="enquiry-form"
                    variants={flipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={direction.current}
                    className="absolute top-0 left-0 w-full h-full backface-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <EnquiryForm springTransition={springTransition} viewPortProps={viewPortProps} />
                  </motion.div>
                )}
                {currentForm === 'feedback' && (
                  <motion.div
                    key="feedback-form"
                    variants={flipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={direction.current}
                    className="absolute top-0 left-0 w-full h-full backface-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <FeedbackForm springTransition={springTransition} viewPortProps={viewPortProps} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT SIDE: CONTACT INFO & MAP */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewPortProps}
            transition={{ ...springTransition, delay: 0.2 }}
            className="text-left lg:pl-12 w-full flex flex-col items-stretch lg:items-start mt-8 lg:mt-0"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Info</h3>
            <div className="flex flex-col gap-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewPortProps}
                transition={{ ...springTransition, delay: 0.3 }}
                className="flex w-full items-start gap-4 justify-start"
              >
                <MapPinIcon className="h-8 w-8 text-sky-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white text-base">Address</p>
                  <p className="text-gray-400 text-sm lg:text-base leading-tight">
                    First Floor, Lal Bhuvan, Plot No - 493,<br />
                    GH6 Rd, Sector 22, Gandhinagar,<br />
                    Gujarat 382021
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewPortProps}
                transition={{ ...springTransition, delay: 0.4 }}
                className="flex w-full items-center gap-4 justify-start"
              >
                <PhoneIcon className="h-8 w-8 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white text-base">Phone</p>
                  <p className="text-gray-400 text-sm lg:text-base leading-tight">+91 80000 67963</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewPortProps}
                transition={{ ...springTransition, delay: 0.5 }}
                className="flex w-full items-center gap-4 justify-start"
              >
                <EnvelopeIcon className="h-8 w-8 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white text-base">Email</p>
                  <p className="text-gray-400 text-sm lg:text-base leading-tight">info@itcompany.com</p>
                </div>
              </motion.div>
            </div>

            <h3 className="text-xl font-bold text-white mt-10 mb-4">Our Location</h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewPortProps}
              transition={{ ...springTransition, delay: 0.6 }}
              className="mt-4 rounded-xl overflow-hidden shadow-2xl h-60 sm:h-80 w-full"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.439589415494!2d72.6412193!3d23.2351222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDE0JzA2LjQiTiA3MsKwMzgnMjguNCJF!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "240px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Skyway IT Solution Location Map"
              ></iframe>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-800">
        <div className="container mx-auto px-6 sm:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewPortProps}
            transition={{ ...springTransition, delay: 0.6 }}
            className="flex justify-center space-x-6 mb-8"
          >
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-sky-400 hover:bg-sky-600 hover:text-white transition-all duration-300 transform hover:scale-110">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-sky-400 hover:bg-sky-600 hover:text-white transition-all duration-300 transform hover:scale-110">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-sky-400 hover:bg-sky-600 hover:text-white transition-all duration-300 transform hover:scale-110">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-sky-400 hover:bg-sky-600 hover:text-white transition-all duration-300 transform hover:scale-110">
              <Youtube className="h-5 w-5" />
            </a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewPortProps}
            transition={{ ...springTransition, delay: 0.7 }}
            className="text-gray-500 text-sm"
          >
            © {new Date().getFullYear()} YourITCompany. All rights reserved. Design by <a href="#" className="text-sky-500 hover:underline">TemplateWire</a>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;