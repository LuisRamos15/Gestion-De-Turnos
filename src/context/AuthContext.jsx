import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (documento, password) => {
    const raw = localStorage.getItem("users");
    const users = raw ? JSON.parse(raw) : [];
    // 2) Buscar coincidencia EXACTA
    const found = users.find(
      (u) => String(u.documento) === String(documento) && u.password === password
    );
    if (!found) {
      // NO sesión por defecto, NO auto-registro
      return { ok: false, message: "Documento o contraseña incorrectos." };
    }
    // 3) Iniciar sesión con el usuario encontrado
    const session = { id: found.id, nombre: found.nombre, documento: found.documento, role: found.role };
    setUser(session);
    localStorage.setItem("session", JSON.stringify(session));
    return { ok: true, role: found.role };
  };

  const register = ({ nombre, documento, email, password, role = "Ciudadano" }) => {
    if (!nombre || !documento || !password) throw new Error("Completa nombre, documento y contraseña");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.documento === documento)) throw new Error("El documento ya está registrado");
    const newUser = { id: Date.now(), nombre, documento, email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("session");
  };

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};