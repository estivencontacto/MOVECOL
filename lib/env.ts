import { hasSupabaseAdminEnv, hasSupabasePublicEnv } from "@/lib/supabase/env";

export function isSupabaseConfigured() {
  return hasSupabasePublicEnv();
}

export function isSupabaseAdminConfigured() {
  return hasSupabaseAdminEnv();
}
