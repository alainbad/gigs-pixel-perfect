alter table public.jobs
  add column if not exists currency text not null default 'USD' check (currency in ('USD', 'EUR', 'GBP', 'AED')),
  add column if not exists employment_type text not null default 'Full-time' check (employment_type in ('Full-time', 'Part-time')),
  add column if not exists work_mode text not null default 'Remote' check (work_mode in ('On-site', 'Remote', 'Hybrid'));
