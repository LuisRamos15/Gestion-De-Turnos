import * as s from './storage'
import { SLOT_MIN, RANGES, SAMPLE_USERS, SAMPLE_CONFIG, SAMPLE_TURNOS } from '../config/bookingData.js'

// === Slots de agenda (laboral simulado) ===

function toMinutes(hhmm){

const [h,m] = hhmm.split(':').map(Number); return h*60+m;

}

function pad(n){ return n.toString().padStart(2,'0') }

function fromMinutes(min){ const h=Math.floor(min/60), m=min%60; return `${pad(h)}:${pad(m)}` }

export function defaultSlots(){

const out=[];

for(const r of RANGES){

let cur = toMinutes(r.start), end = toMinutes(r.end);

while(cur <= end){

out.push(fromMinutes(cur));

cur += SLOT_MIN;

}

}

// elimina el último si coincide exacto con end (no inicio de cita)

if (out.length && out.at(-1) === RANGES[0].end) out.pop();

return out;

}

export function generateSlots(fechaISO){

const fecha = new Date(fechaISO); const dia = fecha.getDay(); if(dia===0 || dia===6) return [] // fin de semana

const slots = []

for(const r of RANGES){

const startMin = toMinutes(r.start), endMin = toMinutes(r.end)

for(let m=startMin; m<endMin; m+=SLOT_MIN){

slots.push(fromMinutes(m))

}

}

return slots

}

export function getBookedSlots(profId, dateISO){

return listTurnos()

.filter(t => t.profesional === profId && (t.fechaISO || '').slice(0,10) === dateISO && t.estado !== 'cancelado')

.map(t => t.hora);

}

export function availableSlots({ profId, dateISO }){

const base = defaultSlots();

const taken = new Set(getBookedSlots(profId, dateISO));

return base.map(time => ({ time, status: taken.has(time) ? 'taken' : 'free' }));

}

const KEYS = {
  users: 'users',
  session: 'usuario',
  config: 'config',
  turnos: 'eps_tickets'
}

export function seed(){

if(!s.read(KEYS.users)){

s.write(KEYS.users, SAMPLE_USERS)

}

if(!s.read(KEYS.config)){

s.write(KEYS.config, SAMPLE_CONFIG)

}

 if(s.read(KEYS.turnos, []).length === 0){
   const ahora = new Date()
   const base = ahora.toISOString()
   const turnos = []
   turnos.push({ id: crypto.randomUUID(), userId:'cc-100', sede:'Clínica Central', especialidad:'Cardiología', profesional:'Dr. Suárez', fechaISO: base, hora:'08:00', estado:'pendiente', createdAtISO: base })
   turnos.push({ id: crypto.randomUUID(), userId:'cc-100', sede:'Clínica Norte', especialidad:'Dermatología', profesional:'Dra. Niño', fechaISO: base, hora:'08:30', estado:'finalizado', createdAtISO: base })
   turnos.push({ id: crypto.randomUUID(), userId:'cc-100', sede:'Clínica Norte', especialidad:'Dermatología', profesional:'Dra. Niño', fechaISO: base, hora:'10:00', estado:'pendiente', createdAtISO: base })
   s.write(KEYS.turnos, turnos)
 }

}

// sesión

export const getSession = ()=> s.read(KEYS.session, null)

export const setSession = (u)=> s.write(KEYS.session, u)

export const saveSession = setSession

export const logout = ()=> s.remove(KEYS.session)

function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '') }

export function registerUser({nombre, documento, email, password, rol = 'ciudadano'}){

if(!nombre?.trim()) throw new Error('El nombre es obligatorio.')

if(!documento?.trim()) throw new Error('El documento es obligatorio.')

if(!password?.trim()) throw new Error('La contraseña es obligatoria.')

if(password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.')

if(!isEmail(email)) throw new Error('Correo electrónico inválido.')

const users = s.read(KEYS.users, [])

if(users.some(u=>u.documento===documento)) throw new Error('Documento ya registrado')

if(users.some(u=>u.email===email)) throw new Error('Email ya registrado')

const u = {id:`cc-${documento}`, rol, nombre: nombre.trim(), email: email.trim(), documento: documento.trim(), password}

users.push(u); s.write(KEYS.users, users); setSession(u); return u

}

export function login(documento, password){

const u = s.read(KEYS.users, []).find(u=>u.documento===documento && u.password===password)

if(!u) throw new Error('Credenciales inválidas')

setSession(u); return u

}

export function loginUser({ documento, password }){

if(!documento?.trim() || !password?.trim()) throw new Error('Documento y contraseña son obligatorios.')

const users = s.read(KEYS.users, [])

const u = users.find(x => x.documento === documento && x.password === password)

if(!u) throw new Error('Credenciales inválidas.')

return u

}

export const listTurnos = ()=> s.read(KEYS.turnos, [])

export const saveTurnos = (arr)=> s.write(KEYS.turnos, arr)

export function crearTurno({userId, sede, especialidad, profesional, fechaISO, hora}){

// validación anti doble reserva

const yaOcupada = listTurnos().some(t =>

t.profesional === profesional &&

(t.fechaISO || '').slice(0,10) === (fechaISO || '').slice(0,10) &&

t.hora === hora &&

t.estado !== 'cancelado'

);

if (yaOcupada) throw new Error('Esa franja ya fue reservada por otro usuario.');

const t = {

id: crypto.randomUUID(),

userId, sede, especialidad, profesional,

fechaISO, hora, estado:'pendiente',

createdAtISO: new Date().toISOString()

};

const arr = listTurnos(); arr.push(t); saveTurnos(arr); return t;

}

export function actualizarTurno(id, patch){

const arr = listTurnos(); const i = arr.findIndex(t=>t.id===id)

if(i>=0){ arr[i] = {...arr[i], ...patch}; saveTurnos(arr); return arr[i] }

return null

}

export const getConfig = ()=> s.read(KEYS.config)

export function kpis(){

 const tickets = listTurnos()

 const latest = [...tickets]

 .sort((a, b) => new Date(b?.createdAtISO || b?.inicio || 0) - new Date(a?.createdAtISO || a?.inicio || 0))

 .slice(0, 6);

 const atendidos = latest.filter(t => t?.estado === "finalizado").length;

 const pendientes = latest.filter(t => t?.estado === "pendiente" || t?.estado === "en_atencion").length;

 const cancelados = latest.filter(t => t?.estado === "cancelado").length;

 const total = latest.length || 1;

 const tasaCancel = Math.round((cancelados / total) * 100);

 const durables = latest.filter(t => t?.inicio && t?.fin);

 const avgMs = durables.length

 ? durables.reduce((acc, t) => acc + (new Date(t.fin) - new Date(t.inicio)), 0) / durables.length

 : 15 * 60 * 1000;

 const tiempoProm = Math.max(1, Math.round(avgMs / 60000));

 return { atendidos, pendientes, tasaCancel, tiempoProm }

}