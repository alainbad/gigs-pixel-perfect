create table if not exists public.fairs (
  id text primary key,
  name text not null,
  host text not null,
  venue text not null,
  city text not null,
  region text not null,
  date text not null,
  iso timestamptz not null,
  format text not null check (format in ('In-Person', 'Hybrid', 'Virtual')),
  employers integer not null default 0,
  openings integer not null default 0,
  attendees integer not null default 0,
  industries text[] not null default '{}',
  status text not null check (status in ('Registration Open', 'Almost Full', 'Waitlist')),
  featured boolean not null default false,
  img text not null default ''
);

alter table public.fairs enable row level security;

create policy "Fairs are publicly readable"
  on public.fairs for select
  to anon, authenticated
  using (true);

insert into public.fairs (id, name, host, venue, city, region, date, iso, format, employers, openings, attendees, industries, status, featured, img)
values
  ('CF-081', 'Gulf Talent Summit', 'Dubai Chamber', 'Madinat Jumeirah', 'Dubai', 'Middle East', '18 Jul 2026', '2026-07-18T09:00:00Z', 'In-Person', 148, 1240, 3400, array['Technology', 'Finance', 'Consulting'], 'Registration Open', true, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200'),
  ('CF-082', 'Frankfurt Finance Forum', 'Deutsche Börse', 'The Squaire', 'Frankfurt', 'Europe', '04 Aug 2026', '2026-08-04T09:00:00Z', 'Hybrid', 96, 720, 2100, array['Finance', 'Consulting', 'Legal'], 'Registration Open', false, 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200'),
  ('CF-083', 'London Creative Register', 'Tate & Partners', 'The Barbican', 'London', 'Europe', '22 Aug 2026', '2026-08-22T10:00:00Z', 'In-Person', 112, 890, 2600, array['Design', 'Media', 'Marketing'], 'Almost Full', false, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200'),
  ('CF-084', 'Singapore Tech Convocation', 'GovTech SG', 'Marina Bay Sands', 'Singapore', 'Asia Pacific', '09 Sep 2026', '2026-09-09T09:00:00Z', 'Hybrid', 174, 1620, 4200, array['Technology', 'Data', 'Engineering'], 'Registration Open', false, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200'),
  ('CF-085', 'Remote Futures Weekend', 'GIGS Global', 'Virtual — worldwide', 'Online', 'Global', '26 Sep 2026', '2026-09-26T00:00:00Z', 'Virtual', 210, 2400, 8800, array['Technology', 'Design', 'Writing', 'Marketing'], 'Registration Open', false, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'),
  ('CF-086', 'New York Prestige Fair', 'Cornell Careers', 'The Plaza', 'New York', 'North America', '14 Oct 2026', '2026-10-14T09:00:00Z', 'In-Person', 132, 980, 2900, array['Finance', 'Consulting', 'Legal', 'Media'], 'Waitlist', false, 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&q=80&w=1200')
on conflict (id) do nothing;
