import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth?.() ?? { user: null, loading: false };
  if (loading) return null;            // nada visual cambia
  if (!user) return <Navigate to="/login" replace />;
  return children ?? <Outlet />;       // <-- importante
}