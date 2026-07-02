import { createAdminClient as createSupabaseAdminClient } from "@supabase/server/core";
import { getSupabaseSecretKey, getSupabaseUrl, resolveSupabaseServerEnv } from "@/lib/supabase/env";

type UntypedDatabase = any;

export function createAdminClient() {
  const supabaseUrl = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!supabaseUrl || !secretKey) {
    throw new Error("Supabase admin credentials are not configured");
  }

  return createSupabaseAdminClient<UntypedDatabase>({
    env: resolveSupabaseServerEnv()
  });
}
