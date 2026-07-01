import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav, Footer, Cursor } from "@/components/site";
import { AvatarUpload } from "@/components/avatar-upload";
import { supabase } from "@/lib/supabase";
import { useRequireRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/freelancer")({
  head: () => ({
    meta: [{ title: "Freelancer Dashboard — FreeLand" }],
  }),
  component: FreelancerDashboard,
});

const AVAILABILITY = ["Available", "Busy", "Not Available"] as const;
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

const COUNTRY_CODES = [
  { code: "+961", label: "Lebanon (+961)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+962", label: "Jordan (+962)" },
  { code: "+90", label: "Turkey (+90)" },
  { code: "+1", label: "US / Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+91", label: "India (+91)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+63", label: "Philippines (+63)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+55", label: "Brazil (+55)" },
  { code: "+52", label: "Mexico (+52)" },
] as const;

type FreelancerProfile = {
  headline: string;
  bio: string;
  skills: string[];
  linkedin_url: string;
  availability: (typeof AVAILABILITY)[number];
  hourly_rate: string;
  location: string;
  years_experience: string;
  phone_country_code: string;
  phone: string;
  contact_email: string;
  is_public: boolean;
};

const EMPTY: FreelancerProfile = {
  headline: "",
  bio: "",
  skills: [],
  linkedin_url: "",
  availability: "Available",
  hourly_rate: "",
  location: "",
  years_experience: "",
  phone_country_code: "+961",
  phone: "",
  contact_email: "",
  is_public: false,
};

type ProjectReference = {
  id: string;
  title: string;
  description: string | null;
  file_paths: string[];
};

function fileNameFromPath(path: string) {
  return path.split("/").pop() ?? path;
}

function isImagePath(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.includes(ext);
}

