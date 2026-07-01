import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./supabase";

export type PublicFreelancer = {
  user_id: string;
  headline: string | null;
  bio: string | null;
  skills: string[];
  linkedin_url: string | null;
  availability: "Available" | "Busy" | "Not Available";
  hourly_rate: number | null;
  location: string | null;
  years_experience: number | null;
  phone_country_code: string | null;
  phone: string | null;
  contact_email: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

// Only rows with is_public = true are visible here, enforced by RLS
// (see supabase/migrations/0006_add_public_talent_listing.sql).
export const getPublicTalent = createServerFn({ method: "GET" }).handler(async (): Promise<PublicFreelancer[]> => {
  const { data, error } = await supabase
    .from("freelancer_profiles")
    .select(
      "user_id, headline, bio, skills, linkedin_url, availability, hourly_rate, location, years_experience, phone_country_code, phone, contact_email, profiles(full_name, avatar_url)",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load public talent:", error.message);
    return [];
  }
  return (data as unknown as PublicFreelancer[]) ?? [];
});
