import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  createAdminClient as createServerAdminClient,
  createContextClient,
  verifyCredentials
} from "@supabase/server/core";
import type { AuthModeWithKey, SupabaseContext } from "@supabase/server";
import {
  getSupabasePublicCredentials,
  resolveSupabaseServerEnv
} from "@/lib/supabase/env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

type UntypedDatabase = any;

export async function createMoveSupabaseContext(
  options: { auth?: AuthModeWithKey | AuthModeWithKey[] } = { auth: "user" }
): Promise<
  { data: SupabaseContext<UntypedDatabase>; error: null } | { data: null; error: Error }
> {
  const { url, publishableKey } = getSupabasePublicCredentials();

  if (!url || !publishableKey) {
    return {
      data: null,
      error: new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY")
    };
  }

  const cookieStore = await cookies();
  const ssrClient = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            cookieStore.set(name, value, cookieOptions)
          );
        } catch {
          // Middleware refreshes cookies; Server Components cannot always write them.
        }
      }
    }
  });

  const {
    data: { session }
  } = await ssrClient.auth.getSession();
  const env = resolveSupabaseServerEnv();
  const { data: auth, error } = await verifyCredentials(
    { token: session?.access_token ?? null, apikey: null },
    { auth: options.auth ?? "user", env }
  );

  if (error) {
    return { data: null, error };
  }

  return {
    data: {
      supabase: createContextClient<UntypedDatabase>({ auth: { token: auth.token }, env }),
      supabaseAdmin: createServerAdminClient<UntypedDatabase>({ env }),
      userClaims: auth.userClaims,
      jwtClaims: auth.jwtClaims,
      authMode: auth.authMode,
      authKeyName: auth.keyName ?? undefined
    },
    error: null
  };
}
