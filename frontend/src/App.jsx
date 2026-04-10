// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

// Hooks
import useAdminPersist from "./hooks/useAdminPersist";
import useAuthPersist from "./hooks/useAuthPersist";

// Components
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import FloatingButton from './components/FloatingButton';
import GameModal from './components/GameModal';

// Pages (Sahi imports rakho)
import Home from './pages/Home';
import Card from './pages/Course';
import Members from './pages/teamMembers';
import { Project } from './pages/Project';
import Features from './pages/Features';
import OurServicesSection from './pages/OurServicesSection';
import FeedbackSection from './pages/FeedbackSection';
import FooterSection from './pages/FooterSection';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddCourse from './pages/admin/AddCourse';
import AdmissionForm from './pages/AdmissionForm';
import ShowAdmission from './pages/admin/ShowAdmission';
import ShowUser from './pages/admin/ShowUser';
import Enquiries from "./pages/admin/Enquiries";
import Feedbacks from "./pages/admin/Feedbacks";
import AdminLayout from './components/admin/AdminLayout';
import Manageadmin from './pages/admin/Manageadmin';

const App = () => {
  useAdminPersist();
  useAuthPersist();

  const userLoading = useSelector((state) => state.auth.loading);
  const adminLoading = useSelector((state) => state.adminAuth.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation(); // 👈 add this
  const isAdminRoute = location.pathname.startsWith("/admin"); // 👈 add this

  const handleButtonClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  if (userLoading || adminLoading) {
    return null;
  }


  return (
    <>
      {!isAdminRoute && <Navbar />}  {/* 👈 Navbar sirf non-admin routes pe */}
      <Routes>
        {/* Main Website Sections */}
        <Route path="/" element={
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

        {/* Auth & Admission */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* User Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/admissionform" element={<AdmissionForm />} />

        </Route>

        {/* Admin Public */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Protected */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/addcourse" element={<AddCourse />} />
          <Route path="/admin/showadmission" element={<ShowAdmission />} />
          <Route path="/admin/users" element={<ShowUser />} />
          <Route path="/admin/enquiries" element={<Enquiries />} />
          <Route path="/admin/feedbacks" element={<Feedbacks />} />
          <Route path="/admin/manage-admin" element={<Manageadmin />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1 className="text-center mt-27">404: Page Not Found!</h1>} />
      </Routes>
    </>
  );
};

export default App;