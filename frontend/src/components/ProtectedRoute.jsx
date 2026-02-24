import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute() {
  const { accessToken, loading } = useSelector((state) => state.auth);

  // 🔥 WAIT till refresh-token check finishes
  if (loading) {
    return <Loader />;
  }

  // ❌ No token after loading → login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ User authenticated
  return <Outlet />;
}
