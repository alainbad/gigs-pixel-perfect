import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./supabase";

export type PublicJob = {
  id: string;
  title: string;
  description: string | null;
  budget: string | null;
  currency: string;
  employment_type: "Full-time" | "Part-time";
  work_mode: "On-site" | "Remote" | "Hybrid";
  skills: string[];
  created_at: string;
  companies: {
    name: string;
    website: string | null;
  } | null;
};

export type PublicJobsResult = {
  jobs: PublicJob[];
  error: string | null;
};

// Job postings are public by default (see supabase/migrations/0008_add_public_job_listing.sql).
export const getPublicJobs = createServerFn({ method: "GET" }).handler(async (): Promise<PublicJobsResult> => {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, description, budget, currency, employment_type, work_mode, skills, created_at, companies(name, website)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { jobs: [], error: error.message };
  }
  return { jobs: (data as unknown as PublicJob[]) ?? [], error: null };
});
