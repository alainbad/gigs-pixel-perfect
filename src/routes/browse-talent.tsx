import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { Search, MapPin, Mail, Phone } from "lucide-react";
import { getPublicTalent } from "@/lib/talent.server";

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

function availabilityColor(a: string) {
  if (a === "Available") return "bg-ink/5 text-ink border-ink/30";
  if (a === "Busy") return "bg-[color:var(--gold)]/15 text-[#7a6420] border-[color:var(--gold)]/40";
  return "bg-black/5 text-black/50 border-black/20";
}

function BrowseTalent() {
  const talent = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    talent.forEach((t) => t.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [talent]);

  const filtered = useMemo(() => {
    return talent.filter((t) => {
      const name = t.profiles?.full_name ?? "";
      if (
        query &&
        !`${name} ${t.headline ?? ""} ${t.bio ?? ""} ${t.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (skill && !t.skills.includes(skill)) return false;
      return true;
    });
  }, [talent, query, skill]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Cursor />
      <Nav active="browse" />

      <section className="pt-32 pb-16 max-w-[1400px] mx-auto px-6 lg:px-10">
        <h1 className="text-6xl mb-3">Browse Talent.</h1>
        <p className="mono text-xs uppercase tracking-widest text-muted mb-10">
          {filtered.length} independent {filtered.length === 1 ? "professional" : "professionals"} available
        </p>

        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <div className="flex items-center border flex-1" style={{ borderColor: "var(--border)" }}>
            <Search className="w-4 h-4 ml-3 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill, or headline…"
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
            />
          </div>
          {allSkills.length > 0 && (
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="bg-transparent border px-3 py-3 text-sm outline-none"
              style={{ borderColor: "var(--border)" }}
            >
              <option value="">All skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="mono text-sm text-muted py-16 text-center">
            No public freelancers match yet. Check back soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div key={t.user_id} className="border p-6" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border shrink-0" style={{ borderColor: "var(--border)" }}>
                    {t.profiles?.avatar_url ? (
                      <img src={t.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-ink text-paper mono text-lg">
                        {(t.profiles?.full_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl truncate">{t.profiles?.full_name ?? "Freelancer"}</div>
                    {t.headline && <div className="text-sm text-muted truncate">{t.headline}</div>}
                  </div>
                </div>

                {t.bio && <p className="text-sm mb-4 line-clamp-3">{t.bio}</p>}

                <div className="flex flex-wrap gap-1 mb-4">
                  {t.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mono text-xs text-muted mb-4">
                  <span className={`px-2 py-1 border text-[10px] uppercase tracking-widest ${availabilityColor(t.availability)}`}>
                    {t.availability}
                  </span>
                  {t.hourly_rate != null && <span>${t.hourly_rate}/hr</span>}
                </div>

                {t.location && (
                  <div className="flex items-center gap-1 mono text-xs text-muted mb-2">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </div>
                )}
                {t.contact_email && (
                  <a href={`mailto:${t.contact_email}`} className="flex items-center gap-1 mono text-xs hover:text-accent mb-2">
                    <Mail className="w-3 h-3" /> {t.contact_email}
                  </a>
                )}
                {t.phone && (
                  <a href={`tel:${t.phone}`} className="flex items-center gap-1 mono text-xs hover:text-accent mb-2">
                    <Phone className="w-3 h-3" /> {t.phone}
                  </a>
                )}
                {t.linkedin_url && (
                  <a
                    href={t.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-xs uppercase tracking-widest text-accent underline underline-offset-4"
                  >
                    View LinkedIn
                  </a>
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
