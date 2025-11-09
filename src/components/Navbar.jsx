import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { session, isAdmin, logout } = useAuth();
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <nav className="container flex items-center justify-between">
        <Link to={session ? (isAdmin ? "/admin" : "/schedule") : "/login"} className="brand">
          Gestión de Turnos EPS
        </Link>
        <ul className="flex items-center gap-4">
          {session ? (
            <>
              {!isAdmin && (
                <>
                  <li><NavLink to="/schedule">Agendar</NavLink></li>
                  <li><NavLink to="/room">Sala</NavLink></li>
                </>
              )}
              {isAdmin && (
                <li><NavLink to="/admin">Dashboard</NavLink></li>
              )}
              <li><button className="btn-ghost" onClick={doLogout}>Salir</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Iniciar sesión</NavLink></li>
              <li><NavLink to="/register">Registrarse</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}