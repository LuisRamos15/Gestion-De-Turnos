import { createContext, useContext, useEffect, useState } from "react";

import * as db from '../lib/db'

import * as sim from '../lib/sim'

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem("session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem("session", JSON.stringify(session));
    else localStorage.removeItem("session");
  }, [session]);

  const logout = () => setSession(null);

  // Base de datos local para el demo
  const USERS_KEY = "tcc_eps_users";
  const readUsers = () => {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  };
  const writeUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));

  const register = ({ nombre, doc, email, pass, rol }) => {
    const users = readUsers();
    if (users.some(u => u.doc === doc)) {
      throw new Error("Ese documento ya está registrado.");
    }
    const u = { id: crypto.randomUUID(), nombre, doc, email: email || "", pass, rol };
    users.push(u);
    writeUsers(users);
    // NO iniciar sesión automáticamente
    return u;
  };

  const login = ({ doc, pass }) => {
    const users = readUsers();
    const u = users.find(u => u.doc === doc && u.pass === pass);
    if (!u) throw new Error("Documento o contraseña inválidos.");
    setSession({ id: u.id, nombre: u.nombre, doc: u.doc, rol: u.rol });
    return u;
  };

  const isAuthenticated = !!session;
  const hasRole = (roles) => {
    if (!session) return false;
    const list = Array.isArray(roles) ? roles : [roles];
    return list.includes(session.rol);
  };

  const value = {
    session,
    setSession,
    logout,
    login,
    register,
    isAuthenticated,
    hasRole,
    data: db
  };

  useEffect(() => { db.seed(); const stop = sim.start(); return () => stop(); }, []);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
};