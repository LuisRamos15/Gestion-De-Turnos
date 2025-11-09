 import { Link, useLocation } from 'react-router-dom';
 import { useAuth } from "../context/AuthContext";

 export default function Navbar() {
   const { user, logout } = useAuth();
   const { pathname } = useLocation();

   const isAuthPage = pathname === '/login' || pathname === '/register';

   return (
     <header className="nav">
       <div className="nav__inner">
         <Link to="/" className="nav__brand">Gestión de Turnos EPS</Link>
          {!isAuthPage && (
            <nav className="nav__right">
              <div className="flex items-center gap-4">
                {user?.role === "citizen" && (
                  <>
                    <Link to="/agendar">Agendar</Link>
                    <Link to="/sala">Sala</Link>
                  </>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin">Dashboard</Link>
                )}
                {user && (
                  <button className="btn-danger-outline" onClick={logout}>Salir</button>
                )}
              </div>
            </nav>
          )}
       </div>
     </header>
   );
}