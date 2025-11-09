import Section from '../components/Section'

import KPIs from '../components/KPIs'

import { listTurnos } from '../lib/db'

export default function AdminDashboard(){

const ultimos = listTurnos().slice(-6).reverse()

return (

<Section title="Dashboard Administrativo" subtitle="Resumen del día">

<KPIs/>

<div className="two-col" style={{ marginTop: 16 }}>

{/* Card: últimos turnos */}

<div className="card">

<h3 style={{ marginTop: 0 }}>últimos turnos</h3>

{ultimos.length === 0 && (

<div className="subtitle">Aún no hay turnos generados.</div>

)}

{ultimos.map((t) => (

<div

key={t.id}

className="row"

style={{

justifyContent: 'space-between',

borderBottom: '1px solid #eef2f4',

padding: '8px 0',

}}

>

<div>#{t.id.slice(0, 6)}  {t.especialidad}  {t.sede}</div>

<div style={{ opacity: 0.7 }}>{t.estado}</div>

</div>

))}

</div>

{/* Card: Estado del Sistema */}

<div className="card">

<h3 style={{ marginTop: 0 }}>Estado del Sistema</h3>

<div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>

<span className="btn ghost">Plataforma de Citas  Activo</span>

<span className="btn ghost">Telemedicina  Pendiente</span>

<span className="btn ghost">Portal de Pagos  Saturado</span>

</div>

</div>

</div>

</Section>

)

}