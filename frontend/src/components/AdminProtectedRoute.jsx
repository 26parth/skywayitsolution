import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

export default function AdminProtectedRoute() {
  const { accessToken, isLoading } = useSelector(
    (state) => state.adminAuth
  );

  // 🔥 WAIT UNTIL REFRESH TOKEN CHECK COMPLETES
  if (isLoading) {
    return <Loader />;
  }

  // ❌ No token after loading → logout
  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Token exists
  return <Outlet />;
}
