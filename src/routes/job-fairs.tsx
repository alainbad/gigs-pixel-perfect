import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav, Footer, Cursor, Reveal } from "@/components/site";
import { MapPin, Calendar, Clock, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/job-fairs")({
  head: () => ({
    meta: [
      { title: "Job Fairs & Listings — GIGS" },
      { name: "description", content: "Live job fairs, remote roles and open listings across the region." },
      { property: "og:title", content: "Job Fairs & Listings — GIGS" },
      { property: "og:description", content: "Live job fairs, remote roles and open listings across the region." },
    ],
  }),
  component: Fairs,
});

const cities = ["Dubai", "Riyadh", "Cairo", "Beirut", "Amman", "Doha", "Kuwait City", "Manama", "Muscat", "Abu Dhabi"];
const fairs = [
  { org: "UAE Creative Council", n: "UAE Creative Expo", d: "Jul 22 — 24, 2026", loc: "Dubai World Trade Center", time: "10:00 — 18:00", tags: ["Physical", "Design"], spots: 42 },
  { org: "Saudi Digital Authority", n: "Riyadh Digital Fair", d: "Aug 05 — 07, 2026", loc: "King Abdullah Financial District", time: "09:00 — 17:00", tags: ["Hybrid", "Tech"], spots: 128 },
  { org: "GIGS", n: "GIGS Virtual Hiring Week", d: "Aug 12 — 19, 2026", loc: "Online — Global", time: "24/7", tags: ["Online", "All Categories"], spots: 512 },
  { org: "Cairo Chamber of Commerce", n: "Cairo Summit for Independents", d: "Sep 03 — 04, 2026", loc: "Nile Ritz-Carlton", time: "10:00 — 19:00", tags: ["Physical", "Writing"], spots: 76 },
  { org: "Beirut Creators Guild", n: "Beirut Freelance Connect", d: "Sep 18, 2026", loc: "Beirut Digital District", time: "14:00 — 22:00", tags: ["Hybrid", "Media"], spots: 34 },
];
const jobs = [
  { co: "Noon", t: "Senior UI/UX Designer", pay: "$6,000 — $8,500/mo", tags: ["Full-time", "Hybrid — Dubai"] },
  { co: "Tabby", t: "React Engineer", pay: "$5,500 — $7,000/mo", tags: ["Contract", "Remote"] },
  { co: "MAF", t: "Arabic Content Strategist", pay: "$4,200 — $5,800/mo", tags: ["Full-time", "Dubai"] },
  { co: "OSN+", t: "Motion Graphics Designer", pay: "$65 — $110/hr", tags: ["Freelance", "Remote"] },
  { co: "Salla", t: "Performance Marketer", pay: "$5,000 — $7,200/mo", tags: ["Full-time", "Riyadh"] },
  { co: "Bateel", t: "Brand Designer", pay: "$4,800 — $6,500/mo", tags: ["Full-time", "Dubai"] },
];
const events = [
  { d: "22", m: "Jul", n: "UAE Creative Expo", type: "Physical" },
  { d: "05", m: "Aug", n: "Riyadh Digital Fair", type: "Hybrid" },
  { d: "12", m: "Aug", n: "GIGS Virtual Week", type: "Online" },
  { d: "03", m: "Sep", n: "Cairo Summit", type: "Physical" },
  { d: "18", m: "Sep", n: "Beirut Connect", type: "Hybrid" },
  { d: "02", m: "Oct", n: "Doha Talent Days", type: "Physical" },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function Fairs() {
  const cd = useCountdown(new Date("2026-07-18T09:00:00Z"));
  const [tab, setTab] = useState("Job Fairs");

  return (
    <div className="noise min-h-screen">
      <Cursor />
      <Nav active="fairs" />

      {/* DARK HERO */}
      <section className="pt-16 bg-ink text-paper noise">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20">
          <div className="mono text-xs uppercase tracking-widest text-accent">§ Fairs & Listings</div>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] mt-6 leading-[0.9]">
            Where Talent<br/>Meets <span className="text-accent">Opportunity.</span>
          </h1>
          <p className="mt-6 max-w-xl text-paper/70">Live fairs across the region and thousands of open listings from teams that actually hire.</p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[["24+", "Fairs"], ["1,800+", "Positions"], ["340+", "Companies"], ["6", "Countries"]].map(([n, l]) => (
              <div key={l} className="border-t border-paper/20 pt-4">
                <div className="font-display text-5xl">{n}</div>
                <div className="mono text-[10px] uppercase tracking-widest text-paper/60 mt-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden border-y border-paper/10 py-6">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...cities, ...cities].map((c, i) => (
              <span key={i} className="font-display text-4xl mx-8 flex items-center gap-8">
                {c} <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-16 z-40 bg-paper border-b border-ink">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {["Job Fairs", "Open Listings", "Remote Only", "Featured"].map((x) => (
              <button key={x} onClick={() => setTab(x)}
                className={`mono text-[10px] uppercase tracking-widest px-4 py-2 border border-ink ${tab === x ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper"}`}>{x}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["All Categories", "This Month", "Any Budget"].map((x) => (
              <span key={x} className="mono text-[10px] uppercase tracking-widest px-3 py-2 bg-cream border border-[var(--border)]">{x} ▾</span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16 grid lg:grid-cols-[280px_1fr] gap-10">
        {/* SIDEBAR */}
        <aside className="space-y-8">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-accent">Category</div>
            <div className="mt-4 space-y-2">
              {["Design & Creative", "Development & Tech", "Marketing", "Writing", "Video", "Photography"].map((c) => (
                <label key={c} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" className="accent-[var(--accent)] w-4 h-4" defaultChecked={c === "Design & Creative"} /> {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-accent">Location</div>
            <div className="mt-4 space-y-2">
              {["Dubai", "Riyadh", "Cairo", "Beirut", "Remote"].map((c) => (
                <label key={c} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" className="accent-[var(--accent)] w-4 h-4" /> {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-accent">Budget Range</div>
            <input type="range" min={0} max={200} defaultValue={80} className="w-full mt-4 accent-[var(--accent)]" />
            <div className="mono text-[10px] flex justify-between mt-2 text-muted"><span>$0</span><span>$200/hr</span></div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-accent">Fair Type</div>
            <div className="mt-4 space-y-2">
              {["Physical", "Hybrid", "Online"].map((c) => (
                <label key={c} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" className="accent-[var(--accent)] w-4 h-4" /> {c}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="space-y-10">
          {/* FEATURED BANNER */}
          <Reveal>
            <div className="bg-ink text-paper p-10 lg:p-14 border border-ink noise">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="mono text-xs uppercase tracking-widest text-accent">Featured Fair</div>
                  <h2 className="font-display text-5xl md:text-6xl mt-4">GIGS Dubai Talent Summit</h2>
                  <div className="mt-4 flex flex-wrap gap-4 mono text-xs uppercase tracking-widest text-paper/60">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> July 18, 2026</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Madinat Jumeirah</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[["Days", cd.d], ["Hrs", cd.h], ["Min", cd.m], ["Sec", cd.s]].map(([l, v]) => (
                    <div key={l} className="border border-paper/20 p-3 text-center min-w-[64px]">
                      <div className="font-display text-3xl text-accent">{String(v).padStart(2, "0")}</div>
                      <div className="mono text-[9px] uppercase tracking-widest text-paper/60 mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="bg-accent text-paper px-6 py-3 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Register Free</button>
                <button className="border border-paper px-6 py-3 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Book a Booth</button>
              </div>
            </div>
          </Reveal>

          {/* FAIR LIST */}
          <div className="space-y-4">
            <h3 className="font-display text-4xl">Upcoming Fairs</h3>
            {fairs.map((f) => (
              <div key={f.n} className="border border-ink p-6 lg:p-8 bg-cream grid lg:grid-cols-[80px_1fr_auto] gap-6 items-center">
                <div className="w-16 h-16 border border-ink bg-paper flex items-center justify-center font-display text-3xl text-accent">{f.n[0]}</div>
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest text-muted">{f.org}</div>
                  <div className="font-display text-3xl mt-1">{f.n}</div>
                  <div className="mt-3 flex flex-wrap gap-4 mono text-[10px] uppercase tracking-widest text-muted">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{f.d}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.loc}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{f.time}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {f.tags.map((t) => <span key={t} className="mono text-[9px] uppercase tracking-widest border border-ink px-2 py-1">{t}</span>)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="mono text-[10px] uppercase tracking-widest text-accent flex items-center gap-1"><Users className="w-3 h-3" />{f.spots} spots left</div>
                  <button className="bg-ink text-paper px-5 py-2.5 mono text-xs uppercase tracking-widest hover:bg-accent">Register</button>
                </div>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 py-6">
            <span className="h-px flex-1 bg-ink" />
            <span className="mono text-xs uppercase tracking-widest">Open Listings</span>
            <span className="h-px flex-1 bg-ink" />
          </div>

          {/* JOBS */}
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <div key={j.t} className="border border-ink p-6 bg-paper hover:bg-cream transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-ink bg-cream flex items-center justify-center font-display text-lg">{j.co[0]}</div>
                  <div className="mono text-[10px] uppercase tracking-widest text-muted">{j.co}</div>
                </div>
                <div className="font-display text-2xl mt-4">{j.t}</div>
                <div className="mono text-xs mt-2 text-accent">{j.pay}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {j.tags.map((t) => <span key={t} className="mono text-[9px] uppercase tracking-widest border border-ink px-2 py-1">{t}</span>)}
                </div>
                <button className="mt-5 w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent">Apply</button>
              </div>
            ))}
          </div>

          {/* CALENDAR */}
          <div className="pt-8">
            <h3 className="font-display text-4xl">Calendar</h3>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((e) => (
                <div key={e.n} className="border border-ink p-6 flex gap-4 items-start bg-cream">
                  <div className="text-center border border-ink bg-paper w-16 py-2 shrink-0">
                    <div className="font-display text-3xl text-accent">{e.d}</div>
                    <div className="mono text-[9px] uppercase tracking-widest">{e.m}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-xl">{e.n}</div>
                    <span className={`mono text-[9px] uppercase tracking-widest inline-block mt-2 px-2 py-1 border border-ink ${e.type === "Physical" ? "bg-accent text-paper" : e.type === "Online" ? "bg-ink text-paper" : ""}`}>{e.type}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-ink text-paper noise py-20 px-6 lg:px-16">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="mono text-xs uppercase tracking-widest text-accent">Stay in the loop</div>
          <h2 className="font-display text-5xl md:text-7xl mt-4">The fair digest, weekly.</h2>
          <p className="mt-4 text-paper/70 max-w-xl mx-auto">Every Monday: new fairs, freshly posted roles, and one long-read from the community.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input className="flex-1 bg-transparent border border-paper/40 px-4 py-3 mono text-sm outline-none" placeholder="your@email.com" />
            <button className="bg-accent text-paper px-6 py-3 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
