import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer, Cursor, Reveal, Modal, Field, TextArea } from "@/components/site";
import { Search, Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

const marquee = ["Web Design", "Mobile Development", "Content Writing", "Video Editing", "SEO & Marketing", "Branding & Identity", "Photography", "Data Analysis"];

const heroCards = [
  { n: "Yara K.", t: "Illustrator", r: 4.9, tag: "Available", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { n: "Kareem A.", t: "iOS Developer", r: 5.0, tag: "Top Rated", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { n: "Salma R.", t: "Motion Designer", r: 4.8, tag: "New", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { n: "Faris M.", t: "Data Analyst", r: 4.9, tag: "Verified", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
];

const steps = [
  { n: "01", h: "Browse Profiles", p: "Filter by category, skill, budget and availability. Every profile is verified.", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" },
  { n: "02", h: "Connect Directly", p: "Message freelancers without middlemen. No bidding wars, no gatekeepers.", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" },
  { n: "03", h: "Start Working", p: "Kick off with a clear brief, milestones and transparent hourly or fixed pricing.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" },
];

const cats = [
  { n: "Design & Creative", c: "412 pros", img: "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&q=80&w=600" },
  { n: "Development", c: "681 pros", img: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=600" },
  { n: "Writing & Content", c: "354 pros", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600" },
  { n: "Video & Motion", c: "187 pros", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600" },
  { n: "Marketing & SEO", c: "298 pros", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600" },
  { n: "Photography", c: "203 pros", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600" },
  { n: "Audio & Music", c: "94 pros", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600" },
  { n: "Data & Analytics", c: "142 pros", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
];

const talent = [
  { n: "Nadia Osei", t: "Brand Designer", r: 4.9, bio: "Editorial systems, wordmarks and packaging for growing consumer brands.", skills: ["Branding", "Figma", "Print"], rate: "$85/hr", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
  { n: "Julian Vega", t: "Full-Stack Engineer", r: 5.0, bio: "Next.js, Postgres and typed APIs. Ships small, fast, on time.", skills: ["React", "Node", "Postgres"], rate: "$110/hr", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400" },
  { n: "Priya Ramnath", t: "Content Strategist", r: 4.8, bio: "Long-form editorial, brand voice guides and bilingual EN/AR content.", skills: ["Copywriting", "SEO", "Editorial"], rate: "$70/hr", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
];

const plans = [
  { n: "Starter", p: "$19", f: ["3 active projects", "Basic search filters", "Community support"] },
  { n: "Pro", p: "$49", f: ["Unlimited projects", "Priority in search", "Verified badge", "Direct messaging"], feat: true },
  { n: "Agency", p: "$99", f: ["Team seats (up to 10)", "Client CRM", "Dedicated manager", "Invoicing tools"] },
];

const testis = [
  { q: "FreeLand rebuilt how our studio hires. We found a brand designer in 48 hours who nailed the brief.", n: "Rania T.", r: "Creative Director, Foldwork", dark: true, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=200" },
  { q: "The lack of bidding is the whole point. Real conversations, fair prices, real work.", n: "Marcus P.", r: "Founder, Northlake", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  { q: "Job Fairs are the killer feature. We staffed an entire product team from one weekend.", n: "Amira H.", r: "Head of People, Kaya", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" },
  { q: "Feels like a magazine and works like a marketplace. Rare combination.", n: "Diego V.", r: "Product Lead, Verba", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" },
];

function Home() {
  const [join, setJoin] = useState(false);
  const [hire, setHire] = useState(false);
  const [post, setPost] = useState(false);

  return (
    <div className="noise min-h-screen">
      <Cursor />
      <Nav />

      {/* HERO */}
      <section className="pt-16 grid lg:grid-cols-2 min-h-[calc(100vh-64px)]">
        <div className="px-6 lg:px-16 py-16 lg:py-24 flex flex-col justify-center">
          <div className="mono text-xs uppercase tracking-widest text-muted mb-6">Issue 07 — Summer 2026</div>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9]">
            Find the Right<br />Talent. <span className="text-accent">Right Now.</span>
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
            <button onClick={() => setHire(true)} className="bg-accent text-paper px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-ink transition-colors inline-flex items-center gap-2">
              Hire Talent <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setPost(true)} className="border border-ink px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
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
            {heroCards.map((c, i) => (
              <div key={c.n} className={`w-full bg-paper border border-ink shadow-[8px_8px_0_0_var(--ink)] ${i % 2 === 0 ? "animate-float" : "animate-float-alt"}`}>
                <div className="aspect-[4/3] overflow-hidden border-b border-ink">
                  <img src={c.img} alt={c.n} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-xl">{c.n}</div>
                    <span className="mono text-[9px] uppercase tracking-widest bg-ink text-paper px-2 py-1">{c.tag}</span>
                  </div>
                  <div className="mono text-[10px] uppercase tracking-widest text-muted mt-1">{c.t}</div>
                  <div className="mt-2 flex items-center gap-1 text-accent">
                    <Star className="w-3 h-3 fill-accent" /><span className="mono text-xs">{c.r}</span>
                  </div>
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
              {m} <span className="text-gold">✦</span>
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
            <Reveal key={s.n}>
              <div className="group border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.img} alt={s.h} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="mono text-xs tracking-widest text-accent">{s.n}</div>
                  <h3 className="font-display text-4xl mt-4">{s.h}</h3>
                  <p className="mt-4 text-muted group-hover:text-paper/70">{s.p}</p>
                  <ArrowRight className="mt-8 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Reveal>
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
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {cats.map((c) => (
            <a key={c.n} href="#" className="group relative overflow-hidden border border-ink aspect-[4/5] block">
              <img src={c.img} alt={c.n} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-paper">
                <div className="mono text-[10px] uppercase tracking-widest opacity-70">{c.c}</div>
                <div className="font-display text-2xl mt-2">{c.n}</div>
                <ArrowRight className="mt-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
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
            <Reveal key={p.n}>
              <div className="border border-ink p-8 bg-cream">
                <div className="flex items-center gap-4">
                  <img src={p.img} alt={p.n} className="w-16 h-16 rounded-full object-cover border border-ink" />
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
                  <button onClick={() => setHire(true)} className="bg-ink text-paper px-5 py-2 mono text-[10px] uppercase tracking-widest hover:bg-accent">Contact</button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-ink text-paper noise py-24 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="mono text-xs uppercase tracking-widest text-accent">§ 04 — Pricing</div>
          <h2 className="font-display text-6xl md:text-8xl mt-4">Plans, No Surprises</h2>
          <div className="mt-16 grid md:grid-cols-3 gap-6 items-start">
            {plans.map((p) => (
              <div key={p.n} className={`p-10 border ${p.feat ? "bg-accent border-accent scale-105" : "border-paper/20"}`}>
                <div className="mono text-xs uppercase tracking-widest opacity-70">{p.n}</div>
                <div className="mt-6 font-display text-7xl">{p.p}<span className="text-xl opacity-60">/mo</span></div>
                <ul className="mt-8 space-y-3">
                  {p.f.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><ArrowRight className="w-4 h-4 mt-0.5 shrink-0" /> {f}</li>)}
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
              <div className={`font-display text-3xl leading-tight`}>"{t.q}"</div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.n} className="w-10 h-10 rounded-full object-cover border border-current" />
                  <div>
                    <div className="mono text-xs uppercase tracking-widest">{t.n}</div>
                    <div className={`mono text-[10px] uppercase tracking-widest ${t.dark ? "text-paper/60" : "text-muted"}`}>{t.r}</div>
                  </div>
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
          <h2 className="font-display text-6xl md:text-8xl mt-6">Ready to hire the right person?</h2>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button onClick={() => setHire(true)} className="bg-ink text-paper px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Browse Talent</button>
            <button onClick={() => setJoin(true)} className="border border-paper px-8 py-4 mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink">Join as Freelancer</button>
          </div>
        </div>
      </section>

      <Footer />

      <Modal open={join} onClose={() => setJoin(false)} title="Join as Freelancer">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setJoin(false); }}>
          <Field label="Full name" placeholder="Jane Doe" required />
          <Field label="Email" type="email" placeholder="jane@studio.com" required />
          <Field label="Primary skill" placeholder="Brand designer" required />
          <Field label="Hourly rate (USD)" type="number" placeholder="85" required />
          <button type="submit" className="w-full bg-ink text-paper py-4 mono text-xs uppercase tracking-widest hover:bg-accent">Create profile</button>
        </form>
      </Modal>

      <Modal open={hire} onClose={() => setHire(false)} title="Hire Talent">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setHire(false); }}>
          <Field label="Name" placeholder="Your name" required />
          <Field label="Email" type="email" placeholder="you@company.com" required />
          <Field label="Project type" placeholder="Brand identity, mobile app…" required />
          <TextArea label="Brief" placeholder="Tell us about the work…" required />
          <button type="submit" className="w-full bg-accent text-paper py-4 mono text-xs uppercase tracking-widest hover:bg-ink">Send brief</button>
        </form>
      </Modal>

      <Modal open={post} onClose={() => setPost(false)} title="Post an Opportunity">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setPost(false); }}>
          <Field label="Role title" placeholder="Senior product designer" required />
          <Field label="Budget" placeholder="$5,000 — $8,000" required />
          <Field label="Location" placeholder="Remote / Dubai" required />
          <TextArea label="Description" placeholder="What are you building?" required />
          <button type="submit" className="w-full bg-ink text-paper py-4 mono text-xs uppercase tracking-widest hover:bg-accent">Post opportunity</button>
        </form>
      </Modal>
    </div>
  );
}
