// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const formVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", stiffness: 80, damping: 15 },
//   },
// };

// export default function LoginForm() {
//   const [formData, setFormData] = useState({
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
//     console.log("Login Data Submitted:", formData);
//     setIsSubmitted(true);
//   };

//   // ⭐ अपडेटेड InputField कंपोनेंट (Corrected Border Cutout Effect) ⭐
//   const InputField = ({ label, name, type = "text" }) => {
//     return (
//       <div className="relative z-10 w-full"> 
//         <input
//           type={type}
//           id={name}
//           name={name}
//           value={formData[name]}
//           onChange={handleChange}
//           required
//           placeholder=" " 
//           className="peer w-full p-4 pt-6 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-inner"
//         />
//         <label
//           htmlFor={name}
//           className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-300 
                     
//                      /* Default (Placeholder Shown) */
//                      peer-placeholder-shown:top-4 
//                      peer-placeholder-shown:text-base 
//                      peer-placeholder-shown:text-gray-400
                     
//                      /* Floating (On Focus or Value Exists) */
//                      peer-focus:top-[-0.75rem] 
//                      peer-focus:left-4 
//                      peer-focus:text-sm 
//                      peer-focus:text-sky-400 
                     
//                      /* ⭐ यहाँ बदलाव है: बैकग्राउंड को transparent और margin को हटा दिया ⭐ */
//                      /* हमें अब 'bg-white/5' या '-mx-2' की जरूरत नहीं है, क्योंकि हम फोकस रिंग को काटना नहीं चाहते */
//                      /* इसके बजाय, हम लेबल को सिर्फ थोड़ा ऊपर ले जाएंगे और उसके नीचे की बॉर्डर कटेगी */
                     
//                      /* When value is present (even without focus) */
//                      peer-valid:top-[-0.75rem]
//                      peer-valid:left-4
//                      peer-valid:text-sm"
//         >
//           {label}
//         </label>
//       </div>
//     );
//   };
//   // ⭐ InputField कंपonent समाप्त ⭐

//   return (
//     <div className="w-full flex justify-center relative px-4 sm:px-8 py-20 min-h-screen overflow-hidden bg-gradient-to-b from-[#050b13] via-[#0c1d33] to-[#040e1b]">
//       <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
      
//       <div className="w-full max-w-lg mx-auto relative z-10 flex flex-col gap-8">
        
//         {/* Heading */}
//         <div className="text-center">
//           <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
//                 Welcome Back
//             </span> 
//             <span className="block text-xl sm:text-2xl font-semibold text-gray-300 mt-2">
//                 Log in to your Account
//             </span>
//           </h1>
//         </div>

//         {/* Login Form Card */}
//         <motion.form
//           onSubmit={handleSubmit}
//           className="group relative rounded-3xl p-8 sm:p-10 flex flex-col gap-6 overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 ease-out hover:bg-gradient-to-br hover:from-sky-900/40 hover:via-white/5 hover:to-transparent hover:border-sky-500/50 hover:shadow-[0_0_50px_rgba(14,165,233,0.2)]"
//           variants={formVariants}
//           initial="hidden"
//           animate="visible"
//         >
          
//           {/* Shine Effect */}
//           <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg] transition-all duration-1000 ease-in-out group-hover:left-[200%]" />

//           <h2 className="text-2xl font-bold text-white mb-2 relative z-10 border-b border-white/10 pb-3">
//             Enter Credentials
//           </h2>

//           {/* Input Fields */}
//           <InputField label="Email Address" name="email" type="email" />
//           <InputField label="Password" name="password" type="password" />

//           {/* Forgot Password */}
//           <div className="relative z-10 flex justify-end">
//             <a
//               href="#"
//               className="text-sm text-sky-400 hover:text-sky-300 transition-colors duration-300"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           {/* Submit Button */}
//           <div className="pt-4 mt-4 border-t border-white/10 group-hover:border-sky-500/30 transition-colors duration-500 relative z-10">
//             <button
//               type="submit"
//               disabled={isSubmitted}
//               className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
//             >
//               <span className="relative z-10 inline-block">
//                 {isSubmitted ? "Logging In..." : "Log In"}
//               </span>
//             </button>
//           </div>

//           {/* Submission Message */}
//           {isSubmitted && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center text-sm text-yellow-400 mt-3 relative z-10"
//             >
//               Attempting to log you in...
//             </motion.div>
//           )}
//         </motion.form>

//         {/* Register Link */}
//         <p className="text-center text-gray-400 text-sm relative z-10">
//           Don't have an account?{" "}
//           <a
//             href="#"
//             className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
//           >
//             Register Here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }