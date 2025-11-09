import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    document: "",
    email: "",
    password: "",
    role: "citizen",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(""); // limpia error visible
    try {
      // Validaciones básicas (sin back)
      if (!form.fullName || !form.document || !form.password) {
        setErrorMsg("Todos los campos obligatorios deben estar completos.");
        return;
      }
      if (form.password.length < 6) {
        setErrorMsg("La contraseña debe tener mínimo 6 caracteres.");
        return;
      }
      // Simulación de registro OK (NO iniciar sesión aquí)
      // ...aquí guardarías en API o local, si quisieras
      nav("/login", { replace: true });
    } catch (err) {
      // Nunca uses 'error' sin declararlo. Usa err y muéstralo de forma segura.
      setErrorMsg("Ocurrió un problema al registrar. Intenta nuevamente.");
      console.error(err);
    }
  };

  return (
    <div className="page-center">
      <form className="card max-w-md w-full" onSubmit={onSubmit}>
        <h1 className="h4 mb-3">Crear cuenta</h1>
        {errorMsg && (
          <div className="alert alert-danger mb-3">{errorMsg}</div>
        )}
        <label className="label">Nombre completo</label>
        <input
          className="input mb-2"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          placeholder="Tu nombre"
        />
        <label className="label">Número de documento</label>
        <input
          className="input mb-2"
          name="document"
          value={form.document}
          onChange={onChange}
          placeholder="123456789"
        />
        <label className="label">Correo (opcional)</label>
        <input
          className="input mb-2"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="tucorreo@correo.com"
        />
        <label className="label">Contraseña</label>
        <input
          className="input mb-4"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Mínimo 6 caracteres"
        />
        {/* selector de rol visible solo en demo */}
        <label className="label">Rol (solo demo)</label>
        <select
          className="input mb-4"
          name="role"
          value={form.role}
          onChange={onChange}
        >
          <option value="citizen">Ciudadano</option>
          <option value="admin">Administrador</option>
        </select>
        <button className="btn btn-brand w-full" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
}