import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requireRole }) {
  const { user, loading } = useAuth();
  if (loading) return null; // o un loader pequeño
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) {
    // Si es admin, llévalo a /admin; si es ciudadano, a /agendar
    return <Navigate to={user.role === "admin" ? "/admin" : "/agendar"} replace />;
  }
  return <Outlet />;
}