import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { supabase } from "@/lib/supabase";
import { useRequireRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/freelancer")({
  head: () => ({
    meta: [{ title: "Freelancer Dashboard — GIGS" }],
  }),
  component: FreelancerDashboard,
});

const AVAILABILITY = ["Available", "Busy", "Not Available"] as const;

type FreelancerProfile = {
  headline: string;
  bio: string;
  skills: string[];
  portfolio_url: string;
  availability: (typeof AVAILABILITY)[number];
  hourly_rate: string;
  location: string;
  years_experience: string;
};

const EMPTY: FreelancerProfile = {
  headline: "",
  bio: "",
  skills: [],
  portfolio_url: "",
  availability: "Available",
  hourly_rate: "",
  location: "",
  years_experience: "",
};

function FreelancerDashboard() {
  const navigate = useNavigate();
  const { session, profile, ready } = useRequireRole("freelancer");
  const [form, setForm] = useState<FreelancerProfile>(EMPTY);
  const [skillsInput, setSkillsInput] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!ready || !session) return;
    supabase
      .from("freelancer_profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            headline: data.headline ?? "",
            bio: data.bio ?? "",
            skills: data.skills ?? [],
            portfolio_url: data.portfolio_url ?? "",
            availability: data.availability ?? "Available",
            hourly_rate: data.hourly_rate?.toString() ?? "",
            location: data.location ?? "",
            years_experience: data.years_experience?.toString() ?? "",
          });
          setSkillsInput((data.skills ?? []).join(", "));
        }
        setLoadingProfile(false);
      });
  }, [ready, session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSaving(true);

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await supabase.from("freelancer_profiles").upsert({
      user_id: session.user.id,
      headline: form.headline,
      bio: form.bio,
      skills,
      portfolio_url: form.portfolio_url,
      availability: form.availability,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      location: form.location,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setSavedAt(Date.now());
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p className="mono text-xs uppercase tracking-widest text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Cursor />
      <Nav />
      <section className="pt-32 pb-24 max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-5xl">Your Dashboard.</h1>
          <button
            onClick={handleSignOut}
            className="mono text-xs uppercase tracking-widest text-muted hover:text-accent underline underline-offset-4"
          >
            Sign out
          </button>
        </div>
        <p className="mono text-xs uppercase tracking-widest text-muted mb-10">
          Signed in as {profile?.full_name || session?.user.email}
        </p>

        {loadingProfile ? (
          <p className="mono text-xs uppercase tracking-widest text-muted">Loading profile…</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Headline</div>
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Brand designer for early-stage startups"
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Bio</div>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Skills (comma separated)</div>
              <input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Figma, Brand Identity, Illustration"
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Hourly rate (USD)</div>
                <input
                  type="number"
                  min="0"
                  value={form.hourly_rate}
                  onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Years of experience</div>
                <input
                  type="number"
                  min="0"
                  value={form.years_experience}
                  onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Location / timezone</div>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Beirut, GMT+2"
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Portfolio URL</div>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                placeholder="https://"
                className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Availability</div>
              <div className="grid grid-cols-3 gap-1">
                {AVAILABILITY.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setForm({ ...form, availability: a })}
                    className="text-xs py-2 border transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      background: form.availability === a ? "var(--ink)" : "transparent",
                      color: form.availability === a ? "var(--paper)" : "var(--ink)",
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            {savedAt && (
              <p className="mono text-xs text-muted">Saved.</p>
            )}
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
}
