import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { Search, Calendar, MapPin, Users, Briefcase, Download, Star } from "lucide-react";
import { getFairs } from "@/lib/fairs.server";
import type { Fair } from "@/lib/fairs-data";

export const Route = createFileRoute("/job-fairs")({
  head: () => ({
    meta: [
      { title: "The Career Fairs Register — FreeLand" },
      { name: "description", content: "Verified hiring events from twenty-seven cities. Register for global career fairs." },
      { property: "og:title", content: "The Career Fairs Register — FreeLand" },
      { property: "og:description", content: "Verified hiring events from twenty-seven cities." },
    ],
  }),
  loader: () => getFairs(),
  component: Fairs,
});

const EMERALD = "#064e3b";
const EMERALD_MID = "#0d7a5f";
const GOLD = "#c9a84c";
const PARCH = "#f5f0e0";

const AGENDA = [
  { t: "09:00", n: "Doors open · Delegate check-in", r: "Concourse", s: "S-01" },
  { t: "10:00", n: "Opening keynote: Hiring in 2026", r: "Grand Ballroom", s: "S-02" },
  { t: "11:30", n: "Employer roundtable · Technology", r: "Salon A", s: "S-03" },
  { t: "13:00", n: "Lunch & networking lounge", r: "Terrace", s: "S-04" },
  { t: "14:30", n: "One-to-one interview slots", r: "Interview Wing", s: "S-05" },
  { t: "16:00", n: "Panel: Consulting after the boom", r: "Salon B", s: "S-06" },
  { t: "17:30", n: "Closing reception", r: "Garden Court", s: "S-07" },
];

const EMPLOYERS = ["KPMG", "Linklaters", "Novartis", "Shell", "Palantir", "McKinsey & Co.", "Barclays", "Roche", "BCG", "Stripe", "Freshfields", "Booking.com"];
const INDUSTRIES = ["Technology", "Finance", "Consulting", "Legal", "Design", "Media", "Marketing", "Engineering", "Data"];
const REGIONS = ["North America", "Europe", "Middle East", "Asia Pacific", "Latin America", "Africa", "Global"];
const FORMATS = ["All", "In-Person", "Hybrid", "Virtual"] as const;
const LEVELS = ["Entry", "Mid", "Senior", "Executive"];

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return { d: 0, h: 0, m: 0, s: 0 };
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function statusColor(s: Fair["status"]) {
  if (s === "Registration Open") return `bg-[${EMERALD_MID}]/10 text-[${EMERALD}] border-[${EMERALD_MID}]/40`;
  if (s === "Almost Full") return `bg-[${GOLD}]/15 text-[#7a6420] border-[${GOLD}]/40`;
  return "bg-black/5 text-black/60 border-black/20";
}

function formatColor(f: Fair["format"]) {
  if (f === "In-Person") return `bg-[${EMERALD}] text-[${PARCH}]`;
  if (f === "Hybrid") return `bg-[${GOLD}] text-[${EMERALD}]`;
  return "bg-black text-[color:var(--paper)]";
}

