import type { SupabaseEnv } from "@supabase/server";

export function getSupabaseUrl() {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabasePublishableKey() {
  return (
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getSupabaseJwksUrl() {
  const supabaseUrl = getSupabaseUrl();

  return process.env.SUPABASE_JWKS_URL ?? (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : undefined);
}

export function getSupabasePublicCredentials() {
  return {
    url: getSupabaseUrl(),
    publishableKey: getSupabasePublishableKey()
  };
}

export function resolveSupabaseServerEnv(): Partial<SupabaseEnv> {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();
  const secretKey = getSupabaseSecretKey();
  const jwksUrl = getSupabaseJwksUrl();

  return {
    url: url ?? undefined,
    publishableKeys: publishableKey ? { default: publishableKey } : undefined,
    secretKeys: secretKey ? { default: secretKey } : undefined,
    jwks: jwksUrl ? toUrl(jwksUrl) : undefined
  };
}

export function hasSupabasePublicEnv() {
  const { url, publishableKey } = getSupabasePublicCredentials();

  return Boolean(url && publishableKey);
}

export function hasSupabaseAdminEnv() {
  return Boolean(hasSupabasePublicEnv() && getSupabaseSecretKey());
}

function toUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}
