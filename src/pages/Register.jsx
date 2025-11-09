import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Ciudadano");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      setLoading(false);
      return;
    }
    if (!documento.trim()) {
      setError("El número de documento es obligatorio");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }
    if (correo && !/\S+@\S+\.\S+/.test(correo)) {
      setError("El correo electrónico no es válido");
      setLoading(false);
      return;
    }
    try {
      await register({ name: nombre.trim(), doc: documento.trim(), email: correo.trim(), password, role: rol === "Ciudadano" ? "citizen" : "admin" });
      setTimeout(()=>navigate("/login", { replace:true }), 800);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error al registrarse");
      setLoading(false);
    }
  };

  return (
<main className="auth-page">
<section className="auth-card" role="form" aria-labelledby="registerTitle">
<header className="auth-card__header">
<h1 id="registerTitle" className="auth-card__title">Crear cuenta</h1>
<p className="auth-card__subtitle">Completa los campos para registrarte.</p>
</header>
{error && <div className="auth-alert">{error}</div>}
<form onSubmit={handleSubmit}>
<div className="auth-card__group">
<label className="auth-label" htmlFor="name">Nombre completo</label>
<input
id="name"
className="auth-input"
type="text"
placeholder="Tu nombre"
value={nombre}
onChange={e => setNombre(e.target.value)}
required
/>
</div>
<div className="auth-card__group">
<label className="auth-label" htmlFor="doc">Número de documento</label>
<input
id="doc"
className="auth-input"
type="text"
placeholder="123456789"
value={documento}
onChange={e => setDocumento(e.target.value)}
required
/>
</div>
<div className="auth-card__group">
<label className="auth-label" htmlFor="mail">Correo (opcional)</label>
<input
id="mail"
className="auth-input"
type="email"
placeholder="tucorreo@correo.com"
value={correo}
onChange={e => setCorreo(e.target.value)}
/>
</div>
<div className="auth-card__group">
<label className="auth-label" htmlFor="pwd">Contraseña</label>
<input
id="pwd"
className="auth-input"
type="password"
placeholder="Mínimo 6 caracteres"
value={password}
onChange={e => setPassword(e.target.value)}
required
minLength={6}
/>
</div>
{/* Mantén tu selector de rol EXACTAMENTE igual */}
<div className="auth-card__group">
<label className="auth-label" htmlFor="rol">Rol (solo demo)</label>
<select
id="rol"
className="auth-input"
value={rol}
onChange={(e) => setRol(e.target.value)}
>
<option>Ciudadano</option>
<option>Administrador</option>
</select>
</div>
<button className="auth-btn" type="submit" disabled={loading}>
{loading ? 'Creando' : 'Registrarse'}
</button>
</form>
<p className="auth-footer">
¿Ya tienes cuenta?
<Link to="/login" className="auth-link">Inicia sesión</Link>
</p>
</section>
</main>
);
}