export const read = (k, def=null)=>{

const raw = localStorage.getItem(k)

if(!raw) return def

try{ return JSON.parse(raw) } catch{ return def }

}

export const write = (k, v)=> localStorage.setItem(k, JSON.stringify(v))

 export const remove = (k)=> localStorage.removeItem(k)

export function saveSession(user){

localStorage.setItem('session', JSON.stringify({

id:user.id, doc:user.doc, nombre:user.nombre, rol:user.rol

}))

}

export function readSession(){

try { return JSON.parse(localStorage.getItem('session') || 'null') } catch { return null }

}

export function clearSession(){ localStorage.removeItem('session') }