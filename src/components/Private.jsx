import { Navigate, useLocation } from 'react-router-dom';

function Private({ role, children }) {
  const session = JSON.parse(localStorage.getItem("session") || "null");
  const location = useLocation();

  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  if (role && session.role !== role) {
    if (session.role === "Administrador") return <Navigate to="/admin" replace />;
    if (session.role === "Operativo") return <Navigate to="/operativo" replace />;
    return <Navigate to="/agendar" replace />;
  }

  return children;
}

export default Private;