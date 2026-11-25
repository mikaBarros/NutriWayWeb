export type PatientStatus = 'active' | 'inactive' | 'archived';

export interface PatientSummary {
  id: number;
  name: string;
  photo: string;
}

export interface Patient extends PatientSummary {
  fullName: string;
  age: number | null;
  birth: string;
  goal: string;
  progress: number;
  status: PatientStatus;
}

export interface PatientDetails {
  intestinal?: string;
  smoker?: string;
  sleep?: string;
  alcohol?: string;
  marital?: string;
  activity?: string;
  race?: string;
  other?: string;
  pathologies?: string;
  medication?: string;
}

export interface PatientResponse extends Patient {
  details: PatientDetails;
}

export interface Meal {
  id: number;
  time: string;
  meal: string;
  items: string[];
}

export interface MealPlanResponse {
  patientId: number;
  title: string;
  meals: Meal[];
}

export interface Consultation {
  id: number;
  patientId: number;
  patientName: string;
  scheduledAt: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
}

export interface ProfessionalProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  professionalLicense: string;
  avatarUrl: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  error?: string;
  user: {
    name: string;
    role: string;
  } | null;
}

export interface NewPatientInput {
  fullName: string;
  preferredName?: string;
  birthDate?: string;
  goal?: string;
  status?: PatientStatus;
}
