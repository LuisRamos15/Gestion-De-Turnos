import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useApp } from '../state/AppContext'
import { useAuth } from '../context/AuthContext'
import { CLINICS, SPECIALTIES, PROFESSIONALS } from '../config/bookingData'
import '../styles/agendar-head.css'

export default function Agendar(){

  const { data } = useApp()
    const { user, logout } = useAuth()

  // Estado del formulario

 const [clinic, setClinic] = useState("")

 const [specialty, setSpecialty] = useState("")

 const [professional, setProfessional] = useState("")

 const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10))

 const [hora, setHora] = useState('08:00')

 // Resets en cascada

 const onChangeClinic = (e) => {
   const value = e.target.value;
   setClinic(value);
   setSpecialty("");
   setProfessional("");
 };

 const onChangeSpecialty = (e) => {
   const value = e.target.value;
   setSpecialty(value);
   setProfessional("");
 };

 // Opciones derivadas

 const availableProfessionals = (clinic && specialty && PROFESSIONALS[clinic]?.[specialty]) || [];

// NUEVO: slots del día e indicador de selección

const [slots, setSlots] = useState([]);      // [{time:'08:00', status:'free'|'taken'}]

// Mensaje de confirmación (ANTES SE LLAMABA "ok")

const [message, setMessage] = useState('')



 // NUEVO: refrescar slots

 useEffect(()=>{

 if (!professional || !fecha) { setSlots([]); return; }

 const s = data.availableSlots({ profId: professional, dateISO: fecha });

 setSlots(s);

 // si la hora actual está tomada, autoselecciona la primera libre

 const firstFree = s.find(x=>x.status==='free');

 if (firstFree) setHora(firstFree.time);

 }, [professional, fecha, data])

 // Crear turno

 const crear = (e) => {

 e.preventDefault();

 setMessage('');

 try{

  const t = data.crearTurno({

   userId: user?.doc || 'anon',

 sede: clinic, especialidad: specialty, profesional: professional,

 fechaISO: fecha, hora

 });

 setMessage(` Turno #${t.id.slice(0,6)} creado. Te llevamos a la Sala de Espera`);

  setTimeout(()=> window.location.href='/sala', 1200);

 }catch(err){

 setMessage(` ${err.message}`);

 }

 }

  return (

  <div className="ag-page">

{/* === TOPBAR ===================================================== */}

<div className="ag-topbar">

<div className="ag-brand">

<span className="ag-logo-dot" />

<span className="ag-brand-text">Gestión de Turnos <b>EPS</b></span>

</div>

<div className="ag-actions">

<Link to="/sala" className="ag-btn ag-btn-ghost">Sala</Link>

<button onClick={logout} className="ag-btn ag-btn-outline-danger">

Salir

</button>

</div>

</div>

{/* === BREADCRUMB ================================================= */}

<ul className="page-breadcrumb">
<li><Link to="/agendar" className="crumb">Inicio</Link></li>
<li><span className="crumb active">Agendar</span></li>
</ul>

{/* === TíTULO ===================================================== */}

<header className="ag-head">

<h1 className="ag-title">Agendar turno</h1>

<p className="ag-subtitle">Paso 1 de 3  Sede y Especialidad</p>

</header>

<div className="stack">

<div className="two-col">

<div className="card stack">

 <div className="stack">

 <label>Sede de atención</label>

 <select className="form-select" value={clinic} onChange={onChangeClinic}>

 <option value="" disabled>Seleccione sede</option>

 {CLINICS.map((c) => (

 <option key={c} value={c}>{c}</option>

 ))}

 </select>

 </div>

 <div className="stack">

 <label>Especialidad</label>

 <select className="form-select" value={specialty} onChange={onChangeSpecialty} disabled={!clinic}>

 <option value="" disabled>Seleccione especialidad</option>

 {SPECIALTIES.map((s) => (

 <option key={s} value={s}>{s}</option>

 ))}

 </select>

 </div>

</div>

 <div className="card stack">

 <h3>Profesionales disponibles</h3>

 {clinic && specialty ? (

 availableProfessionals.length > 0 ? (

 <ul className="list-unstyled m-0">

 {availableProfessionals.map((p) => (

 <li key={p}>{p} - {specialty}</li>

 ))}

 </ul>

 ) : (

 <span className="text-muted">No hay profesionales para esta combinación.</span>

 )

 ) : (

 <span className="text-muted">Selecciona sede y especialidad para ver profesionales.</span>

 )}

 </div>

</div>

<div className="card stack" style={{marginTop:20}}>

<h3>Paso 2 de 3  Seleccionar Profesional</h3>

 <div className="stack">

 <label>Profesional</label>

 <select className="form-select" value={professional} onChange={(e) => setProfessional(e.target.value)} disabled={availableProfessionals.length === 0}>

 <option value="" disabled>Seleccione profesional</option>

 {availableProfessionals.map((p) => (

 <option key={p} value={p}>{p}</option>

 ))}

 </select>

 </div>

</div>

<div className="card stack" style={{marginTop:20}}>

<h3>Paso 3 de 3  Fecha y Hora</h3>

<form className="stack" onSubmit={crear}>

<div className="row" style={{gap:12}}>

<div className="stack" style={{flex:1}}>

<label>Fecha</label>

<input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} />

</div>

 <div className="stack" style={{flex:1}}>

<label>Hora</label>

{/* Mantén un input sólo lectura como eco de selección */}

<input value={hora} readOnly />

</div>

</div>

{/* Grid de franjas disponibles */}

<div className="slots">

{slots.map(s=>(

<button

key={s.time}

type="button"

className={`slot ${s.status==='taken'?'disabled':''} ${hora===s.time?'selected':''}`}

disabled={s.status==='taken'}

onClick={()=> setHora(s.time)}

title={s.status==='taken' ? 'Ocupada' : 'Disponible'}

>

{s.time}

</button>

))}

</div>

 {message ? <div className="subtitle">{message}</div> : null}

 <button className="btn primary block" disabled={!clinic || !specialty || !professional}>Agendar Turno</button>

</form>

</div>

<div className="card">

<div className="subtitle">

Consejo  La espera estimada se aproxima como (turnos pendientes  5 min).

  </div>

</div>

  </div>

  </div>

 )

}