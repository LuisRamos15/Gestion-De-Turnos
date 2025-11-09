import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (!document || !password) {
        setErrorMsg("Documento y contraseña son obligatorios.");
        return;
      }
      // DEMO: si termina en "00" => admin; si no, ciudadano
      const role = String(document).endsWith("00") ? "admin" : "citizen";
      login({ id: document, name: "Usuario", role });
      nav(role === "admin" ? "/admin" : "/schedule", { replace: true });
    } catch (err) {
      setErrorMsg("No fue posible iniciar sesión.");
      console.error(err);
    }
  };

  return (
    <div className="page-center">
      <form className="card max-w-md w-full" onSubmit={onSubmit}>
        <h1 className="h4 mb-3">Gestión de Turnos Ciudadanos EPS</h1>
        {errorMsg && <div className="alert alert-danger mb-3">{errorMsg}</div>}
        <label className="label">Número de identificación</label>
        <input
          className="input mb-2"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          placeholder="Ingresa tu número"
        />
        <label className="label">Contraseña</label>
        <input
          className="input mb-4"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
        />
        <button className="btn btn-brand w-full" type="submit">
          Iniciar sesión
        </button>
        <div className="mt-3 text-center">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>
      </form>
    </div>
  );
}