import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useApp } from '../state/AppContext'
import { useAuth } from '../context/AuthContext'
import '../styles/agendar-head.css'

export default function Agendar(){

 const { data } = useApp()
  const { user, logout } = useAuth()



// Config base (sedes, especialidades, profesionales)

const cfg = data.getConfig()

// Estado del formulario

const [sede, setSede] = useState(cfg.sedes[0] || '')

const [especialidad, setEsp] = useState(cfg.especialidades[0] || '')

const [prof, setProf] = useState('')

const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10))

const [hora, setHora] = useState('08:00')

// NUEVO: slots del día e indicador de selección

const [slots, setSlots] = useState([]);      // [{time:'08:00', status:'free'|'taken'}]

// Mensaje de confirmación (ANTES SE LLAMABA "ok")

const [message, setMessage] = useState('')

// Filtra profesionales según sede + especialidad

const opcionesProf = useMemo(() => {

return cfg.profesionales.filter(

(p) => p.especialidad === especialidad && p.sede === sede

)

}, [cfg, sede, especialidad])

// Cuando cambian filtros, setear el primer profesional disponible

useEffect(() => {

setProf(opcionesProf[0]?.id || '')

}, [opcionesProf])

// NUEVO: refrescar slots

useEffect(()=>{

if (!prof || !fecha) { setSlots([]); return; }

const s = data.availableSlots({ profId: prof, dateISO: fecha });

setSlots(s);

// si la hora actual está tomada, autoselecciona la primera libre

const firstFree = s.find(x=>x.status==='free');

if (firstFree) setHora(firstFree.time);

}, [prof, fecha, data])

// Crear turno

const crear = (e) => {

e.preventDefault();

setMessage('');

try{

 const t = data.crearTurno({

  userId: user?.doc || 'anon',

sede, especialidad, profesional: prof,

fechaISO: fecha, hora

});

setMessage(` Turno #${t.id.slice(0,6)} creado. Te llevamos a la Sala de Espera`);

 setTimeout(()=> window.location.href='/room', 1200);

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

<nav className="ag-bc" aria-label="breadcrumb">

<Link to="/" className="ag-bc-link">Inicio</Link>

<span className="ag-bc-sep">/</span>

<Link to="/agendar" aria-current="page" className="ag-bc-link is-current">Agendar</Link>

</nav>

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

<select value={sede} onChange={(e)=>setSede(e.target.value)}>

{cfg.sedes.map((x) => (

<option key={x} value={x}>{x}</option>

))}

</select>

</div>

<div className="stack">

<label>Especialidad</label>

<select value={especialidad} onChange={(e)=>setEsp(e.target.value)}>

{cfg.especialidades.map((x) => (

<option key={x} value={x}>{x}</option>

))}

</select>

</div>

</div>

<div className="card stack">

<h3>Profesionales disponibles</h3>

{opcionesProf.map((p) => (

<div key={p.id} className="prof">{p.nombre} - {p.especialidad}</div>

))}

</div>

</div>

<div className="card stack" style={{marginTop:20}}>

<h3>Paso 2 de 3  Seleccionar Profesional</h3>

<div className="stack">

<label>Profesional</label>

<select value={prof} onChange={(e)=>setProf(e.target.value)}>

{opcionesProf.map((p) => (

<option key={p.id} value={p.id}>{p.nombre}</option>

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

<button className="btn primary block">Agendar Turno</button>

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