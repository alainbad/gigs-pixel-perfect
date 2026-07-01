import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

type NotifyInput = {
  freelancerId: string;
  posterName: string | null;
  posterEmail: string | null;
  projectType: string;
  budget: string | null;
  message: string | null;
};

// Uses the Supabase service role key (server-only secret) to look up the
// freelancer's account email, then sends them a notification via Resend's
// API. Fails silently from the caller's perspective — the hire request
// itself is already saved via the normal RLS-protected insert; this is a
// best-effort notification on top of that.
export const notifyFreelancerOfHireRequest = createServerFn({ method: "POST" })
  .validator((data: NotifyInput) => data)
  .handler(async ({ data }): Promise<{ error: string | null }> => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      return { error: "Email notifications are not configured" };
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: userData, error: userError } = await admin.auth.admin.getUserById(data.freelancerId);
    const freelancerEmail = userData?.user?.email;

    if (userError || !freelancerEmail) {
      return { error: userError?.message ?? "Freelancer email not found" };
    }

    const html = `
      <p>You have a new hire request on FreeLand${data.posterName ? ` from <strong>${data.posterName}</strong>` : ""}.</p>
      <p><strong>Project:</strong> ${data.projectType}</p>
      ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ""}
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
      ${data.posterEmail ? `<p>You can reply directly to: ${data.posterEmail}</p>` : ""}
      <p>Log in to your FreeLand dashboard to accept or decline this request.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FreeLand <onboarding@resend.dev>",
        to: [freelancerEmail],
        subject: "New hire request on FreeLand",
        html,
      }),
    });

    if (!res.ok) {
      return { error: await res.text() };
    }
    return { error: null };
  });
