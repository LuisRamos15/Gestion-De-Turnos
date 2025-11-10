// Datos estáticos para la aplicación de turnos EPS

export const SLOT_MIN = 30; // minutos por franja

export const RANGES = [
  { start: '08:00', end: '12:00' }, // mañana
  { start: '14:00', end: '17:00' }, // tarde
];

export const SAMPLE_USERS = [
  { id: 'cc-100', rol: 'ciudadano', nombre: 'Ana Ciudadana', email: 'ana@demo.com', documento: '100', password: '123456' },
  { id: 'cc-200', rol: 'operativo', nombre: 'Oscar Operativo', email: 'oscar@demo.com', documento: '200', password: '123456' },
  { id: 'cc-999', rol: 'admin', nombre: 'Ada Admin', email: 'admin@demo.com', documento: '999', password: 'admin123' }
];

export const SAMPLE_CONFIG = {
  sedes: ['Clínica Central', 'Clínica Norte'],
  especialidades: ['Cardiología', 'Neurología', 'Oftalmología', 'Dermatología', 'Pediatría', 'Psicología'],
  profesionales: [
    { id: 'p1', nombre: 'Dra. Rojas', especialidad: 'Oftalmología', sede: 'Clínica Central' },
    { id: 'p2', nombre: 'Dr. Suárez', especialidad: 'Cardiología', sede: 'Clínica Central' },
    { id: 'p3', nombre: 'Dra. Niño', especialidad: 'Dermatología', sede: 'Clínica Norte' }
  ]
};

export const CLINICS = ['Clínica Central', 'Clínica Norte'];

export const SPECIALTIES = ['Cardiología', 'Neurología', 'Oftalmología', 'Dermatología', 'Pediatría', 'Psicología'];

export const PROFESSIONALS = {
  "Clínica Central": {
    Cardiología: ["Dr. Suárez"],
    Neurología: ["Dra. Pérez"],
    Oftalmología: ["Dr. Gómez"],
    Dermatología: ["Dra. Niño"],
    Pediatría: ["Dra. Martínez"],
    Psicología: ["Dr. Rivas"],
  },
  "Clínica Norte": {
    Cardiología: ["Dr. Herrera"],
    Neurología: ["Dra. Salcedo"],
    Oftalmología: ["Dr. Cárdenas"],
    Dermatología: ["Dra. Niño"],
    Pediatría: ["Dr. Zambrano"],
    Psicología: ["Dra. Velasco"],
  },
};

export const SAMPLE_TURNOS = [
  // Ejemplos de turnos para seeding
  // Nota: Las fechas y horas se generan dinámicamente en seed()
];