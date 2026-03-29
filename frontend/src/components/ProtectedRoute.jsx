// frontend/src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute() {
  const { accessToken, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <Loader />;
  if (!accessToken) return <Navigate to="/login" replace />;

  // 🛡️ Agar user ka profile incomplete hai aur wo edit-profile ke bahar jana chahe, toh wapas bhejo
  if (user && !user.isProfileComplete && location.pathname !== "/edit-profile") {
    return <Navigate to="/edit-profile" replace />;
  }

  return <Outlet />;
}