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

const EMERALD = "#064e3b";
const EMERALD_MID = "#0d7a5f";
const GOLD = "#c9a84c";
const PARCH = "#f5f0e0";

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
    <div className="min-h-screen" style={{ background: PARCH, color: EMERALD, fontFamily: '"Work Sans", sans-serif' }}>
      <Cursor />
      <Nav />
      <section className="pt-40 pb-24 max-w-md mx-auto px-6">
        <div className="text-xs tracking-widest uppercase mb-4" style={{ color: `${EMERALD}99` }}>
          Join FreeLand
        </div>
        <h1 className="text-6xl leading-[0.95] mb-6" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Sign <span className="italic" style={{ color: EMERALD_MID }}>Up.</span>
        </h1>

        {status === "check-email" ? (
          <div className="border p-6 mt-10" style={{ borderColor: `${EMERALD}33` }}>
            <p>Check your email to confirm your account, then log in.</p>
            <Link
              to="/login"
              className="text-xs uppercase tracking-widest underline underline-offset-4 mt-4 inline-block"
              style={{ color: EMERALD_MID }}
            >
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>I am a...</div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className="text-xs py-3 border transition-colors"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: role === "freelancer" ? EMERALD : "transparent",
                    color: role === "freelancer" ? PARCH : EMERALD,
                  }}
                >
                  Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("poster")}
                  className="text-xs py-3 border transition-colors"
                  style={{
                    borderColor: `${EMERALD}55`,
                    background: role === "poster" ? EMERALD : "transparent",
                    color: role === "poster" ? PARCH : EMERALD,
                  }}
                >
                  Job Poster
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: `${EMERALD}99` }}>Full name</div>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: `${EMERALD}55` }}
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: `${EMERALD}55` }}
              />
            </div>

            {error && <p className="text-sm" style={{ color: "#b3261e" }}>{error}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
              style={{ background: GOLD, color: EMERALD }}
            >
              {status === "loading" ? "Creating account…" : "Create account"}
            </button>

            <p className="text-xs" style={{ color: `${EMERALD}99` }}>
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4" style={{ color: EMERALD_MID }}>
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
