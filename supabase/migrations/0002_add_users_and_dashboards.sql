-- Profiles: one row per auth.users, created automatically on signup via trigger below.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('freelancer', 'poster')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up, reading role/full_name
-- from the metadata passed to supabase.auth.signUp({ options: { data } }).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'freelancer'),
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Freelancer (job seeker) dashboard data.
create table if not exists public.freelancer_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  headline text,
  bio text,
  skills text[] not null default '{}',
  portfolio_url text,
  availability text not null default 'Available' check (availability in ('Available', 'Busy', 'Not Available')),
  hourly_rate numeric,
  location text,
  years_experience integer,
  updated_at timestamptz not null default now()
);

alter table public.freelancer_profiles enable row level security;

create policy "Freelancers can read their own profile"
  on public.freelancer_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Freelancers can insert their own profile"
  on public.freelancer_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Freelancers can update their own profile"
  on public.freelancer_profiles for update
  to authenticated
  using (auth.uid() = user_id);

-- Job poster (employer) dashboard data: one company per poster, many jobs per company.
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  website text,
  description text,
  created_at timestamptz not null default now(),
  unique (owner_id)
);

alter table public.companies enable row level security;

create policy "Posters can read their own company"
  on public.companies for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "Posters can insert their own company"
  on public.companies for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Posters can update their own company"
  on public.companies for update
  to authenticated
  using (auth.uid() = owner_id);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text,
  budget text,
  skills text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Posters can read their own jobs"
  on public.jobs for select
  to authenticated
  using (company_id in (select id from public.companies where owner_id = auth.uid()));

create policy "Posters can insert jobs for their own company"
  on public.jobs for insert
  to authenticated
  with check (company_id in (select id from public.companies where owner_id = auth.uid()));

create policy "Posters can update their own jobs"
  on public.jobs for update
  to authenticated
  using (company_id in (select id from public.companies where owner_id = auth.uid()));

create policy "Posters can delete their own jobs"
  on public.jobs for delete
  to authenticated
  using (company_id in (select id from public.companies where owner_id = auth.uid()));
