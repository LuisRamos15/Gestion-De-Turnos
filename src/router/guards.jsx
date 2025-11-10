import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    // Si no tiene rol requerido, reenvía a su home
    return <Navigate to={user.role === "Administrador" ? "/admin" : "/agendar"} replace />;
  }
  return <Outlet />;
};

export const GuestOnly = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "Administrador" ? "/admin" : "/agendar"} replace />;
  }
  return <Outlet />;
}