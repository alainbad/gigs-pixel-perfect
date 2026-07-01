import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log In — GIGS" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    navigate({ to: profile?.role === "poster" ? "/dashboard/poster" : "/dashboard/freelancer" });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Cursor />
      <Nav />
      <section className="pt-32 pb-24 max-w-md mx-auto px-6">
        <h1 className="text-5xl mb-2">Log In.</h1>
        <p className="mono text-xs uppercase tracking-widest text-muted mb-10">
          Welcome back to GIGS
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {error && <p className="text-accent text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="mono text-xs text-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </form>
      </section>
      <Footer />
    </div>
  );
}
