import "server-only";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export const DRIVER_SESSION_COOKIE = "move_driver_session";
export const DRIVER_SESSION_MAX_AGE_SECONDS = 4 * 60 * 60;

type DriverSession = { driverId: string; expiresAt: number };

function getSecret() {
  const secret = process.env.DRIVER_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("DRIVER_SESSION_SECRET must contain at least 32 characters");
  return secret;
}

function encode(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return encode(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))));
}

export async function createDriverSessionToken(driverId: string) {
  const session: DriverSession = { driverId, expiresAt: Math.floor(Date.now() / 1000) + DRIVER_SESSION_MAX_AGE_SECONDS };
  const payload = encode(new TextEncoder().encode(JSON.stringify(session)));
  return `${payload}.${await sign(payload)}`;
}

export async function verifyDriverSessionToken(token?: string | null): Promise<DriverSession | null> {
  if (!token) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = await sign(payload);
  if (signature.length !== expected.length) return null;
  let mismatch = 0;
  for (let index = 0; index < signature.length; index += 1) mismatch |= signature.charCodeAt(index) ^ expected.charCodeAt(index);
  if (mismatch !== 0) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DriverSession;
    if (!/^[0-9a-f-]{36}$/i.test(session.driverId) || session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getDriverSession() {
  const cookieStore = await cookies();
  return verifyDriverSessionToken(cookieStore.get(DRIVER_SESSION_COOKIE)?.value);
}

export async function getActiveDriverSession() {
  const session = await getDriverSession();
  if (!session) return null;
  const { data: driver } = await createAdminClient().from("drivers")
    .select("id").eq("id", session.driverId).eq("status", "active").is("deactivated_at", null).maybeSingle();
  return driver ? session : null;
}
