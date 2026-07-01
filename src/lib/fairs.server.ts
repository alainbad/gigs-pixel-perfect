import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./supabase";
import { type Fair, SEED_FAIRS } from "./fairs-data";

// Reads from the public.fairs table (see supabase/migrations/0001_create_fairs.sql).
// Falls back to SEED_FAIRS if the table is empty or the request fails, so the
// page keeps rendering even before Supabase is fully set up.
export const getFairs = createServerFn({ method: "GET" }).handler(async (): Promise<Fair[]> => {
  const { data, error } = await supabase.from("fairs").select("*").order("iso", { ascending: true });

  if (error) {
    console.error("Failed to load fairs from Supabase, falling back to seed data:", error.message);
    return SEED_FAIRS;
  }
  if (!data || data.length === 0) {
    return SEED_FAIRS;
  }
  return data as Fair[];
});
