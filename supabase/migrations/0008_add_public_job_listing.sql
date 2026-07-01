-- Job postings are meant to be found by candidates, so they're public by
-- default (unlike freelancer profiles, which require opting in).
create policy "Public can view companies"
  on public.companies for select
  to public
  using (true);

create policy "Public can view jobs"
  on public.jobs for select
  to public
  using (true);
