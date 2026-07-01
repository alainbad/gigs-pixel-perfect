import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { supabase } from "@/lib/supabase";
import type { Role } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign Up — FreeLand" }],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("freelancer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "check-email" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setStatus("error");
      return;
    }

    if (data.session) {
      navigate({ to: role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/poster" });
      return;
    }

    // No session yet: Supabase project requires email confirmation.
    setStatus("check-email");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Cursor />
      <Nav />
      <section className="pt-32 pb-24 max-w-md mx-auto px-6">
        <h1 className="text-5xl mb-2">Sign Up.</h1>
        <p className="mono text-xs uppercase tracking-widest text-muted mb-10">
          Create your FreeLand account
        </p>

        {status === "check-email" ? (
          <div className="border border-[var(--border)] p-6">
            <p>Check your email to confirm your account, then log in.</p>
            <Link to="/login" className="mono text-xs uppercase tracking-widest text-accent underline underline-offset-4 mt-4 inline-block">
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">I am a...</div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className="text-xs py-3 border transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: role === "freelancer" ? "var(--ink)" : "transparent",
                    color: role === "freelancer" ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("poster")}
                  className="text-xs py-3 border transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: role === "poster" ? "var(--ink)" : "transparent",
                    color: role === "poster" ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  Job Poster
                </button>
              </div>
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Full name</div>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Email</div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Password</div>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            {error && <p className="text-accent text-sm">{error}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Creating account…" : "Create account"}
            </button>

            <p className="mono text-xs text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-accent underline underline-offset-4">
                Log in
              </Link>
            </p>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
}
