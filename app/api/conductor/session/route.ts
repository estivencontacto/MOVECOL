import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createDriverSessionToken, DRIVER_SESSION_COOKIE, DRIVER_SESSION_MAX_AGE_SECONDS } from "@/lib/auth/driver-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit, getRequestClientIp } from "@/lib/services/rate-limit";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

const loginSchema = z.object({
  documentId: z.string().trim().regex(/^\d{5,20}$/),
  captchaToken: z.string().trim().min(10).max(4096)
});
const GENERIC_ERROR = "No fue posible iniciar sesión. Verifica los datos e intenta más tarde.";
const MAX_FAILURES = 5;

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, { key: "driver-login", limit: 10, windowMs: 15 * 60_000 });
  if (limited) return NextResponse.json({ error: GENERIC_ERROR }, { status: 429 });
  if (enforceTrustedOrigin(request)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  const body = await readJsonBody(request);
  if (!body.ok) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  const parsed = loginSchema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });

  const ip = getRequestClientIp(request);
  const keyHash = createHash("sha256").update(`${parsed.data.documentId}:${ip}`).digest("hex");
  const admin = createAdminClient();
  const { data: attempt } = await admin.from("driver_login_attempts").select("failed_attempts,locked_until").eq("key_hash", keyHash).maybeSingle();
  if (attempt?.locked_until && new Date(attempt.locked_until).getTime() > Date.now()) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 429 });
  }

  const captchaOk = await verifyTurnstile(parsed.data.captchaToken, ip);
  const { data: driver } = captchaOk
    ? await admin.from("drivers").select("id").eq("document_id", parsed.data.documentId).eq("status", "active").is("deactivated_at", null).maybeSingle()
    : { data: null };

  if (!captchaOk || !driver) {
    const failures = (attempt?.failed_attempts ?? 0) + 1;
    await admin.from("driver_login_attempts").upsert({
      key_hash: keyHash,
      failed_attempts: failures >= MAX_FAILURES ? 0 : failures,
      locked_until: failures >= MAX_FAILURES ? new Date(Date.now() + 15 * 60_000).toISOString() : null,
      updated_at: new Date().toISOString()
    });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: failures >= MAX_FAILURES ? 429 : 401 });
  }

  await admin.from("driver_login_attempts").delete().eq("key_hash", keyHash);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DRIVER_SESSION_COOKIE, await createDriverSessionToken(driver.id), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/", maxAge: DRIVER_SESSION_MAX_AGE_SECONDS
  });
  return response;
}

export async function DELETE(request: Request) {
  if (enforceTrustedOrigin(request)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DRIVER_SESSION_COOKIE, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0
  });
  return response;
}

async function verifyTurnstile(token: string, remoteip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip }), cache: "no-store"
    });
    const result = await response.json() as { success?: boolean; hostname?: string };
    const expectedHost = new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co").hostname;
    return result.success === true && (!result.hostname || result.hostname === expectedHost);
  } catch {
    return false;
  }
}