function Fairs() {
  const fairs = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("All");
  const [region, setRegion] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState<"date" | "employers" | "openings">("date");
  const [selectedId, setSelectedId] = useState(fairs[0].id);
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, []);

  const filtered = useMemo(() => {
    let list = fairs.filter((f) => {
      if (query && !`${f.name} ${f.host} ${f.city}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (format !== "All" && f.format !== format) return false;
      if (region && f.region !== region) return false;
      if (industries.length && !industries.some((i) => f.industries.includes(i))) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "date") return a.iso.localeCompare(b.iso);
      if (sort === "employers") return b.employers - a.employers;
      return b.openings - a.openings;
    });
    return list;
  }, [fairs, query, format, region, industries, sort]);

  const selected = filtered.find((f) => f.id === selectedId) ?? filtered[0] ?? fairs[0];
  const cd = useCountdown(new Date(selected.iso));

  function toggleIndustry(i: string) {
    setIndustries((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  function reset() {
    setQuery(""); setFormat("All"); setRegion(""); setIndustries([]); setLevel("");
  }

  return (
    <div className="min-h-screen" style={{ background: PARCH, color: EMERALD, fontFamily: '"Work Sans", sans-serif' }}>
      <Cursor />
      <Nav active="fairs" />

      {/* MASTHEAD */}
      <section className="pt-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 border-b" style={{ borderColor: `${EMERALD}22` }}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-widest uppercase" style={{ color: `${EMERALD}99` }}>
            <span>Career Fairs · Est. 2019</span>
            <span suppressHydrationWarning>{today}</span>
          </div>
          <h1 className="mt-8 text-[clamp(3rem,8vw,7.5rem)] leading-[0.95]" style={{ fontFamily: '"Instrument Serif", serif' }}>
            The Career Fairs<br />
            <span className="italic" style={{ color: EMERALD_MID }}>Register.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg" style={{ color: `${EMERALD}CC` }}>
            Verified hiring events from twenty-seven cities. Curated by FreeLand for founders, studios and career-minded professionals.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["24", "Upcoming fairs"], ["640+", "Employers"], ["9,300+", "Openings"], ["38k", "Delegates"]].map(([n, l]) => (
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
                placeholder="Fair, host, city…"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Format</div>
            <div className="grid grid-cols-2 gap-1">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className="text-xs py-2 border transition-colors"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: format === f ? EMERALD : "transparent",
                    color: format === f ? PARCH : EMERALD,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Region</div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
              style={{ borderColor: `${EMERALD}55` }}
            >
              <option value="">All regions</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Industry</div>
            <div className="space-y-2">
              {INDUSTRIES.map((i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={industries.includes(i)}
                    onChange={() => toggleIndustry(i)}
                    className="accent-current w-4 h-4"
                    style={{ accentColor: EMERALD }}
                  />
                  {i}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Seniority</div>
            <div className="flex flex-wrap gap-1">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(level === l ? "" : l)}
                  className="text-xs px-3 py-1.5 border"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: level === l ? EMERALD_MID : "transparent",
                    color: level === l ? PARCH : EMERALD,
                  }}
                >
                  {l}
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
          {/* KPI ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 border" style={{ borderColor: `${EMERALD}33` }}>
            {[
              { l: "Results", v: filtered.length },
              { l: "Next fair", v: selected.date.split(" ").slice(0, 2).join(" ") },
              { l: "Employers", v: selected.employers },
              { l: "Openings", v: selected.openings },
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
              <h2 className="text-4xl" style={{ fontFamily: '"Instrument Serif", serif' }}>Upcoming Career Fairs</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-transparent border px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ borderColor: `${EMERALD}55` }}
              >
                <option value="date">Sort · By date</option>
                <option value="employers">Sort · By employers</option>
                <option value="openings">Sort · By openings</option>
              </select>
            </div>
            <div className="border" style={{ borderColor: `${EMERALD}33` }}>
              {filtered.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`w-full text-left grid grid-cols-[80px_1fr_auto] gap-5 p-5 transition-colors ${idx > 0 ? "border-t" : ""}`}
                  style={{
                    borderColor: `${EMERALD}22`,
                    background: selectedId === f.id ? `${EMERALD_MID}0D` : "transparent",
                  }}
                >
                  <div className="w-20 h-20 overflow-hidden border" style={{ borderColor: `${EMERALD}33` }}>
                    <img src={f.img} alt={f.city} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>
                      <span>{f.id}</span>
                      {f.featured && <Star className="w-3 h-3" style={{ color: GOLD, fill: GOLD }} />}
                    </div>
                    <div className="text-2xl mt-1 truncate" style={{ fontFamily: '"Instrument Serif", serif' }}>{f.name}</div>
                    <div className="text-sm" style={{ color: `${EMERALD}AA` }}>{f.host} · {f.venue}</div>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: `${EMERALD}CC` }}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{f.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.city}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{f.employers} employers</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{f.openings} openings</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {f.industries.map((i) => (
                        <span key={i} className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: `${EMERALD}44`, color: `${EMERALD}CC` }}>{i}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${formatColor(f.format)}`}>{f.format}</span>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${statusColor(f.status)}`}>{f.status}</span>
                    <span className="text-xs" style={{ color: `${EMERALD}99` }}>{f.attendees.toLocaleString()} attending</span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-10 text-center text-sm" style={{ color: `${EMERALD}99` }}>No fairs match your filters.</div>
              )}
            </div>
          </div>

          {/* AGENDA */}
          <div>
            <h2 className="text-4xl mb-5" style={{ fontFamily: '"Instrument Serif", serif' }}>Programme · {selected.name}</h2>
            <div className="border" style={{ borderColor: `${EMERALD}33` }}>
              {AGENDA.map((a, i) => (
                <div key={a.s} className={`grid grid-cols-[80px_1fr_140px_60px] gap-4 p-4 items-center ${i > 0 ? "border-t" : ""}`} style={{ borderColor: `${EMERALD}22` }}>
                  <div className="text-sm font-mono" style={{ color: EMERALD_MID }}>{a.t}</div>
                  <div style={{ fontFamily: '"Instrument Serif", serif' }} className="text-xl">{a.n}</div>
                  <div className="text-xs" style={{ color: `${EMERALD}99` }}>{a.r}</div>
                  <div className="text-[10px] uppercase tracking-widest text-right" style={{ color: `${EMERALD}77` }}>{a.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EMPLOYERS */}
          <div>
            <h2 className="text-4xl mb-5" style={{ fontFamily: '"Instrument Serif", serif' }}>Participating Employers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t" style={{ borderColor: `${EMERALD}33` }}>
              {EMPLOYERS.map((e) => (
                <div key={e} className="border-r border-b p-4 text-center text-sm hover:bg-white transition-colors" style={{ borderColor: `${EMERALD}22`, fontFamily: '"Instrument Serif", serif' }}>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAIL PANEL */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <div className="overflow-hidden" style={{ background: EMERALD, color: PARCH }}>
            <div className="relative h-48 overflow-hidden">
              <img src={selected.img} alt={selected.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, ${EMERALD} 100%)` }} />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                <span style={{ color: `${PARCH}99` }}>Featured event</span>
                <span style={{ color: GOLD }}>{selected.id}</span>
              </div>
              <div className="mt-3 text-3xl leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>{selected.name}</div>
              <div className="text-sm mt-1" style={{ color: `${PARCH}CC` }}>{selected.host}</div>
              <div className="mt-4 text-xs space-y-1" style={{ color: `${PARCH}BB` }}>
                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" />{selected.date}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />{selected.venue}, {selected.city}</div>
                <div className="flex items-center gap-2"><Users className="w-3 h-3" />{selected.attendees.toLocaleString()} delegates expected</div>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2 border-t pt-4" style={{ borderColor: `${PARCH}22` }}>
                {[["Days", cd.d], ["Hrs", cd.h], ["Min", cd.m], ["Sec", cd.s]].map(([l, v]) => (
                  <div key={l} className="text-center">
                    <div className="text-3xl" style={{ fontFamily: '"Instrument Serif", serif', color: GOLD }}>{String(v).padStart(2, "0")}</div>
                    <div className="text-[9px] uppercase tracking-widest mt-1" style={{ color: `${PARCH}77` }}>{l}</div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full py-3 text-xs uppercase tracking-widest transition-colors" style={{ background: GOLD, color: EMERALD }}>
                Register
              </button>
              <button className="mt-2 w-full py-3 text-xs uppercase tracking-widest border" style={{ borderColor: `${PARCH}44`, color: PARCH }}>
                Book interview slot
              </button>
              <button className="mt-2 w-full py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2" style={{ color: `${PARCH}99` }}>
                <Download className="w-3 h-3" /> Download PDF
              </button>
            </div>
          </div>

          <div className="border p-6" style={{ borderColor: `${EMERALD}33` }}>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>For Employers</div>
            <h3 className="mt-2 text-2xl leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>Recruit at the next fair.</h3>
            <p className="mt-3 text-sm" style={{ color: `${EMERALD}CC` }}>
              Reserve a booth, book a keynote slot or a private interview suite. Our team handles logistics end-to-end.
            </p>
            <button className="mt-4 w-full py-3 text-xs uppercase tracking-widest" style={{ background: EMERALD, color: PARCH }}>
              Request exhibitor kit
            </button>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>As featured in</div>
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: `${EMERALD}AA`, fontFamily: '"Instrument Serif", serif' }}>
              {["Financial Times", "The Economist", "Bloomberg", "Handelsblatt"].map((p) => (
                <div key={p} className="border p-3 text-center" style={{ borderColor: `${EMERALD}22` }}>{p}</div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* CTA FOOTBAND */}
      <section style={{ background: EMERALD, color: PARCH, borderTop: `2px solid ${GOLD}` }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>The register, delivered</div>
            <h2 className="mt-3 text-5xl" style={{ fontFamily: '"Instrument Serif", serif' }}>
              New fairs, every <span className="italic">Monday.</span>
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
