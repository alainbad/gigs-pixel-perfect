import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
      className="pointer-events-none fixed z-[9999] rounded-full transition-[width,height,background] duration-150 hidden md:block"
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
          Free<span className="text-accent">Land</span>
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
        <div className="flex items-center gap-4">
          <Link to="/login" className="mono text-xs uppercase tracking-widest hover:text-accent hidden sm:inline">
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-ink text-paper px-5 py-2.5 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-4xl tracking-wider">Free<span className="text-accent">Land</span></div>
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
          <span>© 2026 FreeLand. All rights reserved.</span>
          <span>Made with intent.</span>
        </div>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {children}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-paper border border-ink w-full max-w-lg p-8 lg:p-10 relative shadow-[12px_12px_0_0_var(--ink)]"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="mono text-[10px] uppercase tracking-widest text-accent">FreeLand</div>
          <button onClick={onClose} className="mono text-xs uppercase tracking-widest hover:text-accent">Close ✕</button>
        </div>
        <h3 className="font-display text-4xl md:text-5xl leading-none">{title}</h3>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <input {...props} className="mt-2 w-full bg-cream border border-ink px-3 py-3 mono text-sm outline-none focus:border-accent" />
    </label>
  );
}

export function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <textarea {...props} rows={4} className="mt-2 w-full bg-cream border border-ink px-3 py-3 mono text-sm outline-none focus:border-accent" />
    </label>
  );
}
