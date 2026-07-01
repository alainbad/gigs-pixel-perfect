import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { Search, MapPin, Mail, Phone, Star, Linkedin } from "lucide-react";
import { getPublicTalent, type PublicFreelancer } from "@/lib/talent.server";

export const Route = createFileRoute("/browse-talent")({
  head: () => ({
    meta: [
      { title: "Browse Talent — FreeLand" },
      { name: "description", content: "Browse independent freelancers available for hire on FreeLand." },
    ],
  }),
  loader: () => getPublicTalent(),
  component: BrowseTalent,
});

const EMERALD = "#064e3b";
const EMERALD_MID = "#0d7a5f";
const GOLD = "#c9a84c";
const PARCH = "#f5f0e0";

const AVAILABILITY = ["All", "Available", "Busy", "Not Available"] as const;

function availabilityColor(a: string) {
  if (a === "Available") return `bg-[${EMERALD_MID}]/10 text-[${EMERALD}] border-[${EMERALD_MID}]/40`;
  if (a === "Busy") return `bg-[${GOLD}]/15 text-[#7a6420] border-[${GOLD}]/40`;
  return "bg-black/5 text-black/60 border-black/20";
}

function initial(t: PublicFreelancer) {
  return (t.profiles?.full_name ?? "F").charAt(0).toUpperCase();
}

