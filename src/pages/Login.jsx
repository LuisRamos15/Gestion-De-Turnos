import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!documento.trim()) {
      setError("El número de identificación es obligatorio");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria");
      setLoading(false);
      return;
    }
    const result = login(documento.trim(), password);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }
    if (result.role === "Administrador") {
      navigate("/admin");
    } else {
      navigate("/agendar");
    }
    setLoading(false);
  };

  return (
<main className="auth-page">
<section className="auth-card" role="form" aria-labelledby="loginTitle">
<header className="auth-card__header">
<h1 id="loginTitle" className="auth-card__title">Gestión de Turnos Ciudadanos EPS</h1>
<p className="auth-card__subtitle">
Ingresa con tu documento y contraseña para continuar.
</p>
</header>
{error && <div className="auth-alert">{error}</div>}
<form onSubmit={handleSubmit}>
<div className="auth-card__group">
<label className="auth-label" htmlFor="doc">Número de identificación</label>
<input
id="doc"
className="auth-input"
type="text"
autoComplete="username"
placeholder="Ingresa tu número"
value={documento}
onChange={e => setDocumento(e.target.value)}
required
/>
</div>
<div className="auth-card__group">
<label className="auth-label" htmlFor="pwd">Contraseña</label>
<input
id="pwd"
className="auth-input"
type="password"
autoComplete="current-password"
placeholder="Ingresa tu contraseña"
value={password}
onChange={e => setPassword(e.target.value)}
required
minLength={6}
/>
</div>
<button className="auth-btn" type="submit" disabled={loading}>
{loading ? 'Ingresando' : 'Iniciar sesión'}
</button>
</form>
<p className="auth-footer">
¿No tienes cuenta?
<Link to="/register" className="auth-link">Regístrate</Link>
</p>
</section>
</main>
);
}