create table if not exists public.hire_requests (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references public.profiles (id) on delete cascade,
  poster_name text,
  poster_email text,
  freelancer_id uuid not null references public.profiles (id) on delete cascade,
  project_type text not null,
  budget text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.hire_requests enable row level security;

create policy "Posters can send hire requests"
  on public.hire_requests for insert
  to authenticated
  with check (auth.uid() = poster_id);

create policy "Posters can read requests they sent"
  on public.hire_requests for select
  to authenticated
  using (auth.uid() = poster_id);

create policy "Freelancers can read requests sent to them"
  on public.hire_requests for select
  to authenticated
  using (auth.uid() = freelancer_id);

create policy "Freelancers can update requests sent to them"
  on public.hire_requests for update
  to authenticated
  using (auth.uid() = freelancer_id)
  with check (auth.uid() = freelancer_id);
