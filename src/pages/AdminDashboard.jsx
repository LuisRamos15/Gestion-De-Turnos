import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';

import Section from '../components/Section'

import KPIs from '../components/KPIs'

import { listTurnos } from '../lib/db'

const chipClass = (s) =>
  s === "Activo"
    ? "btn btn-info btn-sm"
    : s === "Pendiente"
    ? "btn btn-outline-secondary btn-sm"
    : "btn btn-outline-warning btn-sm";

export default function AdminDashboard(){

const { logout } = useAuth?.() || { logout: () => {} };

const [systemStatus] = useState(() => JSON.parse(localStorage.getItem("eps_system_status") || "null") || { citas: "Activo", telemedicina: "Pendiente", pagos: "Saturado" });

const ultimos = listTurnos().slice(-6).reverse()

return (

<Section subtitle="Resumen del día">

<div className="d-flex align-items-center justify-content-between mb-3">
  <h1 className="h3 m-0">Dashboard Administrativo</h1>
  <div className="d-flex gap-2">
    <Link to="/sala" className="btn btn-outline-info btn-sm">Sala</Link>
    <button type="button" onClick={logout} className="btn btn-outline-danger btn-sm">Salir</button>
  </div>
</div>

<KPIs/>

<div className="two-col" style={{ marginTop: 16 }}>

{/* Card: últimos turnos */}

<div className="card">

<h3 style={{ marginTop: 0 }}>últimos turnos</h3>

{ultimos.length === 0 && (

<div className="subtitle">Aún no hay turnos generados.</div>

)}

 {ultimos.map((t) => (

 <div key={t.id} className="d-flex align-items-center justify-content-between border-bottom py-2">

 <div>

 <span className="text-muted">#{t.id}</span>{" "}

 {t?.especialidad || ""}{" "}

 {t?.sede ? ` ${t.sede}` : ""}

 </div>

 <div className="text-muted small">{t?.estado || ""}</div>

 </div>

 ))}

</div>

 {/* Card: Estado del Sistema */}

 <div className="card">

 <h3 style={{ marginTop: 0 }}>Estado del Sistema</h3>

 <div className="d-flex flex-wrap gap-2">

 <span className={chipClass(systemStatus.citas)}>Plataforma de Citas {systemStatus.citas}</span>

 <span className={chipClass(systemStatus.telemedicina)}>Telemedicina {systemStatus.telemedicina}</span>

 <span className={chipClass(systemStatus.pagos)}>Portal de Pagos {systemStatus.pagos}</span>

 </div>

 </div>

</div>

</Section>

)

}