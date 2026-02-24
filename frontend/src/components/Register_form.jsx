// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const formVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
// };

// export default function RegistrationForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
  
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // यहां आप फ़ॉर्म सबमिट लॉजिक जोड़ सकते हैं
//     console.log("Form Data Submitted:", formData);
//     setIsSubmitted(true);
//     // setTimeout(() => setIsSubmitted(false), 3000); // अगर आप संदेश को कुछ देर बाद हटाना चाहते हैं
//   };

//   // इनपुट फ़ील्ड के लिए एक सहायक कंपोनेंट (Helper Component)
//   const InputField = ({ label, name, type = "text", placeholder }) => (
//     <div className="relative z-10 space-y-2">
//       <label htmlFor={name} className="block text-sm font-medium text-gray-300">
//         {label}
//       </label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         placeholder={placeholder}
//         value={formData[name]}
//         onChange={handleChange}
//         required
//         className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-inner group-hover:border-sky-500/30"
//       />
//     </div>
//   );

//   return (
//     <div className="w-full flex justify-center relative px-4 sm:px-8 py-20 min-h-screen overflow-hidden bg-gradient-to-b from-[#050b13] via-[#0c1d33] to-[#040e1b]">
//       <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

//       <div className="w-full max-w-lg mx-auto relative z-10 flex flex-col gap-8">
        
//         {/* ⭐ अपडेटेड नॉर्मल हेडिंग (Updated Normal Heading) ⭐ */}
//         <div className="text-center">
//           <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
//                 Register
//             </span> 
//             <span className="block text-xl sm:text-2xl font-semibold text-gray-300 mt-2">
//                 Create Your Account
//             </span>
//           </h1>
//         </div>

//         {/* Registration Card Form */}
//         <motion.form 
//           onSubmit={handleSubmit}
//           className="group relative rounded-3xl p-8 sm:p-10 flex flex-col gap-6 overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 ease-out hover:bg-gradient-to-br hover:from-sky-900/40 hover:via-white/5 hover:to-transparent hover:border-sky-500/50 hover:shadow-[0_0_50px_rgba(14,165,233,0.2)]"
//           variants={formVariants}
//           initial="hidden"
//           animate="visible"
//         >
          
//           {/* Shine Effect (Card's Hover Effect) */}
//           <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg] transition-all duration-1000 ease-in-out group-hover:left-[200%]" />

//           <h2 className="text-2xl font-bold text-white mb-2 relative z-10 border-b border-white/10 pb-3">Fill in the Details</h2>

//           {/* Input Fields */}
//           <InputField 
//             label="Full Name" 
//             name="name" 
//             placeholder="Enter your full name" 
//           />
//           <InputField 
//             label="Email Address" 
//             name="email" 
//             type="email"
//             placeholder="example@email.com" 
//           />
//           <InputField 
//             label="Password" 
//             name="password" 
//             type="password"
//             placeholder="Minimum 8 characters" 
//           />
          
//           {/* Submit Button */}
//           <div className="pt-4 mt-4 border-t border-white/10 group-hover:border-sky-500/30 transition-colors duration-500 relative z-10">
//             <button
//               type="submit"
//               disabled={isSubmitted}
//               className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
//             >
//               <span className="relative z-10 inline-block">
//                 {isSubmitted ? "Registration Successful! 🎉" : "Register Now"}
//               </span>
//             </button>
//           </div>
          
//           {isSubmitted && (
//              <motion.div 
//                initial={{ opacity: 0, y: 10 }}
//                animate={{ opacity: 1, y: 0 }}
//                className="text-center text-sm text-green-400 mt-3 relative z-10"
//              >
//                Thank you for registering! We've sent a confirmation email.
//              </motion.div>
//            )}

//         </motion.form>

//         <p className="text-center text-gray-400 text-sm relative z-10">
//             Already have an account? <a href="#" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">Sign In</a>
//         </p>
//       </div>
//     </div>
//   );
// }