import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

loadLocalEnv();

const checks = [];

checks.push({
  name: "wompi_public_key",
  ok: Boolean(process.env.WOMPI_PUBLIC_KEY),
  message: process.env.WOMPI_PUBLIC_KEY ? "configured" : "missing WOMPI_PUBLIC_KEY"
});
checks.push({
  name: "wompi_private_key",
  ok: Boolean(process.env.WOMPI_PRIVATE_KEY),
  message: process.env.WOMPI_PRIVATE_KEY ? "configured" : "missing WOMPI_PRIVATE_KEY"
});
checks.push({
  name: "wompi_events_secret",
  ok: Boolean(process.env.WOMPI_EVENTS_SECRET),
  message: process.env.WOMPI_EVENTS_SECRET ? "configured" : "missing WOMPI_EVENTS_SECRET"
});
checks.push({
  name: "wompi_integrity_secret",
  ok: Boolean(process.env.WOMPI_INTEGRITY_SECRET),
  message: process.env.WOMPI_INTEGRITY_SECRET ? "configured" : "missing WOMPI_INTEGRITY_SECRET"
});
checks.push({
  name: "wompi_checkout",
  ok: isWompiCheckoutConfigured(),
  message: isWompiCheckoutConfigured() ? "checkout signing ready" : "checkout signing not ready"
});

const checkoutUrl = buildDiagnosticWompiCheckoutUrl({
  reservationId: "00000000-0000-4000-8000-000000000000",
  amountInCents: 1000000,
  customer: {
    email: "diagnostico@example.com",
    fullName: "Diagnostico MOVE",
    phone: "+573000000000"
  }
});

checks.push({
  name: "wompi_checkout_url",
  ok: Boolean(checkoutUrl?.startsWith("https://checkout.wompi.co/p/?")),
  message: checkoutUrl ? "checkout URL can be generated" : "checkout URL could not be generated"
});

const schemaCheck = await checkSupabaseSchema();
checks.push(schemaCheck);

for (const check of checks) {
  console.log(`${check.ok ? "OK" : "FAIL"} ${check.name}: ${check.message}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  process.exitCode = 1;
}

async function checkSupabaseSchema() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return {
      name: "supabase_expected_amount_cents",
      ok: false,
      message: "missing Supabase admin environment"
    };
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false
    }
  });

  const { error } = await supabase.from("reservations").select("expected_amount_cents").limit(1);

  if (error) {
    return {
      name: "supabase_expected_amount_cents",
      ok: false,
      message: `${error.code ?? "unknown"} ${error.message}`
    };
  }

  return {
    name: "supabase_expected_amount_cents",
    ok: true,
    message: "column exists"
  };
}

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

function isWompiCheckoutConfigured() {
  return Boolean(process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET);
}

function buildDiagnosticWompiCheckoutUrl({ reservationId, amountInCents, customer }) {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!publicKey || !integritySecret) return undefined;

  const currency = "COP";
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co"}/pago-exitoso?reservation=${reservationId}`;
  const signature = createHash("sha256")
    .update(`${reservationId}${amountInCents}${currency}${integritySecret}`)
    .digest("hex");
  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference: reservationId,
    "redirect-url": redirectUrl,
    "signature:integrity": signature
  });

  params.set("customer-data:email", customer.email);
  params.set("customer-data:full-name", customer.fullName);
  params.set("customer-data:phone-number-prefix", "+57");
  params.set("customer-data:phone-number", customer.phone.replace(/^\+?57/, ""));

  return `https://checkout.wompi.co/p/?${params.toString()}`;
}
