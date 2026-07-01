import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { Search, Briefcase, MapPin, Star } from "lucide-react";
import { getPublicJobs, type PublicJob } from "@/lib/jobs.server";

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

const EMERALD = "#064e3b";
const EMERALD_MID = "#0d7a5f";
const GOLD = "#c9a84c";
const PARCH = "#f5f0e0";

const EMPLOYMENT_TYPES = ["All", "Full-time", "Part-time"] as const;
const WORK_MODES = ["All", "On-site", "Remote", "Hybrid"] as const;

function workModeColor(m: string) {
  if (m === "Remote") return `bg-[${EMERALD_MID}]/10 text-[${EMERALD}] border-[${EMERALD_MID}]/40`;
  if (m === "Hybrid") return `bg-[${GOLD}]/15 text-[#7a6420] border-[${GOLD}]/40`;
  return "bg-black/5 text-black/60 border-black/20";
}

function employmentColor(t: string) {
  if (t === "Full-time") return `bg-[${EMERALD}] text-[${PARCH}]`;
  return `bg-[${GOLD}] text-[${EMERALD}]`;
}

function BrowseJobs() {
  const { jobs, error } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [employmentType, setEmploymentType] = useState<(typeof EMPLOYMENT_TYPES)[number]>("All");
  const [workMode, setWorkMode] = useState<(typeof WORK_MODES)[number]>("All");
  const [sort, setSort] = useState<"recent" | "title">("recent");
  const [selectedId, setSelectedId] = useState(jobs[0]?.id);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, []);

  const companies = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.companies?.name && set.add(j.companies.name));
    return Array.from(set).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => {
      const company = j.companies?.name ?? "";
      if (query && !`${j.title} ${company} ${j.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (employmentType !== "All" && j.employment_type !== employmentType) return false;
      if (workMode !== "All" && j.work_mode !== workMode) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [jobs, query, employmentType, workMode, sort]);

  const selected: PublicJob | undefined = filtered.find((j) => j.id === selectedId) ?? filtered[0] ?? jobs[0];
  const remoteCount = jobs.filter((j) => j.work_mode === "Remote").length;
  const fullTimeCount = jobs.filter((j) => j.employment_type === "Full-time").length;

  function reset() {
    setQuery("");
    setEmploymentType("All");
    setWorkMode("All");
  }

  return (
    <div className="min-h-screen" style={{ background: PARCH, color: EMERALD, fontFamily: '"Work Sans", sans-serif' }}>
      <Cursor />
      <Nav active="jobs" />

      {/* MASTHEAD */}
      <section className="pt-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 border-b" style={{ borderColor: `${EMERALD}22` }}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-widest uppercase" style={{ color: `${EMERALD}99` }}>
            <span>Open Roles · Est. 2024</span>
            <span suppressHydrationWarning>{today}</span>
          </div>
          <h1 className="mt-8 text-[clamp(3rem,8vw,7.5rem)] leading-[0.95]" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Browse Open<br />
            <span className="italic" style={{ color: EMERALD_MID }}>Roles.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg" style={{ color: `${EMERALD}CC` }}>
            Roles posted directly by founders and studios hiring on FreeLand — no recruiters, no noise.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              [String(jobs.length), "Open roles"],
              [String(fullTimeCount), "Full-time"],
              [String(remoteCount), "Remote"],
              [String(companies.length), "Companies hiring"],
            ].map(([n, l]) => (
              <div key={l} className="border-t pt-4" style={{ borderColor: `${EMERALD}44` }}>
                <div className="text-5xl" style={{ fontFamily: '"Instrument Serif", serif' }}>{n}</div>
                <div className="text-xs uppercase tracking-widest mt-2" style={{ color: `${EMERALD}99` }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 grid lg:grid-cols-[260px_1fr_340px] gap-8">
        {/* FILTERS */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Search</div>
            <div className="flex items-center border" style={{ borderColor: `${EMERALD}55` }}>
              <Search className="w-4 h-4 ml-3" style={{ color: `${EMERALD}99` }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, company, skill…"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Employment type</div>
            <div className="grid grid-cols-1 gap-1">
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setEmploymentType(t)}
                  className="text-xs py-2 border transition-colors"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: employmentType === t ? EMERALD : "transparent",
                    color: employmentType === t ? PARCH : EMERALD,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Work mode</div>
            <div className="grid grid-cols-2 gap-1">
              {WORK_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setWorkMode(m)}
                  className="text-xs py-2 border transition-colors"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: workMode === m ? EMERALD_MID : "transparent",
                    color: workMode === m ? PARCH : EMERALD,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button onClick={reset} className="text-xs uppercase tracking-widest underline underline-offset-4" style={{ color: EMERALD_MID }}>
            Reset filters
          </button>
        </aside>

        {/* CENTER */}
        <div className="space-y-10 min-w-0">
          {error && (
            <div className="border p-4 text-sm" style={{ borderColor: `${EMERALD}33`, color: "#b3261e" }}>
              Couldn't load jobs: {error}
            </div>
          )}

          {/* KPI ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 border" style={{ borderColor: `${EMERALD}33` }}>
            {[
              { l: "Results", v: filtered.length },
              { l: "Full-time", v: fullTimeCount },
              { l: "Remote", v: remoteCount },
              { l: "Companies", v: companies.length },
            ].map((k, i) => (
              <div key={k.l} className={`p-5 ${i < 3 ? "border-r" : ""}`} style={{ borderColor: `${EMERALD}22` }}>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>{k.l}</div>
                <div className="mt-2 text-3xl" style={{ fontFamily: '"Instrument Serif", serif' }}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* LIST */}
          <div>
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-4xl" style={{ fontFamily: '"Instrument Serif", serif' }}>Open Roles</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-transparent border px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ borderColor: `${EMERALD}55` }}
              >
                <option value="recent">Sort · Most recent</option>
                <option value="title">Sort · By title</option>
              </select>
            </div>
            <div className="border" style={{ borderColor: `${EMERALD}33` }}>
              {filtered.map((j, idx) => (
                <button
                  key={j.id}
                  onClick={() => setSelectedId(j.id)}
                  className={`w-full text-left grid grid-cols-[1fr_auto] gap-5 p-5 transition-colors ${idx > 0 ? "border-t" : ""}`}
                  style={{
                    borderColor: `${EMERALD}22`,
                    background: selectedId === j.id ? `${EMERALD_MID}0D` : "transparent",
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>
                      <Briefcase className="w-3 h-3" />
                      <span>{j.companies?.name ?? "Company"}</span>
                    </div>
                    <div className="text-2xl mt-1 truncate" style={{ fontFamily: '"Instrument Serif", serif' }}>{j.title}</div>
                    {j.description && (
                      <p className="mt-2 text-xs max-w-xl line-clamp-2" style={{ color: `${EMERALD}CC` }}>
                        {j.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {j.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                          style={{ borderColor: `${EMERALD}44`, color: `${EMERALD}CC` }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${employmentColor(j.employment_type)}`}>
                      {j.employment_type}
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border flex items-center gap-1 ${workModeColor(j.work_mode)}`}>
                      <MapPin className="w-3 h-3" /> {j.work_mode}
                    </span>
                    {j.budget && (
                      <span className="text-xs" style={{ color: `${EMERALD}99` }}>
                        {j.currency} {j.budget}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-10 text-center text-sm" style={{ color: `${EMERALD}99` }}>
                  No open roles match yet. Check back soon.
                </div>
              )}
            </div>
          </div>

          {/* COMPANIES */}
          {companies.length > 0 && (
            <div>
              <h2 className="text-4xl mb-5" style={{ fontFamily: '"Instrument Serif", serif' }}>Companies Hiring</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t" style={{ borderColor: `${EMERALD}33` }}>
                {companies.map((c) => (
                  <div
                    key={c}
                    className="border-r border-b p-4 text-center text-sm hover:bg-white transition-colors"
                    style={{ borderColor: `${EMERALD}22`, fontFamily: '"Instrument Serif", serif' }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DETAIL PANEL */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
          {selected ? (
            <>
              <div className="overflow-hidden" style={{ background: EMERALD, color: PARCH }}>
                <div className="relative h-24 overflow-hidden flex items-center justify-center">
                  <Briefcase className="w-10 h-10" style={{ color: `${PARCH}44` }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, ${EMERALD} 100%)` }} />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                    <span style={{ color: `${PARCH}99` }}>Featured role</span>
                    <span style={{ color: GOLD }}>{selected.employment_type}</span>
                  </div>
                  <div className="mt-3 text-3xl leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>{selected.title}</div>
                  <div className="text-sm mt-1 flex items-center gap-1" style={{ color: `${PARCH}CC` }}>
                    <Star className="w-3 h-3" style={{ color: GOLD, fill: GOLD }} />
                    {selected.companies?.name ?? "Company"}
                  </div>
                  <div className="mt-4 text-xs space-y-1" style={{ color: `${PARCH}BB` }}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {selected.work_mode}
                    </div>
                    {selected.budget && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3 h-3" />
                        {selected.currency} {selected.budget}
                      </div>
                    )}
                  </div>

                  {selected.description && (
                    <p className="mt-4 text-xs border-t pt-4" style={{ color: `${PARCH}CC`, borderColor: `${PARCH}22` }}>
                      {selected.description}
                    </p>
                  )}

                  {selected.companies?.website && (
                    <a
                      href={selected.companies.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 w-full py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center"
                      style={{ background: GOLD, color: EMERALD }}
                    >
                      Visit company site
                    </a>
                  )}
                </div>
              </div>

              <div className="border p-6" style={{ borderColor: `${EMERALD}33` }}>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>For Freelancers</div>
                <h3 className="mt-2 text-2xl leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>Ready to apply?</h3>
                <p className="mt-3 text-sm" style={{ color: `${EMERALD}CC` }}>
                  Reach out via the company's site, or list yourself on Browse Talent so employers like this one can find you.
                </p>
              </div>
            </>
          ) : (
            <div className="border p-6 text-sm" style={{ borderColor: `${EMERALD}33`, color: `${EMERALD}99` }}>
              No role selected yet.
            </div>
          )}
        </aside>
      </section>

      {/* CTA FOOTBAND */}
      <section style={{ background: EMERALD, color: PARCH, borderTop: `2px solid ${GOLD}` }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>The roles, delivered</div>
            <h2 className="mt-3 text-5xl" style={{ fontFamily: '"Instrument Serif", serif' }}>
              New roles, every <span className="italic">Monday.</span>
            </h2>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border px-4 py-3 text-sm outline-none"
              style={{ borderColor: `${PARCH}44`, color: PARCH }}
            />
            <button className="px-6 py-3 text-xs uppercase tracking-widest" style={{ background: GOLD, color: EMERALD }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
