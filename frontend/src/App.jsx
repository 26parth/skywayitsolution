// import React from 'react'
import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import FloatingButton from './components/FloatingButton';
import GameModal from './components/GameModal';
import Card from './pages/Course'
import Members from './pages/teamMembers'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Project } from './pages/Project'
import Features from './pages/Features.JSX'
import OurServicesSection from './pages/OurServicesSection'
import FeedbackSection from './pages/FeedbackSection'
import FooterSection from './pages/FooterSection'
// import RegistrationForm from './components/Register_form'
// import LoginForm from './components/LoginForm'
// import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddCourse from './pages/admin/AddCourse';
import useAdminPersist from "./hooks/useAdminPersist";
import useAuthPersist from "./hooks/useAuthPersist";
import AdmissionForm from './pages/AdmissionForm';
import ShowAdmission from './pages/admin/ShowAdmission';
import ShowUser from './pages/admin/ShowUser';
import Enquiries from "./pages/admin/Enquiries";
import Feedbacks from "./pages/admin/Feedbacks";
import AdminLayout from './components/admin/AdminLayout';

const App = () => {

  useAdminPersist(); // 🔥 VERY IMPORTANT 
  useAuthPersist();   // 🔥 USER SESSION RESTORE
  // Modal को नियंत्रित करने के लिए State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true); // Default value: true

  // Loading simulation aur scroll management
  useEffect(() => {
    // Page load hone par scrolling rokenge
    // document.body.style.overflow = 'hidden'; 

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Loading khatam hone par scrolling wapas enable karenge
      // document.body.style.overflow = 'auto'; 
    }, 2000); // 3 second ka delay (aap apne hisaab se badal sakte hain)

    // Cleanup function: component unmount hone ya effect dubara chalne par
    return () => {
      clearTimeout(timer);
      // Ensure scrolling is always enabled at the end
      // document.body.style.overflow = 'auto'; 
    };
  }, []);

  // FloatingButton क्लिक हैंडलर
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  // GameModal क्लोज हैंडलर
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  // Agar isLoading true hai, toh sirf Loader dikhao

  return (
    <>
      {isLoading && <Loader />}

      <Navbar />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <section id="home"><Home /></section>
              <section id="features"><Features /></section>
              <section id="courses"><Card /></section>
              <section id="teamMembers"><Members /></section>
              <section id="project"><Project /></section>
              <section id="ourServices"><OurServicesSection /></section>
              <section id="feedback"><FeedbackSection /></section>
              <section id="footer"><FooterSection /></section>

              <FloatingButton onClick={handleButtonClick} />
              <GameModal isOpen={isModalOpen} onClose={handleModalClose} />
            </>
          }
        />

        {/* Auth Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admissionform" element={<AdmissionForm />} />


        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

        {/* Admin Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected Admin Routes */}
     <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/addcourse" element={<AddCourse />} />
        <Route path="/admin/showadmission" element={<ShowAdmission />} />
        <Route path="/admin/users" element={<ShowUser />} />
        <Route path="/admin/enquiries" element={<Enquiries />} />
        <Route path="/admin/feedbacks" element={<Feedbacks />} />
    </Route>

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-27">
              404: Bhai Admin Panel Hack Karenga Kya ? 😀
            </h1>
          }
        />
      </Routes>
    </>
  );

}

export default App




