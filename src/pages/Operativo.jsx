import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Operativo(){
  const { data } = useApp();
  const [turnos, setTurnos] = useState(data.listTurnos());

  useEffect(() => {
    const fn = () => setTurnos(data.listTurnos());
    window.addEventListener('sim-tick', fn);
    return () => window.removeEventListener('sim-tick', fn);
  }, [data]);

  const lastServed = turnos
    .filter(t => t.estado === 'finalizado')
    .sort((a, b) => new Date(b.createdAtISO) - new Date(a.createdAtISO))[0];

 return (

 <div className="container">

 <h1>Panel Operativo</h1>

 <div className="card">
   <h3>Módulos del personal operativo</h3>
   {lastServed && (
     <div>
       <strong>Último atendido:</strong> {lastServed.profesional} - {lastServed.especialidad} - {lastServed.sede} - {lastServed.hora}
     </div>
   )}
 </div>

 </div>

 );

 }