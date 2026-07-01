alter table public.freelancer_profiles
  add column if not exists cv_path text;

-- CVs are private: only the owner can read/write their own file.
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

create policy "Users can upload their own CV"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can read their own CV"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own CV"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own CV"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

-- Project reference files are public (portfolio pieces meant to be shown),
-- but only the owner can upload/modify/delete their own.
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

create policy "Anyone can view project files"
  on storage.objects for select
  to public
  using (bucket_id = 'project-files');

create policy "Users can upload their own project files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own project files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own project files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.project_references (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  file_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.project_references enable row level security;

create policy "Freelancers can read their own project references"
  on public.project_references for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Freelancers can insert their own project references"
  on public.project_references for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Freelancers can update their own project references"
  on public.project_references for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Freelancers can delete their own project references"
  on public.project_references for delete
  to authenticated
  using (auth.uid() = user_id);
