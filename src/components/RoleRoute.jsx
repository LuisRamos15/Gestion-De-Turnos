import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ role, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.user.role !== role) return <Navigate to="/" replace />;
  return children;
}