import { createClient } from '../lib/supabase/client';
import type {
  Consultation,
  Credentials,
  LoginResponse,
  Meal,
  MealPlanResponse,
  NewPatientInput,
  Patient,
  PatientDetails,
  PatientResponse,
  PatientStatus,
  ProfessionalProfile
} from './types';

export const DEFAULT_AVATAR =
  'https://img.magnific.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3407.jpg?semt=ais_hybrid&w=740&q=80';

const supabase = () => createClient();

interface PatientRow {
  id: number;
  full_name: string;
  preferred_name: string | null;
  birth_date: string | null;
  photo_url: string | null;
  goal: string | null;
  status: PatientStatus;
}

interface HealthRow {
  bowel_habits: string | null;
  smoker: boolean | null;
  sleep_hours: number | null;
  alcohol_use: boolean | null;
  marital_status: string | null;
  physical_activity: string | null;
  race: string | null;
  social_notes: string | null;
  pathologies: string | null;
  medications: string | null;
}

interface MealItemRow {
  id: number;
  description: string;
  quantity: string | null;
  sort_order: number;
}

interface MealRow {
  id: number;
  name: string;
  meal_time: string | null;
  sort_order: number;
  meal_items: MealItemRow[] | null;
}

interface MealPlanRow {
  id: number;
  title: string;
  meals: MealRow[] | null;
}

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

const calculateAge = (iso: string | null) => {
  if (!iso) return null;
  const birth = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

const mapPatient = (row: PatientRow, progress = 0): Patient => ({
  id: row.id,
  name: row.preferred_name?.trim() || row.full_name,
  fullName: row.full_name,
  photo: row.photo_url || DEFAULT_AVATAR,
  age: calculateAge(row.birth_date),
  birth: formatDate(row.birth_date),
  goal: row.goal ?? '',
  progress,
  status: row.status
});

const mapDetails = (row: HealthRow | null): PatientDetails => {
  if (!row) return {};
  return {
    intestinal: row.bowel_habits ?? undefined,
    smoker: row.smoker === null ? undefined : row.smoker ? 'Sim' : 'Não',
    sleep: row.sleep_hours === null ? undefined : `${row.sleep_hours}`,
    alcohol: row.alcohol_use === null ? undefined : row.alcohol_use ? 'Sim' : 'Não',
    marital: row.marital_status ?? undefined,
    activity: row.physical_activity ?? undefined,
    race: row.race ?? undefined,
    other: row.social_notes ?? undefined,
    pathologies: row.pathologies ?? undefined,
    medication: row.medications ?? undefined
  };
};

const toBoolean = (value?: string) => {
  if (!value) return null;
  if (value === 'Sim') return true;
  if (value === 'Não') return false;
  return null;
};

const toNumber = (value?: string) => {
  if (!value) return null;
  const parsed = Number(value.replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const requireUserId = async () => {
  const {
    data: { user },
    error
  } = await supabase().auth.getUser();
  if (error || !user) throw new Error('Sessão expirada. Faça login novamente.');
  return user.id;
};

export const login = async ({ email, password }: Credentials): Promise<LoginResponse> => {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message, user: null };

  return {
    ok: true,
    user: {
      name: (data.user?.user_metadata?.full_name as string | undefined) ?? data.user?.email ?? '',
      role: 'Nutricionista'
    }
  };
};

export const signUp = async (input: { fullName: string; email: string; password: string }) => {
  const { data, error } = await supabase().auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.fullName } }
  });

  if (error) throw new Error(error.message);
  return { hasSession: Boolean(data.session) };
};

export const logout = async () => {
  await supabase().auth.signOut();
};

export const getPatients = async (): Promise<Patient[]> => {
  const client = supabase();

  const [{ data: patientRows, error }, { data: progressRows }] = await Promise.all([
    client.from('patients').select('*').order('full_name', { ascending: true }),
    client
      .from('patient_progress')
      .select('patient_id, adherence_percentage, recorded_at')
      .order('recorded_at', { ascending: false })
  ]);

  if (error) throw new Error(error.message);

  const progressByPatient = new Map<number, number>();
  for (const row of (progressRows ?? []) as { patient_id: number; adherence_percentage: number | null }[]) {
    if (!progressByPatient.has(row.patient_id) && row.adherence_percentage !== null) {
      progressByPatient.set(row.patient_id, Number(row.adherence_percentage));
    }
  }

  return ((patientRows ?? []) as PatientRow[]).map(row => mapPatient(row, progressByPatient.get(row.id) ?? 0));
};

