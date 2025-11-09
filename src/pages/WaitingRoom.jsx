import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Section from '../components/Section'

import { useApp } from '../state/AppContext'
import { useAuth } from '../context/AuthContext'
import '../styles/agendar-head.css'

export default function WaitingRoom(){

 const { data } = useApp()
  const { user, logout } = useAuth()

  const handleLogout = () => logout()

  const [turnos, setTurnos] = useState(data.listTurnos())

  useEffect(()=>{ const fn = ()=> setTurnos(data.listTurnos()); window.addEventListener('sim-tick', fn); return ()=> window.removeEventListener('sim-tick', fn) },[data])

   const mis = useMemo(()=> turnos.filter(t=> t.userId === (user?.doc || 'anon')), [turnos, user])

const ultimo = mis[mis.length-1]

  return (

<div className="ag-page">

<div className="ag-topbar">
  <div className="ag-brand">
    <div className="ag-logo-dot"></div>
    <span className="ag-brand-text">Gestión de Turnos <b>EPS</b></span>
  </div>
  <div className="ag-actions">
    <Link to="/agendar" className="ag-btn ag-btn-ghost">Agendar</Link>
    <Link to="/sala" className="ag-btn ag-btn-ghost">Sala</Link>
    <button onClick={handleLogout} className="ag-btn ag-btn-outline-danger">Salir</button>
  </div>
</div>

  <Section title="Sala de Espera Virtual" subtitle="Actualizaciones en tiempo real (simuladas)">

<div className="card stack">

{ultimo

? (<div>

<div className="subtitle">Tu turno</div>

<div style={{fontSize:40, fontWeight:800}}>#{ultimo.id.slice(0,4)}</div>

<div>Estado: <b>{ultimo.estado}</b></div>

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