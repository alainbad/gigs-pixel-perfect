import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log In — FreeLand" }],
  }),
  component: LoginPage,
});

const EMERALD = "#064e3b";
const EMERALD_MID = "#0d7a5f";
const GOLD = "#c9a84c";
const PARCH = "#f5f0e0";

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
    <div className="min-h-screen" style={{ background: PARCH, color: EMERALD, fontFamily: '"Work Sans", sans-serif' }}>
      <Cursor />
      <Nav />
      <section className="pt-40 pb-24 max-w-md mx-auto px-6">
        <div className="text-xs tracking-widest uppercase mb-4" style={{ color: `${EMERALD}99` }}>
          Welcome back
        </div>
        <h1 className="text-6xl leading-[0.95] mb-6" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Log <span className="italic" style={{ color: EMERALD_MID }}>In.</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Email</div>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
              style={{ borderColor: `${EMERALD}55` }}
            />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Password</div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
              style={{ borderColor: `${EMERALD}55` }}
            />
          </div>

          {error && <p className="text-sm" style={{ color: "#b3261e" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
            style={{ background: GOLD, color: EMERALD }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="text-xs" style={{ color: `${EMERALD}99` }}>
            Don't have an account?{" "}
            <Link to="/signup" className="underline underline-offset-4" style={{ color: EMERALD_MID }}>
              Sign up
            </Link>
          </p>
        </form>
      </section>
      <Footer />
    </div>
  );
}