export const getPatient = async (id: string | string[] | number): Promise<PatientResponse> => {
  const patientId = Number(id);
  const client = supabase();

  const { data: patientRow, error } = await client.from('patients').select('*').eq('id', patientId).single();
  if (error) throw new Error(error.message);

  const [{ data: healthRow }, { data: progressRow }] = await Promise.all([
    client.from('patient_health_profiles').select('*').eq('patient_id', patientId).maybeSingle(),
    client
      .from('patient_progress')
      .select('adherence_percentage')
      .eq('patient_id', patientId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  return {
    ...mapPatient(patientRow as PatientRow, Number(progressRow?.adherence_percentage ?? 0)),
    details: mapDetails(healthRow as HealthRow | null)
  };
};

export const createPatient = async (input: NewPatientInput): Promise<Patient> => {
  const ownerId = await requireUserId();

  const { data, error } = await supabase()
    .from('patients')
    .insert({
      owner_id: ownerId,
      full_name: input.fullName,
      preferred_name: input.preferredName || null,
      birth_date: input.birthDate || null,
      goal: input.goal || null,
      status: input.status ?? 'active'
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapPatient(data as PatientRow);
};

export const savePatientDetails = async (patientId: number, details: PatientDetails) => {
  const { error } = await supabase().from('patient_health_profiles').upsert(
    {
      patient_id: patientId,
      bowel_habits: details.intestinal || null,
      smoker: toBoolean(details.smoker),
      sleep_hours: toNumber(details.sleep),
      alcohol_use: toBoolean(details.alcohol),
      marital_status: details.marital || null,
      physical_activity: details.activity || null,
      race: details.race || null,
      social_notes: details.other || null,
      pathologies: details.pathologies || null,
      medications: details.medication || null
    },
    { onConflict: 'patient_id' }
  );

  if (error) throw new Error(error.message);
};

export const getMealPlan = async (patientId: string | string[] | number): Promise<MealPlanResponse> => {
  const id = Number(patientId);

  const { data, error } = await supabase()
    .from('meal_plans')
    .select(
      'id, title, meals(id, name, meal_time, sort_order, meal_items(id, description, quantity, sort_order))'
    )
    .eq('patient_id', id)
    .eq('is_current', true)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const plan = data as MealPlanRow | null;
  if (!plan) return { patientId: id, title: 'Plano alimentar', meals: [] };

  const meals: Meal[] = [...(plan.meals ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order || (a.meal_time ?? '').localeCompare(b.meal_time ?? ''))
    .map(meal => ({
      id: meal.id,
      time: (meal.meal_time ?? '').slice(0, 5),
      meal: meal.name,
      items: [...(meal.meal_items ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(item => (item.quantity ? `${item.quantity} ${item.description}` : item.description))
    }));

  return { patientId: id, title: plan.title, meals };
};

const ensureCurrentPlan = async (patientId: number) => {
  const client = supabase();

  const { data: existing } = await client
    .from('meal_plans')
    .select('id')
    .eq('patient_id', patientId)
    .eq('is_current', true)
    .maybeSingle();

  if (existing?.id) return existing.id as number;

  const { data: created, error } = await client
    .from('meal_plans')
    .insert({ patient_id: patientId, title: 'Plano alimentar', is_current: true })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return created.id as number;
};

export const addMeal = async (input: {
  patientId: number;
  name: string;
  time?: string;
  items: string[];
}) => {
  const client = supabase();
  const planId = await ensureCurrentPlan(input.patientId);

  const { data: meal, error } = await client
    .from('meals')
    .insert({
      meal_plan_id: planId,
      name: input.name,
      meal_time: input.time || null,
      sort_order: 0
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  const items = input.items.map(item => item.trim()).filter(Boolean);
  if (items.length > 0) {
    const { error: itemsError } = await client
      .from('meal_items')
      .insert(items.map((description, index) => ({ meal_id: meal.id, description, sort_order: index })));

    if (itemsError) throw new Error(itemsError.message);
  }
};

export const getConsultations = async (): Promise<Consultation[]> => {
  const { data, error } = await supabase()
    .from('consultations')
    .select(
      'id, patient_id, scheduled_at, consultation_type, status, notes, patients(full_name, preferred_name)'
    )
    .order('scheduled_at', { ascending: true });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as {
    id: number;
    patient_id: number;
    scheduled_at: string;
    consultation_type: string;
    status: Consultation['status'];
    notes: string | null;
    patients: { full_name: string; preferred_name: string | null } | null;
  }[]).map(row => ({
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patients?.preferred_name?.trim() || row.patients?.full_name || 'Paciente',
    scheduledAt: row.scheduled_at,
    type: row.consultation_type,
    status: row.status,
    notes: row.notes ?? ''
  }));
};

export const createConsultation = async (input: {
  patientId: number;
  scheduledAt: string;
  type: string;
  notes?: string;
}) => {
  const { error } = await supabase().from('consultations').insert({
    patient_id: input.patientId,
    scheduled_at: new Date(input.scheduledAt).toISOString(),
    consultation_type: input.type,
    status: 'scheduled',
    notes: input.notes || null
  });

  if (error) throw new Error(error.message);
};

export const getProfile = async (): Promise<ProfessionalProfile | null> => {
  const client = supabase();
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) return null;

  const { data } = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();

  return {
    id: user.id,
    fullName: data?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? '',
    email: data?.email ?? user.email ?? '',
    phone: data?.phone ?? '',
    specialty: data?.specialty ?? '',
    professionalLicense: data?.professional_license ?? '',
    avatarUrl: data?.avatar_url ?? ''
  };
};

export const saveProfile = async (input: {
  fullName: string;
  phone: string;
  specialty: string;
  professionalLicense: string;
}) => {
  const userId = await requireUserId();

  const { error } = await supabase().from('profiles').upsert(
    {
      id: userId,
      full_name: input.fullName,
      phone: input.phone || null,
      specialty: input.specialty || null,
      professional_license: input.professionalLicense || null
    },
    { onConflict: 'id' }
  );

  if (error) throw new Error(error.message);
};
