// Camada preparada para substituir os mocks por Next.js/API Routes depois.
// Ex.: API_BASE_URL = import.meta.env.VITE_API_URL
const USE_MOCK = true;
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

import { patients, patientDetails, mealPlan } from '../data/mock';

const wait = (data) => new Promise(resolve => setTimeout(() => resolve(data), 180));

export async function getPatients() {
  if (USE_MOCK) return wait(patients);
  return fetch(`${API_BASE_URL}/api/patients`).then(r => r.json());
}
export async function getPatient(id) {
  if (USE_MOCK) return wait({ ...patients.find(p => p.id === Number(id)), details: patientDetails[id] || {} });
  return fetch(`${API_BASE_URL}/api/patients/${id}`).then(r => r.json());
}
export async function getMealPlan(patientId) {
  if (USE_MOCK) return wait({ patientId, meals: mealPlan });
  return fetch(`${API_BASE_URL}/api/patients/${patientId}/meal-plan`).then(r => r.json());
}
export async function login(credentials) {
  if (USE_MOCK) return wait({ ok: credentials.email && credentials.password, user: { name: 'Rayanne Soares Ribeiro', role: 'Nutricionista' } });
  return fetch(`${API_BASE_URL}/api/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(credentials) }).then(r => r.json());
}
