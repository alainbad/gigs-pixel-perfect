import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export type Role = "freelancer" | "poster";

export type Profile = {
  id: string;
  role: Role;
  full_name: string | null;
  created_at: string;
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!cancelled) {
          setProfile(data as Profile | null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, loading };
}

// Redirects to /login if unauthenticated, or to the other role's dashboard
// if the signed-in user doesn't match `requiredRole`. `ready` is true once
// it's safe to render the protected content.
export function useRequireRole(requiredRole: Role) {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading } = useProfile(session?.user.id);

  const loading = sessionLoading || (!!session && profileLoading);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    if (profile && profile.role !== requiredRole) {
      navigate({ to: profile.role === "poster" ? "/dashboard/poster" : "/dashboard/freelancer" });
    }
  }, [loading, session, profile, requiredRole, navigate]);

  const ready = !loading && !!session && profile?.role === requiredRole;
  return { session, profile, ready };
}
