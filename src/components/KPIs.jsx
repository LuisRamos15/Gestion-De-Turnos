import { useEffect, useState } from 'react'

import { kpis as getKpis } from '../lib/db'

export default function KPIs(){

const [kpi, setKpi] = useState(getKpis())

useEffect(()=>{ const fn = ()=> setKpi(getKpis()); window.addEventListener('sim-tick', fn); return ()=> window.removeEventListener('sim-tick', fn) },[])

return (

<div className="kpis">

<div className="kpi"><h3>Turnos atendidos</h3><div className="num">{kpi.atendidos}</div></div>

<div className="kpi"><h3>Turnos pendientes</h3><div className="num">{kpi.pendientes}</div></div>

<div className="kpi"><h3>Tasa de cancelación</h3><div className="num">{kpi.tasaCancel}%</div></div>

<div className="kpi"><h3>Tiempo promedio</h3><div className="num">{kpi.tiempoProm} min</div></div>

</div>

)

}