function BrowseTalent() {
  const { talent, error } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<(typeof AVAILABILITY)[number]>("All");
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState<"recent" | "rate" | "experience">("recent");
  const [selectedId, setSelectedId] = useState(talent[0]?.user_id);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, []);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    talent.forEach((t) => t.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [talent]);

  const filtered = useMemo(() => {
    let list = talent.filter((t) => {
      const name = t.profiles?.full_name ?? "";
      if (
        query &&
        !`${name} ${t.headline ?? ""} ${t.bio ?? ""} ${t.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (availability !== "All" && t.availability !== availability) return false;
      if (skill && !t.skills.includes(skill)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "rate") return (b.hourly_rate ?? 0) - (a.hourly_rate ?? 0);
      if (sort === "experience") return (b.years_experience ?? 0) - (a.years_experience ?? 0);
      return 0;
    });
    return list;
  }, [talent, query, availability, skill, sort]);

  const selected = filtered.find((t) => t.user_id === selectedId) ?? filtered[0] ?? talent[0];

  const avgRate = talent.length
    ? Math.round(talent.reduce((sum, t) => sum + (t.hourly_rate ?? 0), 0) / talent.filter((t) => t.hourly_rate != null).length) || 0
    : 0;
  const availableCount = talent.filter((t) => t.availability === "Available").length;

  function reset() {
    setQuery("");
    setAvailability("All");
    setSkill("");
  }

  return (
    <div className="min-h-screen" style={{ background: PARCH, color: EMERALD, fontFamily: '"Work Sans", sans-serif' }}>
      <Cursor />
      <Nav active="browse" />

      {/* MASTHEAD */}
      <section className="pt-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 border-b" style={{ borderColor: `${EMERALD}22` }}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-widest uppercase" style={{ color: `${EMERALD}99` }}>
            <span>Talent Directory · Est. 2024</span>
            <span suppressHydrationWarning>{today}</span>
          </div>
          <h1 className="mt-8 text-[clamp(3rem,8vw,7.5rem)] leading-[0.95]" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Browse the<br />
            <span className="italic" style={{ color: EMERALD_MID }}>Talent.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg" style={{ color: `${EMERALD}CC` }}>
            Independent professionals across design, tech, writing and beyond — verified and ready for their next project.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              [String(talent.length), "Professionals"],
              [String(availableCount), "Available now"],
              [avgRate ? `$${avgRate}/hr` : "—", "Avg. rate"],
              [String(allSkills.length), "Skills listed"],
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
                placeholder="Name, skill, headline…"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Availability</div>
            <div className="grid grid-cols-2 gap-1">
              {AVAILABILITY.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvailability(a)}
                  className="text-xs py-2 border transition-colors"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: availability === a ? EMERALD : "transparent",
                    color: availability === a ? PARCH : EMERALD,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${EMERALD}99` }}>Skill</div>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
              style={{ borderColor: `${EMERALD}55` }}
            >
              <option value="">All skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button onClick={reset} className="text-xs uppercase tracking-widest underline underline-offset-4" style={{ color: EMERALD_MID }}>
            Reset filters
          </button>
        </aside>

        {/* CENTER */}
        <div className="space-y-10 min-w-0">
          {error && (
            <div className="border p-4 text-sm" style={{ borderColor: `${EMERALD}33`, color: "#b3261e" }}>
              Couldn't load talent: {error}
            </div>
          )}

          {/* KPI ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 border" style={{ borderColor: `${EMERALD}33` }}>
            {[
              { l: "Results", v: filtered.length },
              { l: "Available", v: availableCount },
              { l: "Avg. rate", v: avgRate ? `$${avgRate}/hr` : "—" },
              { l: "Skills", v: allSkills.length },
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
              <h2 className="text-4xl" style={{ fontFamily: '"Instrument Serif", serif' }}>Available Professionals</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-transparent border px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ borderColor: `${EMERALD}55` }}
              >
                <option value="recent">Sort · Most recent</option>
                <option value="rate">Sort · By rate</option>
                <option value="experience">Sort · By experience</option>
              </select>
            </div>
            <div className="border" style={{ borderColor: `${EMERALD}33` }}>
              {filtered.map((t, idx) => (
                <button
                  key={t.user_id}
                  onClick={() => setSelectedId(t.user_id)}
                  className={`w-full text-left grid grid-cols-[80px_1fr_auto] gap-5 p-5 transition-colors ${idx > 0 ? "border-t" : ""}`}
                  style={{
                    borderColor: `${EMERALD}22`,
                    background: selectedId === t.user_id ? `${EMERALD_MID}0D` : "transparent",
                  }}
                >
                  <div className="w-20 h-20 overflow-hidden border shrink-0" style={{ borderColor: `${EMERALD}33` }}>
                    {t.profiles?.avatar_url ? (
                      <img src={t.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-3xl"
                        style={{ background: EMERALD, color: PARCH, fontFamily: '"Instrument Serif", serif' }}
                      >
                        {initial(t)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>
                      <span>{t.location ?? "Remote"}</span>
                      {t.years_experience != null && t.years_experience >= 5 && (
                        <Star className="w-3 h-3" style={{ color: GOLD, fill: GOLD }} />
                      )}
                    </div>
                    <div className="text-2xl mt-1 truncate" style={{ fontFamily: '"Instrument Serif", serif' }}>
                      {t.profiles?.full_name ?? "Freelancer"}
                    </div>
                    {t.headline && <div className="text-sm" style={{ color: `${EMERALD}AA` }}>{t.headline}</div>}
                    {t.bio && (
                      <p className="mt-2 text-xs max-w-xl line-clamp-2" style={{ color: `${EMERALD}CC` }}>
                        {t.bio}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.skills.map((s) => (
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
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${availabilityColor(t.availability)}`}>
                      {t.availability}
                    </span>
                    {t.hourly_rate != null && (
                      <span className="text-xs" style={{ color: `${EMERALD}99` }}>
                        ${t.hourly_rate}/hr
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-10 text-center text-sm" style={{ color: `${EMERALD}99` }}>
                  No public freelancers match yet. Check back soon.
                </div>
              )}
            </div>
          </div>

          {/* TOP SKILLS */}
          {allSkills.length > 0 && (
            <div>
              <h2 className="text-4xl mb-5" style={{ fontFamily: '"Instrument Serif", serif' }}>Skills on FreeLand</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t" style={{ borderColor: `${EMERALD}33` }}>
                {allSkills.map((s) => (
                  <div
                    key={s}
                    className="border-r border-b p-4 text-center text-sm hover:bg-white transition-colors"
                    style={{ borderColor: `${EMERALD}22`, fontFamily: '"Instrument Serif", serif' }}
                  >
                    {s}
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
                <div className="relative h-48 overflow-hidden flex items-center justify-center">
                  {selected.profiles?.avatar_url ? (
                    <img src={selected.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-7xl" style={{ fontFamily: '"Instrument Serif", serif', color: `${PARCH}55` }}>
                      {initial(selected)}
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, ${EMERALD} 100%)` }} />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                    <span style={{ color: `${PARCH}99` }}>Featured professional</span>
                    <span className={`px-2 py-0.5 border`} style={{ color: GOLD, borderColor: `${GOLD}55` }}>
                      {selected.availability}
                    </span>
                  </div>
                  <div className="mt-3 text-3xl leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>
                    {selected.profiles?.full_name ?? "Freelancer"}
                  </div>
                  {selected.headline && <div className="text-sm mt-1" style={{ color: `${PARCH}CC` }}>{selected.headline}</div>}
                  <div className="mt-4 text-xs space-y-1" style={{ color: `${PARCH}BB` }}>
                    {selected.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {selected.location}
                      </div>
                    )}
                    {selected.contact_email && (
                      <a href={`mailto:${selected.contact_email}`} className="flex items-center gap-2 hover:underline">
                        <Mail className="w-3 h-3" />
                        {selected.contact_email}
                      </a>
                    )}
                    {selected.phone && (
                      <a href={`tel:${(selected.phone_country_code ?? "") + selected.phone}`} className="flex items-center gap-2 hover:underline">
                        <Phone className="w-3 h-3" />
                        {selected.phone_country_code} {selected.phone}
                      </a>
                    )}
                    {selected.linkedin_url && (
                      <a href={selected.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                        <Linkedin className="w-3 h-3" />
                        LinkedIn profile
                      </a>
                    )}
                  </div>

                  {selected.hourly_rate != null && (
                    <div className="mt-5 border-t pt-4" style={{ borderColor: `${PARCH}22` }}>
                      <div className="text-3xl" style={{ fontFamily: '"Instrument Serif", serif', color: GOLD }}>
                        ${selected.hourly_rate}/hr
                      </div>
                      <div className="text-[9px] uppercase tracking-widest mt-1" style={{ color: `${PARCH}77` }}>Hourly rate</div>
                    </div>
                  )}

                  {selected.contact_email && (
                    <a
                      href={`mailto:${selected.contact_email}`}
                      className="mt-5 w-full py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center"
                      style={{ background: GOLD, color: EMERALD }}
                    >
                      Contact
                    </a>
                  )}
                  {selected.linkedin_url && (
                    <a
                      href={selected.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 w-full py-3 text-xs uppercase tracking-widest border flex items-center justify-center"
                      style={{ borderColor: `${PARCH}44`, color: PARCH }}
                    >
                      View LinkedIn
                    </a>
                  )}
                </div>
              </div>

              <div className="border p-6" style={{ borderColor: `${EMERALD}33` }}>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: `${EMERALD}99` }}>For Employers</div>
                <h3 className="mt-2 text-2xl leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>Hire this talent.</h3>
                <p className="mt-3 text-sm" style={{ color: `${EMERALD}CC` }}>
                  Reach out directly — no bidding wars, no middlemen. Just a clear conversation about your project.
                </p>
              </div>
            </>
          ) : (
            <div className="border p-6 text-sm" style={{ borderColor: `${EMERALD}33`, color: `${EMERALD}99` }}>
              No professional selected yet.
            </div>
          )}
        </aside>
      </section>

      {/* CTA FOOTBAND */}
      <section style={{ background: EMERALD, color: PARCH, borderTop: `2px solid ${GOLD}` }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>The directory, delivered</div>
            <h2 className="mt-3 text-5xl" style={{ fontFamily: '"Instrument Serif", serif' }}>
              New talent, every <span className="italic">Monday.</span>
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