function FreelancerDashboard() {
  const navigate = useNavigate();
  const { session, profile, ready } = useRequireRole("freelancer");
  const [form, setForm] = useState<FreelancerProfile>(EMPTY);
  const [skillsInput, setSkillsInput] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [cvPath, setCvPath] = useState<string | null>(null);
  const [cvBusy, setCvBusy] = useState(false);

  const [references, setReferences] = useState<ProjectReference[]>([]);
  const [refTitle, setRefTitle] = useState("");
  const [refDescription, setRefDescription] = useState("");
  const [refFiles, setRefFiles] = useState<FileList | null>(null);
  const [addingRef, setAddingRef] = useState(false);

  useEffect(() => {
    if (profile) setAvatarUrl(profile.avatar_url);
  }, [profile]);

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
            linkedin_url: data.linkedin_url ?? "",
            availability: data.availability ?? "Available",
            hourly_rate: data.hourly_rate?.toString() ?? "",
            location: data.location ?? "",
            years_experience: data.years_experience?.toString() ?? "",
            phone_country_code: data.phone_country_code ?? "+961",
            phone: data.phone ?? "",
            contact_email: data.contact_email ?? "",
            is_public: data.is_public ?? false,
          });
          setSkillsInput((data.skills ?? []).join(", "));
          setCvPath(data.cv_path ?? null);
        }
        setLoadingProfile(false);
      });
  }, [ready, session]);

  useEffect(() => {
    if (!ready || !session) return;
    supabase
      .from("project_references")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReferences((data as ProjectReference[]) ?? []));
  }, [ready, session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    setSaveError(null);
    setSavedAt(null);

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase.from("freelancer_profiles").upsert({
      user_id: session.user.id,
      headline: form.headline,
      bio: form.bio,
      skills,
      linkedin_url: form.linkedin_url,
      availability: form.availability,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      location: form.location,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
      phone_country_code: form.phone_country_code,
      phone: form.phone,
      contact_email: form.contact_email,
      is_public: form.is_public,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (error) {
      setSaveError(error.message);
    } else {
      setSavedAt(Date.now());
    }
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setCvBusy(true);

    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${session.user.id}/cv.${ext}`;

    const { error } = await supabase.storage.from("cvs").upload(path, file, { upsert: true });
    if (!error) {
      await supabase
        .from("freelancer_profiles")
        .upsert({ user_id: session.user.id, cv_path: path }, { onConflict: "user_id" });
      setCvPath(path);
    }
    setCvBusy(false);
    e.target.value = "";
  }

  async function handleCvDownload() {
    if (!cvPath) return;
    const { data } = await supabase.storage.from("cvs").createSignedUrl(cvPath, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function handleCvRemove() {
    if (!cvPath || !session) return;
    setCvBusy(true);
    await supabase.storage.from("cvs").remove([cvPath]);
    await supabase
      .from("freelancer_profiles")
      .upsert({ user_id: session.user.id, cv_path: null }, { onConflict: "user_id" });
    setCvPath(null);
    setCvBusy(false);
  }

  async function handleAddReference(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !refTitle.trim()) return;
    setAddingRef(true);

    const id = crypto.randomUUID();
    const filePaths: string[] = [];

    if (refFiles) {
      for (const file of Array.from(refFiles)) {
        const path = `${session.user.id}/${id}/${file.name}`;
        const { error } = await supabase.storage.from("project-files").upload(path, file, { upsert: true });
        if (!error) filePaths.push(path);
      }
    }

    const { data } = await supabase
      .from("project_references")
      .insert({
        id,
        user_id: session.user.id,
        title: refTitle,
        description: refDescription,
        file_paths: filePaths,
      })
      .select()
      .single();

    if (data) {
      setReferences((prev) => [data as ProjectReference, ...prev]);
      setRefTitle("");
      setRefDescription("");
      setRefFiles(null);
    }
    setAddingRef(false);
  }

  async function handleDeleteReference(ref: ProjectReference) {
    if (ref.file_paths.length > 0) {
      await supabase.storage.from("project-files").remove(ref.file_paths);
    }
    await supabase.from("project_references").delete().eq("id", ref.id);
    setReferences((prev) => prev.filter((r) => r.id !== ref.id));
  }

  function projectFileUrl(path: string) {
    return supabase.storage.from("project-files").getPublicUrl(path).data.publicUrl;
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
        <p className="mono text-xs uppercase tracking-widest text-muted mb-6">
          Signed in as {profile?.full_name || session?.user.email}
        </p>

        {session && <AvatarUpload session={session} avatarUrl={avatarUrl} onUploaded={setAvatarUrl} />}

        {loadingProfile ? (
          <p className="mono text-xs uppercase tracking-widest text-muted">Loading profile…</p>
        ) : (
          <>
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
                <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">LinkedIn URL</div>
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/…"
                  className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Mobile number</div>
                  <div className="flex gap-2">
                    <select
                      value={form.phone_country_code}
                      onChange={(e) => setForm({ ...form, phone_country_code: e.target.value })}
                      className="bg-transparent border px-2 py-3 text-sm outline-none shrink-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="00 000 000"
                      className="flex-1 min-w-0 bg-transparent border px-3 py-3 text-sm outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Contact email</div>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
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

              <label
                className="flex items-center justify-between gap-4 border px-4 py-3 cursor-pointer"
                style={{ borderColor: "var(--border)" }}
              >
                <span>
                  <span className="block">List me on Browse Talent</span>
                  <span className="mono text-xs text-muted">
                    Makes this profile (not your CV) visible to anyone browsing the site.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={form.is_public}
                  onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                  className="w-5 h-5 shrink-0"
                  style={{ accentColor: "var(--ink)" }}
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
              {savedAt && <p className="mono text-xs text-muted">Saved.</p>}
              {saveError && <p className="mono text-xs text-accent">Save failed: {saveError}</p>}
            </form>

            <div className="mt-16">
              <h2 className="text-2xl mb-4">CV / Resume</h2>
              {cvPath ? (
                <div
                  className="flex items-center justify-between gap-4 border px-4 py-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-sm truncate">{fileNameFromPath(cvPath)}</span>
                  <div className="flex gap-4 shrink-0">
                    <button
                      onClick={handleCvDownload}
                      className="mono text-xs uppercase tracking-widest hover:text-accent underline underline-offset-4"
                    >
                      View
                    </button>
                    <label className="mono text-xs uppercase tracking-widest hover:text-accent underline underline-offset-4 cursor-pointer">
                      Replace
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvUpload} disabled={cvBusy} />
                    </label>
                    <button
                      onClick={handleCvRemove}
                      disabled={cvBusy}
                      className="mono text-xs uppercase tracking-widest text-muted hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className="flex items-center justify-center border border-dashed px-4 py-8 cursor-pointer hover:border-accent transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="mono text-xs uppercase tracking-widest text-muted">
                    {cvBusy ? "Uploading…" : "Upload your CV (PDF or Word)"}
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvUpload} disabled={cvBusy} />
                </label>
              )}
            </div>

            <div className="mt-16">
              <h2 className="text-2xl mb-4">Project references</h2>
              <p className="mono text-xs text-muted mb-6">
                Showcase past work with photos or files clients can view on your profile.
              </p>

              <form onSubmit={handleAddReference} className="space-y-4 mb-10">
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Project title</div>
                  <input
                    required
                    value={refTitle}
                    onChange={(e) => setRefTitle(e.target.value)}
                    placeholder="e.g. Brand identity for Foldwork"
                    className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Description</div>
                  <textarea
                    rows={3}
                    value={refDescription}
                    onChange={(e) => setRefDescription(e.target.value)}
                    className="w-full bg-transparent border px-3 py-3 text-sm outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest mb-2 text-muted">Photos or files</div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setRefFiles(e.target.files)}
                    className="w-full bg-transparent border px-3 py-3 text-sm outline-none file:mr-3 file:border-0 file:bg-ink file:text-paper file:px-3 file:py-1.5 file:mono file:text-xs file:uppercase file:tracking-widest"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingRef}
                  className="w-full bg-ink text-paper py-3 mono text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {addingRef ? "Adding…" : "Add project"}
                </button>
              </form>

              {references.length === 0 ? (
                <p className="mono text-xs uppercase tracking-widest text-muted">No project references yet.</p>
              ) : (
                <div className="space-y-6">
                  {references.map((ref) => (
                    <div key={ref.id} className="border p-5" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xl">{ref.title}</div>
                          {ref.description && <p className="text-sm text-muted mt-1">{ref.description}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteReference(ref)}
                          className="mono text-xs uppercase tracking-widest text-muted hover:text-accent shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                      {ref.file_paths.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {ref.file_paths.map((path) =>
                            isImagePath(path) ? (
                              <a key={path} href={projectFileUrl(path)} target="_blank" rel="noreferrer">
                                <img
                                  src={projectFileUrl(path)}
                                  alt={fileNameFromPath(path)}
                                  className="w-24 h-24 object-cover border"
                                  style={{ borderColor: "var(--border)" }}
                                />
                              </a>
                            ) : (
                              <a
                                key={path}
                                href={projectFileUrl(path)}
                                target="_blank"
                                rel="noreferrer"
                                className="mono text-xs uppercase tracking-widest px-3 py-2 border hover:text-accent"
                                style={{ borderColor: "var(--border)" }}
                              >
                                {fileNameFromPath(path)}
                              </a>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
