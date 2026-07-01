import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer, Cursor, Reveal } from "@/components/site";
import { Search, Star, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

const marquee = ["Web Design", "Mobile Development", "Content Writing", "Video Editing", "SEO & Marketing", "Branding & Identity", "Photography", "Data Analysis"];
const steps = [
  { n: "01", h: "Browse Profiles", p: "Filter by category, skill, budget and availability. Every profile is verified." },
  { n: "02", h: "Connect Directly", p: "Message freelancers without middlemen. No bidding wars, no gatekeepers." },
  { n: "03", h: "Start Working", p: "Kick off with a clear brief, milestones and transparent hourly or fixed pricing." },
];
const cats = [
  ["Design & Creative", "412 pros"], ["Development & Tech", "681 pros"],
  ["Marketing & Growth", "298 pros"], ["Writing & Content", "354 pros"],
  ["Video & Animation", "187 pros"], ["Finance & Consulting", "142 pros"],
  ["Photography", "203 pros"], ["Legal & Compliance", "76 pros"],
];
const talent = [
  { n: "Layla Haddad", t: "Brand & Identity Designer", r: 4.9, bio: "Editorial systems, wordmarks and packaging for growing consumer brands.", skills: ["Branding", "Figma", "Print"], rate: "$85/hr" },
  { n: "Omar El-Sayed", t: "Full-Stack Engineer", r: 5.0, bio: "Next.js, Postgres and typed APIs. Ships small, fast, on time.", skills: ["React", "Node", "Postgres"], rate: "$110/hr" },
  { n: "Nadia Farouk", t: "Content Strategist", r: 4.8, bio: "Long-form editorial, brand voice guides and bilingual EN/AR content.", skills: ["Copywriting", "SEO", "Arabic"], rate: "$70/hr" },
];
const cards = [
  { n: "Yara K.", t: "Illustrator", r: 4.9, tag: "Available" },
  { n: "Kareem A.", t: "iOS Developer", r: 5.0, tag: "Top Rated" },
  { n: "Salma R.", t: "Motion Designer", r: 4.8, tag: "New" },
  { n: "Faris M.", t: "Data Analyst", r: 4.9, tag: "Verified" },
];
const plans = [
  { n: "Starter", p: "$19", f: ["3 active projects", "Basic search filters", "Community support"] },
  { n: "Pro", p: "$49", f: ["Unlimited projects", "Priority in search", "Verified badge", "Direct messaging"], feat: true },
  { n: "Agency", p: "$99", f: ["Team seats (up to 10)", "Client CRM", "Dedicated manager", "Invoicing tools"] },
];
const testis = [
  { q: "GIGS rebuilt how our studio hires. We found a brand designer in 48 hours who nailed the brief.", n: "Rania T.", r: "Creative Director, Foldwork", dark: true },
  { q: "The lack of bidding is the whole point. Real conversations, fair prices, real work.", n: "Marcus P.", r: "Founder, Northlake" },
  { q: "Job Fairs are the killer feature. We staffed an entire product team from one weekend.", n: "Amira H.", r: "Head of People, Kaya" },
  { q: "Feels like a magazine and works like a marketplace. Rare combination.", n: "Diego V.", r: "Product Lead, Verba" },
];

function Home() {
  return (
    <div className="noise min-h-screen">
      <Cursor />
      <Nav />

      {/* HERO */}
      <section className="pt-16 grid lg:grid-cols-2 min-h-[calc(100vh-64px)]">
        <div className="px-6 lg:px-16 py-16 lg:py-24 flex flex-col justify-center">
          <div className="mono text-xs uppercase tracking-widest text-muted mb-6">Issue 07 — Summer 2026</div>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9]">
            Find the Right<br/>Talent. <span className="text-accent">Right Now.</span>
          </h1>
          <p className="mt-8 text-lg max-w-lg text-muted">
            An editorial marketplace connecting studios and founders with independent talent across design, tech, writing and beyond.
          </p>
          <div className="mt-10 flex items-center bg-cream border border-[var(--border)] max-w-xl">
            <Search className="ml-4 w-4 h-4 text-muted" />
            <input className="flex-1 bg-transparent px-4 py-4 mono text-sm outline-none" placeholder="Try 'brand designer in Dubai'" />
            <button className="bg-ink text-paper px-6 py-4 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors">Search</button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="bg-accent text-paper px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-ink transition-colors inline-flex items-center gap-2">
              Hire Talent <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-ink px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
              Post an Opportunity
            </button>
          </div>
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl">
            {[["2,400+", "Freelancers"], ["180+", "Categories"], ["96%", "Satisfaction"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-4xl">{n}</div>
                <div className="mono text-[10px] uppercase tracking-widest text-muted mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-cream relative overflow-hidden hidden lg:block noise">
          <div className="absolute inset-0 grid grid-cols-2 gap-6 p-12 place-items-center">
            {cards.map((c, i) => (
              <div key={c.n} className={`w-full bg-paper border border-ink p-6 shadow-[8px_8px_0_0_var(--ink)] ${i % 2 === 0 ? "animate-float" : "animate-float-alt"}`}>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-accent/20 border border-ink flex items-center justify-center font-display text-xl">{c.n[0]}</div>
                  <span className="mono text-[9px] uppercase tracking-widest bg-ink text-paper px-2 py-1">{c.tag}</span>
                </div>
                <div className="mt-4 font-display text-2xl">{c.n}</div>
                <div className="mono text-[10px] uppercase tracking-widest text-muted mt-1">{c.t}</div>
                <div className="mt-3 flex items-center gap-1 text-accent">
                  <Star className="w-3 h-3 fill-accent" /><span className="mono text-xs">{c.r}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-ink text-paper py-6 overflow-hidden border-y border-ink">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="font-display text-4xl mx-8 flex items-center gap-8">
              {m} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mono text-xs uppercase tracking-widest text-accent">§ 01 — Process</div>
          <h2 className="font-display text-6xl md:text-8xl mt-4">How It Works</h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="group border border-ink p-10 bg-paper hover:bg-ink hover:text-paper transition-colors">
              <div className="mono text-xs tracking-widest text-accent">{s.n}</div>
              <h3 className="font-display text-4xl mt-6">{s.h}</h3>
              <p className="mt-4 text-muted group-hover:text-paper/70">{s.p}</p>
              <ArrowRight className="mt-10 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="mono text-xs uppercase tracking-widest text-accent">§ 02 — Directory</div>
            <h2 className="font-display text-6xl md:text-8xl mt-4">Categories</h2>
          </div>
          <a href="#" className="mono text-xs uppercase tracking-widest border-b border-ink pb-1 hover:text-accent hover:border-accent">Browse all →</a>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-l border-t border-ink">
          {cats.map(([n, c]) => (
            <a key={n} href="#" className="border-r border-b border-ink p-8 hover:bg-accent hover:text-paper transition-colors group">
              <div className="mono text-[10px] uppercase tracking-widest opacity-60">{c}</div>
              <div className="font-display text-2xl mt-4">{n}</div>
              <ArrowRight className="mt-6 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED TALENT */}
      <section id="talent" className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="mono text-xs uppercase tracking-widest text-accent">§ 03 — Featured</div>
        <h2 className="font-display text-6xl md:text-8xl mt-4">Talent This Week</h2>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {talent.map((p) => (
            <div key={p.n} className="border border-ink p-8 bg-cream">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 border border-ink flex items-center justify-center font-display text-2xl">{p.n[0]}</div>
                <div>
                  <div className="font-display text-2xl">{p.n}</div>
                  <div className="mono text-[10px] uppercase tracking-widest text-muted">{p.t}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3 h-3 fill-accent" />)}
                <span className="mono text-xs ml-2 text-ink">{p.r}</span>
              </div>
              <p className="mt-4 text-sm text-muted">{p.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.skills.map((s) => <span key={s} className="mono text-[10px] uppercase tracking-widest border border-ink px-2 py-1">{s}</span>)}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-2xl">{p.rate}</span>
                <button className="bg-ink text-paper px-5 py-2 mono text-[10px] uppercase tracking-widest hover:bg-accent">Contact</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-ink text-paper noise py-24 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="mono text-xs uppercase tracking-widest text-accent">§ 04 — Pricing</div>
          <h2 className="font-display text-6xl md:text-8xl mt-4">Plans, No Surprises</h2>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.n} className={`p-10 border ${p.feat ? "bg-accent border-accent" : "border-paper/20"}`}>
                <div className="mono text-xs uppercase tracking-widest opacity-70">{p.n}</div>
                <div className="mt-6 font-display text-7xl">{p.p}<span className="text-xl opacity-60">/mo</span></div>
                <ul className="mt-8 space-y-3">
                  {p.f.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 mt-0.5" /> {f}</li>)}
                </ul>
                <button className={`mt-10 w-full py-4 mono text-xs uppercase tracking-widest ${p.feat ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-accent hover:text-paper"} transition-colors`}>Choose {p.n}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="mono text-xs uppercase tracking-widest text-accent">§ 05 — Voices</div>
        <h2 className="font-display text-6xl md:text-8xl mt-4">From the Community</h2>
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {testis.map((t, i) => (
            <div key={i} className={`p-10 border border-ink ${t.dark ? "bg-ink text-paper" : "bg-cream"}`}>
              <div className={`font-display text-3xl leading-tight ${t.dark ? "" : "text-ink"}`}>"{t.q}"</div>
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <div className="mono text-xs uppercase tracking-widest">{t.n}</div>
                  <div className={`mono text-[10px] uppercase tracking-widest ${t.dark ? "text-paper/60" : "text-muted"}`}>{t.r}</div>
                </div>
                <span className="text-accent font-display text-4xl">✦</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 pb-24">
        <div className="max-w-[1400px] mx-auto bg-accent text-paper p-16 md:p-24 border border-ink text-center noise">
          <div className="mono text-xs uppercase tracking-widest">Ready when you are</div>
          <h2 className="font-display text-6xl md:text-8xl mt-6">Hire, or get hired.</h2>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button className="bg-ink text-paper px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Browse Talent</button>
            <button className="border border-paper px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Post an Opportunity</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
