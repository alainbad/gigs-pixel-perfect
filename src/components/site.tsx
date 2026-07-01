import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    const m = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setBig(!!t.closest("a,button,[role='button'],input,textarea,select,.hover-grow"));
    };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-[9999] rounded-full transition-[width,height,background] duration-150"
      style={{
        left: pos.x,
        top: pos.y,
        width: big ? 36 : 12,
        height: big ? 36 : 12,
        transform: "translate(-50%,-50%)",
        background: "var(--accent)",
        mixBlendMode: "difference",
      }}
    />
  );
}

export function Nav({ active }: { active?: "how" | "browse" | "fairs" | "pricing" }) {
  const items: Array<{ key: string; label: string; to: string }> = [
    { key: "how", label: "How It Works", to: "/#how" },
    { key: "browse", label: "Browse Talent", to: "/#talent" },
    { key: "fairs", label: "Job Fairs", to: "/job-fairs" },
    { key: "pricing", label: "Pricing", to: "/#pricing" },
  ];
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-paper/85 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
        <Link to="/" className="font-display text-3xl tracking-wider">
          GIG<span className="text-accent">S</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 mono text-xs uppercase tracking-widest">
          {items.map((i) =>
            i.to.startsWith("/#") ? (
              <li key={i.key}>
                <a href={i.to} className={active === i.key ? "text-accent" : "hover:text-accent"}>{i.label}</a>
              </li>
            ) : (
              <li key={i.key}>
                <Link to={i.to} className={active === i.key ? "text-accent" : "hover:text-accent"}>{i.label}</Link>
              </li>
            ),
          )}
        </ul>
        <button className="bg-ink text-paper px-5 py-2.5 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors">
          Join as Freelancer
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-4xl tracking-wider">GIG<span className="text-accent">S</span></div>
          <p className="mono text-xs mt-4 text-paper/60 leading-relaxed">
            The editorial marketplace for freelance talent. Est. 2024.
          </p>
        </div>
        {[
          { h: "Platform", l: ["Browse Talent", "Job Fairs", "Pricing", "How It Works"] },
          { h: "Company", l: ["About", "Careers", "Press", "Contact"] },
          { h: "Legal", l: ["Terms", "Privacy", "Cookies", "Guidelines"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="mono text-xs uppercase tracking-widest text-accent">{c.h}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {c.l.map((x) => <li key={x}><a href="#" className="hover:text-accent">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-paper/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex justify-between mono text-xs text-paper/50">
          <span>© 2026 GIGS. All rights reserved.</span>
          <span>Made with intent.</span>
        </div>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
