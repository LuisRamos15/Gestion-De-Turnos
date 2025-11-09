import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { doc, name, role: 'admin' | 'citizen' }
  const [loading, setLoading] = useState(true);

  // Cargar sesión persistida
  useEffect(() => {
    try {
      const raw = localStorage.getItem("eps:user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error("Error loading user session:", e);
    }
    setLoading(false);
  }, []);

  const login = async ({ doc, password }) => {
    // DEMO: lógica mínima de rol (ajusta con backend real cuando exista)
    // Admin demo: documento 999 o rol admin guardado al registrar
    if (!doc || !password) throw new Error("Documento y contraseña son obligatorios");

    // Si existe un usuario guardado con ese doc, usar su rol
    const savedUsers = JSON.parse(localStorage.getItem("eps:users") || "[]");
    const found = savedUsers.find(u => u.doc === doc && u.password === password);
    let role = "citizen";
    let name = "Usuario";
    if (found) {
      role = found.role || "citizen";
      name = found.name || "Usuario";
    } else if (doc === "999" && password === "admin") {
      role = "admin";
      name = "Admin Demo";
    }
    const nextUser = { doc, name, role };
    localStorage.setItem("eps:user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const register = async ({ name, doc, email, password, role = "citizen" }) => {
    if (!name || !doc || !password) throw new Error("Completa nombre, documento y contraseña");
    const users = JSON.parse(localStorage.getItem("eps:users") || "[]");
    if (users.some(u => u.doc === doc)) throw new Error("El documento ya está registrado");
    const newUser = { name, doc, email, password, role };
    users.push(newUser);
    localStorage.setItem("eps:users", JSON.stringify(users));
    // No iniciar sesión automática: regresar al login con aviso
    return true;
  };

  const logout = () => {
    localStorage.removeItem("eps:user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, register }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};