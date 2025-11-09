import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ roles }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.role)) {
    // Si no tiene rol requerido, reenvía a su home
    return <Navigate to={session.role === "admin" ? "/admin" : "/schedule"} replace />;
  }
  return <Outlet />;
};

export const GuestOnly = () => {
  const { session } = useAuth();
  if (session) {
    return <Navigate to={session.role === "admin" ? "/admin" : "/schedule"} replace />;
  }
  return <Outlet />;
};