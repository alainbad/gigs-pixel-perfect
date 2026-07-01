alter table public.freelancer_profiles
  rename column portfolio_url to linkedin_url;

alter table public.freelancer_profiles
  add column if not exists is_public boolean not null default false,
  add column if not exists phone text,
  add column if not exists contact_email text;

create policy "Public can view publicly-listed freelancer profiles"
  on public.freelancer_profiles for select
  to public
  using (is_public = true);

create policy "Public can view profiles of publicly-listed freelancers"
  on public.profiles for select
  to public
  using (
    exists (
      select 1 from public.freelancer_profiles fp
      where fp.user_id = profiles.id and fp.is_public = true
    )
  );
