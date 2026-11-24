// Camada preparada para substituir os mocks por API Routes depois.
// Ex.: API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
import { mealPlan, patientDetails, patients } from '../data/mock';
import type { Meal, Patient, PatientDetails } from '../data/mock';

const USE_MOCK = true;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const wait = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 180));

export type PatientResponse = Partial<Patient> & { details: PatientDetails };

export interface MealPlanResponse {
  patientId: number;
  meals: Meal[];
}

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  user: {
    name: string;
    role: string;
  };
}

export const getPatients = async (): Promise<Patient[]> => {
  if (USE_MOCK) return wait(patients);
  const response = await fetch(`${API_BASE_URL}/api/patients`);
  return response.json() as Promise<Patient[]>;
};

export const getPatient = async (id: string | string[] | number): Promise<PatientResponse> => {
  const patientId = Number(id);
  const patient = patients.find(item => item.id === patientId);

  if (USE_MOCK) {
    return wait({ ...patient, details: patientDetails[patientId] ?? {} });
  }

  const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}`);
  return response.json() as Promise<PatientResponse>;
};

export const getMealPlan = async (patientId: string | string[] | number): Promise<MealPlanResponse> => {
  const id = Number(patientId);

  if (USE_MOCK) return wait({ patientId: id, meals: mealPlan });

  const response = await fetch(`${API_BASE_URL}/api/patients/${id}/meal-plan`);
  return response.json() as Promise<MealPlanResponse>;
};

export const login = async (credentials: Credentials): Promise<LoginResponse> => {
  if (USE_MOCK) {
    return wait({
      ok: Boolean(credentials.email && credentials.password),
      user: { name: 'Rayanne Soares Ribeiro', role: 'Nutricionista' }
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json() as Promise<LoginResponse>;
};
