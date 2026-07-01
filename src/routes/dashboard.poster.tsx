import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { supabase } from "@/lib/supabase";
import { useRequireRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/poster")({
  head: () => ({
    meta: [{ title: "Job Poster Dashboard — GIGS" }],
  }),
  component: PosterDashboard,
});

type Company = {
  id: string;
  name: string;
  website: string;
  description: string;
};

const CURRENCIES = ["USD", "EUR", "GBP", "AED"] as const;
const EMPLOYMENT_TYPES = ["Full-time", "Part-time"] as const;
const WORK_MODES = ["On-site", "Remote", "Hybrid"] as const;

type Job = {
  id: string;
  title: string;
  description: string;
  budget: string;
  currency: (typeof CURRENCIES)[number];
  employment_type: (typeof EMPLOYMENT_TYPES)[number];
  work_mode: (typeof WORK_MODES)[number];
  skills: string[];
  created_at: string;
};

function PosterDashboard() {
  const navigate = useNavigate();
  const { session, profile, ready } = useRequireRole("poster");

  const [company, setCompany] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState({ name: "", website: "", description: "" });
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    currency: "USD" as (typeof CURRENCIES)[number],
    employment_type: "Full-time" as (typeof EMPLOYMENT_TYPES)[number],
    work_mode: "Remote" as (typeof WORK_MODES)[number],
    skills: "",
  });
  const [postingJob, setPostingJob] = useState(false);

  useEffect(() => {
    if (!ready || !session) return;
    supabase
      .from("companies")
      .select("*")
      .eq("owner_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCompany(data as Company);
          setCompanyForm({ name: data.name ?? "", website: data.website ?? "", description: data.description ?? "" });
        }
        setLoadingCompany(false);
      });
  }, [ready, session]);

  useEffect(() => {
    if (!company) return;
    supabase
      .from("jobs")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setJobs((data as Job[]) ?? []));
  }, [company]);

  async function handleSaveCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSavingCompany(true);

    const { data } = await supabase
      .from("companies")
      .upsert(
        {
          id: company?.id,
          owner_id: session.user.id,
          name: companyForm.name,
          website: companyForm.website,
          description: companyForm.description,
        },
        { onConflict: "owner_id" },
      )
      .select()
      .single();

    if (data) setCompany(data as Company);
    setSavingCompany(false);
  }

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;
    setPostingJob(true);

    const skills = jobForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { data } = await supabase
      .from("jobs")
      .insert({
        company_id: company.id,
        title: jobForm.title,
        description: jobForm.description,
        budget: jobForm.budget,
        currency: jobForm.currency,
        employment_type: jobForm.employment_type,
        work_mode: jobForm.work_mode,
        skills,
      })
      .select()
      .single();

    if (data) {
      setJobs((prev) => [data as Job, ...prev]);
      setJobForm({
        title: "",
        description: "",
        budget: "",
        currency: "USD",
        employment_type: "Full-time",
        work_mode: "Remote",
        skills: "",
      });
    }
    setPostingJob(false);
  }

  async function handleDeleteJob(id: string) {
    await supabase.from("jobs").delete().eq("id", id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p className="mono text-xs uppercase tracking-widest text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Cursor />
      <Nav />
      <section className="pt-32 pb-24 max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-5xl">Your Dashboard.</h1>
          <button
            onClick={handleSignOut}
            className="mono text-xs uppercase tracking-widest text-muted hover:text-accent underline underline-offset-4"
          >
            Sign out
          </button>
        </div>
        <p className="mono text-xs uppercase tracking-widest text-muted mb-10">
          Signed in as {profile?.full_name || session?.user.email}
        </p>

        {loadingCompany ? (
          <p className="mono text-xs uppercase tracking-widest text-muted">Loading company…</p>
        ) : (
          <>
            <h2 className="text-2xl mb-4">Company profile</h2>
            <form onSubmit={handleSaveCompany} className="space-y-6 mb-16">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Company name</div>
                <input
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Website</div>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://"
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Description</div>
                <textarea
                  rows={4}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <button
                type="submit"
                disabled={savingCompany}
                className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
              >
                {savingCompany ? "Saving…" : "Save company"}
              </button>
            </form>

            {company ? (
              <>
                <h2 className="text-2xl mb-4">Post a job</h2>
                <form onSubmit={handlePostJob} className="space-y-6 mb-16">
                  <div>
                    <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Title</div>
                    <input
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Description</div>
                    <textarea
                      rows={4}
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Budget</div>
                    <div className="flex gap-2">
                      <input
                        value={jobForm.budget}
                        onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                        placeholder="e.g. 2,000 - 4,000"
                        className="flex-1 min-w-0 bg-transparent border px-3 py-3 text-sm outline-none"
                        style={{ borderColor: "var(--border)" }}
                      />
                      <div className="grid grid-cols-4 shrink-0">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setJobForm({ ...jobForm, currency: c })}
                            className="text-xs px-3 py-3 border transition-colors"
                            style={{
                              borderColor: "var(--border)",
                              background: jobForm.currency === c ? "var(--ink)" : "transparent",
                              color: jobForm.currency === c ? "var(--paper)" : "var(--ink)",
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Employment type</div>
                      <div className="grid grid-cols-2 gap-1">
                        {EMPLOYMENT_TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setJobForm({ ...jobForm, employment_type: t })}
                            className="text-xs py-3 border transition-colors"
                            style={{
                              borderColor: "var(--border)",
                              background: jobForm.employment_type === t ? "var(--ink)" : "transparent",
                              color: jobForm.employment_type === t ? "var(--paper)" : "var(--ink)",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Work mode</div>
                      <div className="grid grid-cols-3 gap-1">
                        {WORK_MODES.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setJobForm({ ...jobForm, work_mode: m })}
                            className="text-xs py-3 border transition-colors"
                            style={{
                              borderColor: "var(--border)",
                              background: jobForm.work_mode === m ? "var(--ink)" : "transparent",
                              color: jobForm.work_mode === m ? "var(--paper)" : "var(--ink)",
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Skills (comma separated)</div>
                    <input
                      value={jobForm.skills}
                      onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                      placeholder="React, Node.js"
                      className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={postingJob}
                    className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {postingJob ? "Posting…" : "Post job"}
                  </button>
                </form>

                <h2 className="text-2xl mb-4">Your job listings</h2>
                {jobs.length === 0 ? (
                  <p className="mono text-xs uppercase tracking-widest text-muted">No jobs posted yet.</p>
                ) : (
                  <div className="border" style={{ borderColor: "var(--border)" }}>
                    {jobs.map((job, idx) => (
                      <div
                        key={job.id}
                        className={`p-5 flex items-start justify-between gap-4 ${idx > 0 ? "border-t" : ""}`}
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="min-w-0">
                          <div className="text-xl">{job.title}</div>
                          {job.budget && (
                            <div className="mono text-xs text-muted mt-1">
                              {job.currency} {job.budget}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: "var(--border)" }}>
                              {job.employment_type}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: "var(--border)" }}>
                              {job.work_mode}
                            </span>
                          </div>
                          {job.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {job.skills.map((s) => (
                                <span key={s} className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: "var(--border)" }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="mono text-xs uppercase tracking-widest text-muted hover:text-accent shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="mono text-xs uppercase tracking-widest text-muted">
                Save your company profile above to start posting jobs.
              </p>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
