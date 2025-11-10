import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    email: "",
    password: "",
    role: "Ciudadano",
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, documento, email, password, role } = form;
    if (!nombre.trim() || !String(documento).trim() || !password) {
      setError("Completa nombre, documento y contraseña.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!/^\d+$/.test(String(documento))) {
      setError("El documento debe contener solo números.");
      return;
    }
    const raw = localStorage.getItem("users");
    const users = raw ? JSON.parse(raw) : [];
    if (users.some(u => String(u.documento) === String(documento))) {
      setError("Ya existe un usuario con ese número de documento.");
      return;
    }
    users.push({
      id: Date.now(),
      nombre: nombre.trim(),
      documento: String(documento).trim(),
      email: email.trim(),
      password,
      role,
    });
    localStorage.setItem("users", JSON.stringify(users));
    navigate("/login");
  };

  return (
<main className="auth-page">
<section className="auth-card" role="form" aria-labelledby="registerTitle">
<header className="auth-card__header">
<h1 id="registerTitle" className="auth-card__title">Crear cuenta</h1>
<p className="auth-card__subtitle">Completa los campos para registrarte.</p>
</header>
 {error ? <div className="alert alert-error">{error}</div> : null}
<form onSubmit={handleSubmit}>
<div className="auth-card__group">
<label className="auth-label" htmlFor="name">Nombre completo</label>
 <input
 id="name"
 className="auth-input"
 type="text"
 placeholder="Tu nombre"
 name="nombre"
 value={form.nombre}
 onChange={onChange}
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
 name="documento"
 value={form.documento}
 onChange={onChange}
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
 name="email"
 value={form.email}
 onChange={onChange}
 />
</div>
<div className="auth-card__group">
<label className="auth-label" htmlFor="pwd">Contraseña</label>
 <input
 id="pwd"
 className="auth-input"
 type="password"
 placeholder="Mínimo 6 caracteres"
 name="password"
 value={form.password}
 onChange={onChange}
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
 name="role"
 value={form.role}
 onChange={onChange}
 >
<option>Ciudadano</option>
<option>Administrador</option>
</select>
</div>
 <button className="auth-btn" type="submit">
 Registrarse
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