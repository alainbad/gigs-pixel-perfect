import { useState, type ChangeEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function AvatarUpload({
  session,
  avatarUrl,
  onUploaded,
}: {
  session: Session;
  avatarUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${session.user.id}/avatar.${ext}`;

    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", session.user.id);
      onUploaded(url);
    }
    setBusy(false);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-5 mb-10">
      <div className="w-20 h-20 rounded-full overflow-hidden border shrink-0" style={{ borderColor: "var(--border)" }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink text-paper mono text-xl">
            {(session.user.email || "?").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <label className="mono text-xs uppercase tracking-widest hover:text-accent underline underline-offset-4 cursor-pointer">
        {busy ? "Uploading…" : avatarUrl ? "Change photo" : "Upload photo"}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={busy} />
      </label>
    </div>
  );
}
