-- NutriWay: estrutura inicial do banco para executar no SQL Editor do Supabase.
-- Contas e autenticacao ficam no Supabase Auth; profissionais usam auth.users.id.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text,
  phone text,
  avatar_url text,
  professional_license text,
  specialty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patients (
  id bigint generated always as identity primary key,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  preferred_name text,
  birth_date date,
  photo_url text,
  goal text,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patient_health_profiles (
  patient_id bigint primary key references public.patients (id) on delete cascade,
  bowel_habits text,
  smoker boolean,
  sleep_hours numeric(4, 1) check (sleep_hours is null or sleep_hours >= 0),
  alcohol_use boolean,
  marital_status text,
  physical_activity text,
  race text,
  social_notes text,
  pathologies text,
  medications text,
  updated_at timestamptz not null default now()
);

create table public.consultations (
  id bigint generated always as identity primary key,
  patient_id bigint not null references public.patients (id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60
    check (duration_minutes between 1 and 1440),
  consultation_type text not null default 'avaliação',
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  motivation text,
  expectations text,
  clinical_goals text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meal_plans (
  id bigint generated always as identity primary key,
  patient_id bigint not null references public.patients (id) on delete cascade,
  title text not null default 'Plano alimentar',
  is_current boolean not null default true,
  starts_on date,
  ends_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create unique index meal_plans_one_current_per_patient
  on public.meal_plans (patient_id)
  where is_current;

create table public.meals (
  id bigint generated always as identity primary key,
  meal_plan_id bigint not null references public.meal_plans (id) on delete cascade,
  name text not null,
  meal_time time,
  sort_order integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meal_items (
  id bigint generated always as identity primary key,
  meal_id bigint not null references public.meals (id) on delete cascade,
  description text not null,
  quantity text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.patient_progress (
  id bigint generated always as identity primary key,
  patient_id bigint not null references public.patients (id) on delete cascade,
  recorded_at timestamptz not null default now(),
  weight_kg numeric(6, 2) check (weight_kg is null or weight_kg > 0),
  height_cm numeric(5, 2) check (height_cm is null or height_cm > 0),
  adherence_percentage numeric(5, 2)
    check (adherence_percentage is null or adherence_percentage between 0 and 100),
  notes text,
  created_at timestamptz not null default now()
);

create index patients_owner_name_idx on public.patients (owner_id, full_name);
create index consultations_patient_date_idx on public.consultations (patient_id, scheduled_at);
create index meals_plan_order_idx on public.meals (meal_plan_id, sort_order);
create index meal_items_meal_order_idx on public.meal_items (meal_id, sort_order);
create index patient_progress_patient_date_idx on public.patient_progress (patient_id, recorded_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

create trigger patient_health_profiles_set_updated_at
before update on public.patient_health_profiles
for each row execute function public.set_updated_at();

create trigger consultations_set_updated_at
before update on public.consultations
for each row execute function public.set_updated_at();

create trigger meal_plans_set_updated_at
before update on public.meal_plans
for each row execute function public.set_updated_at();

create trigger meals_set_updated_at
before update on public.meals
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
grant execute on function public.create_profile_for_new_user() to supabase_auth_admin;

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.patient_health_profiles enable row level security;
alter table public.consultations enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.patient_progress enable row level security;

create policy "Professionals can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Professionals can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Professionals can create their own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "Professionals manage their patients"
  on public.patients for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Professionals manage patient health profiles"
  on public.patient_health_profiles for all to authenticated
  using (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ));

create policy "Professionals manage patient consultations"
  on public.consultations for all to authenticated
  using (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ));

create policy "Professionals manage patient meal plans"
  on public.meal_plans for all to authenticated
  using (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ));

create policy "Professionals manage meals for their patients"
  on public.meals for all to authenticated
  using (exists (
    select 1
    from public.meal_plans mp
    join public.patients p on p.id = mp.patient_id
    where mp.id = meal_plan_id and p.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1
    from public.meal_plans mp
    join public.patients p on p.id = mp.patient_id
    where mp.id = meal_plan_id and p.owner_id = (select auth.uid())
  ));

create policy "Professionals manage items for their patients"
  on public.meal_items for all to authenticated
  using (exists (
    select 1
    from public.meals m
    join public.meal_plans mp on mp.id = m.meal_plan_id
    join public.patients p on p.id = mp.patient_id
    where m.id = meal_id and p.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1
    from public.meals m
    join public.meal_plans mp on mp.id = m.meal_plan_id
    join public.patients p on p.id = mp.patient_id
    where m.id = meal_id and p.owner_id = (select auth.uid())
  ));

create policy "Professionals manage progress for their patients"
  on public.patient_progress for all to authenticated
  using (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.patients p
    where p.id = patient_id and p.owner_id = (select auth.uid())
  ));

revoke all on public.profiles, public.patients, public.patient_health_profiles,
  public.consultations, public.meal_plans, public.meals, public.meal_items,
  public.patient_progress from anon, public;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.patients,
  public.patient_health_profiles, public.consultations, public.meal_plans,
  public.meals, public.meal_items, public.patient_progress to authenticated;
grant usage, select on sequence
  public.patients_id_seq,
  public.consultations_id_seq,
  public.meal_plans_id_seq,
  public.meals_id_seq,
  public.meal_items_id_seq,
  public.patient_progress_id_seq
to authenticated;
