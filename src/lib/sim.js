import { listTurnos, actualizarTurno, kpis } from './db'

let timer = null

export function start(){

timer = setInterval(()=>{

const arr = listTurnos()

const pendientes = arr.filter(t=>t.estado==='pendiente')

if(pendientes.length){

const t = pendientes.sort((a,b)=> new Date(a.createdAtISO)-new Date(b.createdAtISO))[0]

actualizarTurno(t.id, {estado:'en_atencion'})

}else{

const enAt = arr.find(t=>t.estado==='en_atencion')

if(enAt) actualizarTurno(enAt.id, {estado:'finalizado'})

}

window.dispatchEvent(new CustomEvent('sim-tick', {detail:{kpis: kpis()}}))

}, 20000)

return ()=> clearInterval(timer)

}