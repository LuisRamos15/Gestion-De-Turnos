import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Section from '../components/Section'

import { useApp } from '../state/AppContext'
import { useAuth } from '../context/AuthContext'
import '../styles/agendar-head.css'

/**
 * Derivaciones seguras para métricas de la sala
 * @param {string} myTicketId - id del turno actual del usuario
 * @param {Array} queue - array de turnos pendientes ordenados por creación
 * @param {Array} history - array del historial
 * @param {number} avgWaitMin - promedio de espera por turno en minutos
 * @returns {Object} métricas derivadas: position, ahead, estimatedWaitMin
 */
function deriveRoomMetrics(myTicketId, queue, history, avgWaitMin) {
  const idx = myTicketId ? queue.findIndex(t => t?.id === myTicketId) : -1;
  const position = idx >= 0 ? (idx + 1) : null;
  const ahead = position ? (position - 1) : (queue?.length || 0);
  const etaMin = ahead > 0 ? ahead * avgWaitMin : (position === 1 ? avgWaitMin : 0);
  return { position, ahead, etaMin };
}

const avgWaitMin = typeof window?.EPS_AVG_WAIT_MIN === "number" ? window.EPS_AVG_WAIT_MIN : 5;

export default function WaitingRoom(){

  const { data } = useApp()
   const { user, logout } = useAuth()

   const handleLogout = () => logout()

   const [turnos, setTurnos] = useState(data.listTurnos())

  useEffect(()=>{ const fn = ()=> setTurnos(data.listTurnos()); window.addEventListener('sim-tick', fn); return ()=> window.removeEventListener('sim-tick', fn) },[data])
 
  const mis = useMemo(()=> turnos.filter(t=> t.userId === (user?.doc || 'anon')), [turnos, user])
 
  const hideQuickLinks = true;
 
  const ultimo = mis[mis.length-1]

  const queue = useMemo(() => turnos.filter(t => t.estado === 'pendiente').sort((a, b) => new Date(a.createdAtISO) - new Date(b.createdAtISO)), [turnos])
  const history = mis
   const metrics = ultimo ? deriveRoomMetrics(ultimo.id, queue, history, avgWaitMin) : { position: null, ahead: queue.length, etaMin: 0 }

   const lastServed = turnos.filter(t => t.estado === 'atendido').pop()

  return (

<div className="ag-page">

<div className="ag-topbar">
   <div className="ag-brand">
     <div className="ag-logo-dot"></div>
     <span className="ag-brand-text">Gestión de Turnos <b>EPS</b></span>
   </div>
   {!hideQuickLinks && (
   <div className="ag-actions">
     <Link to="/agendar" className="ag-btn ag-btn-ghost">Agendar</Link>
     <Link to="/sala" className="ag-btn ag-btn-ghost">Sala</Link>
     <button onClick={handleLogout} className="ag-btn ag-btn-outline-danger">Salir</button>
   </div>
   )}
 </div>

   <Section title="Sala de Espera Virtual" subtitle="Actualizaciones en tiempo real (simuladas)">

{/* Acciones de navegación locales de esta vista */}
<div className="d-flex align-items-center justify-content-between mb-3">
  <div className="d-flex align-items-center gap-2">
    {/* Volver: NO reemplaza botones de arriba; es una acción local /agendar */}
    <Link to="/agendar" className="btn btn-outline-secondary">
      Volver a Agendar
    </Link>
  </div>
</div>

{/* Banda de métricas: no cambia estilos globales; usamos badges y cards existentes */}
<div className="row g-3 mb-3">
  <div className="col-6 col-md-3">
    <div className="card h-100">
      <div className="card-body py-3">
        <div className="text-muted small mb-1">Tu posición</div>
        <div className="h4 m-0">{metrics.position ?? ""}</div>
      </div>
    </div>
  </div>
  <div className="col-6 col-md-3">
    <div className="card h-100">
      <div className="card-body py-3">
        <div className="text-muted small mb-1">Turnos por delante</div>
        <div className="h4 m-0">{metrics.ahead ?? ""}</div>
      </div>
    </div>
  </div>
  <div className="col-6 col-md-3">
    <div className="card h-100">
      <div className="card-body py-3">
        <div className="text-muted small mb-1">último atendido</div>
        <div className="h6 m-0">
          {lastServed?.id ? `#${lastServed.id.slice(0,4)}` : ""}
        </div>
      </div>
    </div>
  </div>
  <div className="col-6 col-md-3">
    <div className="card h-100">
      <div className="card-body py-3">
        <div className="text-muted small mb-1">Tiempo estimado</div>
        <div className="h6 m-0">{metrics.etaMin ? `${metrics.etaMin} min` : ""}</div>
      </div>
    </div>
  </div>
</div>

 <div className="card stack">

{ultimo

? (<div>

<div className="subtitle">Tu turno</div>

 <div style={{fontSize:40, fontWeight:800}}>#{ultimo.id.slice(0,4)}</div>

   <div>
     Estado:{" "}
     <span className={`badge ${ultimo.estado === "pendiente" ? "bg-warning-subtle text-dark" : "bg-success-subtle text-dark"}`}>
       {ultimo.estado}
     </span>
   </div>

</div>)

: <div className="subtitle">Aún no has creado un turno.</div>

}

<div className="subtitle">Historial reciente</div>

{mis.slice(-5).reverse().map(t=>(

<div key={t.id} className="row" style={{justifyContent:'space-between', borderBottom:'1px solid #eef2f4', padding:'8px 0'}}>

<div>#{t.id.slice(0,6)}  {t.especialidad} / {t.sede}</div>

<div style={{opacity:.7}}>{t.estado}</div>

</div>

))}

</div>

</Section>

</div>

)

}