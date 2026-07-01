import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { AvatarUpload } from "@/components/avatar-upload";
import { supabase } from "@/lib/supabase";
import { useRequireRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/poster")({
  head: () => ({
    meta: [{ title: "Job Poster Dashboard — FreeLand" }],
  }),
  component: PosterDashboard,
});

const EMERALD = "#064e3b";
const EMERALD_MID = "#0d7a5f";
const GOLD = "#c9a84c";
const PARCH = "#f5f0e0";

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

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
    if (profile) setAvatarUrl(profile.avatar_url);
  }, [profile]);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: PARCH, color: EMERALD }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: PARCH, color: EMERALD, fontFamily: '"Work Sans", sans-serif' }}>
      <Cursor />
      <Nav />

      {/* MASTHEAD */}
      <section className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-14 border-b" style={{ borderColor: `${EMERALD}22` }}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-widest uppercase" style={{ color: `${EMERALD}99` }}>
            <span>Job Poster Dashboard</span>
            <button onClick={handleSignOut} className="underline underline-offset-4 hover:text-current" style={{ color: EMERALD_MID }}>
              Sign out
            </button>
          </div>
          <h1 className="mt-8 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Your <span className="italic" style={{ color: EMERALD_MID }}>Dashboard.</span>
          </h1>
          <p className="mt-4 text-sm" style={{ color: `${EMERALD}99` }}>
            Signed in as {profile?.full_name || session?.user.email}
          </p>

          {session && (
            <AvatarUpload
              session={session}
              avatarUrl={avatarUrl}
              onUploaded={setAvatarUrl}
              borderColor={`${EMERALD}33`}
              initialsBg={EMERALD}
              initialsColor={PARCH}
              labelClassName="text-xs uppercase tracking-widest underline underline-offset-4 cursor-pointer"
            />
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        {loadingCompany ? (
          <p className="text-xs uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>Loading company…</p>
        ) : (
          <>
            <h2 className="text-3xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>Company profile</h2>
            <form onSubmit={handleSaveCompany} className="space-y-6 mb-16">
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Company name</div>
                <input
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: `${EMERALD}55` }}
                />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Website</div>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://"
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: `${EMERALD}55` }}
                />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Description</div>
                <textarea
                  rows={4}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: `${EMERALD}55` }}
                />
              </div>
              <button
                type="submit"
                disabled={savingCompany}
                className="w-full py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                style={{ background: GOLD, color: EMERALD }}
              >
                {savingCompany ? "Saving…" : "Save company"}
              </button>
            </form>

            {company ? (
              <>
                <h2 className="text-3xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>Post a job</h2>
                <form onSubmit={handlePostJob} className="space-y-6 mb-16">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Title</div>
                    <input
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: `${EMERALD}55` }}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Description</div>
                    <textarea
                      rows={4}
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: `${EMERALD}55` }}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Budget</div>
                    <div className="flex gap-2">
                      <input
                        value={jobForm.budget}
                        onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                        placeholder="e.g. 2,000 - 4,000"
                        className="flex-1 min-w-0 bg-transparent border px-3 py-3 text-sm outline-none"
                        style={{ borderColor: `${EMERALD}55` }}
                      />
                      <div className="grid grid-cols-4 shrink-0">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setJobForm({ ...jobForm, currency: c })}
                            className="text-xs px-3 py-3 border transition-colors"
                            style={{
                              borderColor: `${EMERALD}55`,
                              background: jobForm.currency === c ? EMERALD : "transparent",
                              color: jobForm.currency === c ? PARCH : EMERALD,
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
                      <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Employment type</div>
                      <div className="grid grid-cols-2 gap-1">
                        {EMPLOYMENT_TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setJobForm({ ...jobForm, employment_type: t })}
                            className="text-xs py-3 border transition-colors"
                            style={{
                              borderColor: `${EMERALD}55`,
                              background: jobForm.employment_type === t ? EMERALD : "transparent",
                              color: jobForm.employment_type === t ? PARCH : EMERALD,
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Work mode</div>
                      <div className="grid grid-cols-3 gap-1">
                        {WORK_MODES.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setJobForm({ ...jobForm, work_mode: m })}
                            className="text-xs py-3 border transition-colors"
                            style={{
                              borderColor: `${EMERALD}55`,
                              background: jobForm.work_mode === m ? EMERALD_MID : "transparent",
                              color: jobForm.work_mode === m ? PARCH : EMERALD,
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Skills (comma separated)</div>
                    <input
                      value={jobForm.skills}
                      onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                      placeholder="React, Node.js"
                      className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: `${EMERALD}55` }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={postingJob}
                    className="w-full py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                    style={{ background: GOLD, color: EMERALD }}
                  >
                    {postingJob ? "Posting…" : "Post job"}
                  </button>
                </form>

                <h2 className="text-3xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>Your job listings</h2>
                {jobs.length === 0 ? (
                  <p className="text-xs uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>No jobs posted yet.</p>
                ) : (
                  <div className="border" style={{ borderColor: `${EMERALD}33` }}>
                    {jobs.map((job, idx) => (
                      <div
                        key={job.id}
                        className={`p-5 flex items-start justify-between gap-4 ${idx > 0 ? "border-t" : ""}`}
                        style={{ borderColor: `${EMERALD}22` }}
                      >
                        <div className="min-w-0">
                          <div className="text-xl" style={{ fontFamily: '"Instrument Serif", serif' }}>{job.title}</div>
                          {job.budget && (
                            <div className="text-xs mt-1" style={{ color: `${EMERALD}99` }}>
                              {job.currency} {job.budget}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: `${EMERALD}44` }}>
                              {job.employment_type}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: `${EMERALD}44` }}>
                              {job.work_mode}
                            </span>
                          </div>
                          {job.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {job.skills.map((s) => (
                                <span key={s} className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: `${EMERALD}44` }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-xs uppercase tracking-widest shrink-0"
                          style={{ color: `${EMERALD}99` }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>
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
