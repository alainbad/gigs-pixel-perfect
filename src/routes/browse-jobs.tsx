import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { Search, Briefcase, MapPin } from "lucide-react";
import { getPublicJobs } from "@/lib/jobs.server";

export const Route = createFileRoute("/browse-jobs")({
  head: () => ({
    meta: [
      { title: "Browse Jobs — FreeLand" },
      { name: "description", content: "Browse open roles posted by employers on FreeLand." },
    ],
  }),
  loader: () => getPublicJobs(),
  component: BrowseJobs,
});

const EMPLOYMENT_TYPES = ["All", "Full-time", "Part-time"] as const;
const WORK_MODES = ["All", "On-site", "Remote", "Hybrid"] as const;

function workModeColor(m: string) {
  if (m === "Remote") return "bg-ink/5 text-ink border-ink/30";
  if (m === "Hybrid") return "bg-[color:var(--gold)]/15 text-[#7a6420] border-[color:var(--gold)]/40";
  return "bg-black/5 text-black/60 border-black/20";
}

function BrowseJobs() {
  const { jobs, error } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [employmentType, setEmploymentType] = useState<(typeof EMPLOYMENT_TYPES)[number]>("All");
  const [workMode, setWorkMode] = useState<(typeof WORK_MODES)[number]>("All");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const company = j.companies?.name ?? "";
      if (
        query &&
        !`${j.title} ${company} ${j.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (employmentType !== "All" && j.employment_type !== employmentType) return false;
      if (workMode !== "All" && j.work_mode !== workMode) return false;
      return true;
    });
  }, [jobs, query, employmentType, workMode]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Cursor />
      <Nav active="jobs" />

      <section className="pt-32 pb-16 max-w-[1400px] mx-auto px-6 lg:px-10">
        <h1 className="text-6xl mb-3">Browse Jobs.</h1>
        <p className="mono text-xs uppercase tracking-widest text-muted mb-10">
          {filtered.length} open {filtered.length === 1 ? "role" : "roles"}
        </p>

        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <div className="flex items-center border flex-1" style={{ borderColor: "var(--border)" }}>
            <Search className="w-4 h-4 ml-3 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company, or skill…"
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
            />
          </div>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as (typeof EMPLOYMENT_TYPES)[number])}
            className="bg-transparent border px-3 py-3 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All employment types" : t}
              </option>
            ))}
          </select>
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value as (typeof WORK_MODES)[number])}
            className="bg-transparent border px-3 py-3 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          >
            {WORK_MODES.map((m) => (
              <option key={m} value={m}>
                {m === "All" ? "All work modes" : m}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mono text-sm text-accent py-4 border px-4 mb-6" style={{ borderColor: "var(--border)" }}>
            Couldn't load jobs: {error}
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="mono text-sm text-muted py-16 text-center">No open roles match yet. Check back soon.</p>
        ) : (
          <div className="border" style={{ borderColor: "var(--border)" }}>
            {filtered.map((j, idx) => (
              <div key={j.id} className={`p-6 ${idx > 0 ? "border-t" : ""}`} style={{ borderColor: "var(--border)" }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-2xl">{j.title}</div>
                    <div className="flex items-center gap-1 mono text-xs text-muted mt-1">
                      <Briefcase className="w-3 h-3" /> {j.companies?.name ?? "Company"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 border" style={{ borderColor: "var(--border)" }}>
                      {j.employment_type}
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border flex items-center gap-1 ${workModeColor(j.work_mode)}`}>
                      <MapPin className="w-3 h-3" /> {j.work_mode}
                    </span>
                  </div>
                </div>

                {j.description && <p className="text-sm mt-3 max-w-2xl">{j.description}</p>}

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {j.budget && (
                    <span className="mono text-xs text-muted">
                      {j.currency} {j.budget}
                    </span>
                  )}
                  {j.companies?.website && (
                    <a
                      href={j.companies.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mono text-xs uppercase tracking-widest text-accent underline underline-offset-4"
                    >
                      Visit company site
                    </a>
                  )}
                </div>

                {j.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {j.skills.map((s) => (
                      <span key={s} className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: "var(--border)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
