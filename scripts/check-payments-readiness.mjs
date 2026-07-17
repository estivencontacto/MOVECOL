import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

loadLocalEnv();

const checks = [
  requiredEnvCheck("wompi_public_key", "WOMPI_PUBLIC_KEY"),
  requiredEnvCheck("wompi_events_secret", "WOMPI_EVENTS_SECRET"),
  requiredEnvCheck("wompi_integrity_secret", "WOMPI_INTEGRITY_SECRET"),
  {
    name: "wompi_private_key",
    ok: true,
    required: false,
    message: process.env.WOMPI_PRIVATE_KEY
      ? "configured for optional server-to-server operations"
      : "optional for hosted Web Checkout"
  },
  checkWompiEnvironment()
];

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
  required: true,
  message: checkoutUrl ? "signed checkout URL can be generated" : "checkout URL could not be generated"
});

checks.push(...(await checkSupabaseSchema()));

const appUrl = getAppUrl();
const webhookUrl = appUrl ? new URL("/api/payments/wompi/webhook", appUrl).toString() : null;
checks.push({
  name: "wompi_dashboard_event_url",
  ok: true,
  required: false,
  message: webhookUrl
    ? `manually configure transaction.updated in Wompi: ${webhookUrl}`
    : "configure NEXT_PUBLIC_APP_URL before registering the Wompi event URL"
});

for (const check of checks) {
  const label = check.required === false ? "INFO" : check.ok ? "OK" : "FAIL";
  console.log(`${label} ${check.name}: ${check.message}`);
}

const failed = checks.filter((check) => check.required !== false && !check.ok);
if (failed.length > 0) {
  process.exitCode = 1;
}

function requiredEnvCheck(name, variable) {
  return {
    name,
    ok: Boolean(process.env[variable]),
    required: true,
    message: process.env[variable] ? "configured" : `missing ${variable}`
  };
}

function checkWompiEnvironment() {
  const environment = process.env.WOMPI_ENV ?? "sandbox";
  const prefixes =
    environment === "production"
      ? {
          WOMPI_PUBLIC_KEY: "pub_prod_",
          WOMPI_PRIVATE_KEY: "prv_prod_",
          WOMPI_EVENTS_SECRET: "prod_events_",
          WOMPI_INTEGRITY_SECRET: "prod_integrity_"
        }
      : {
          WOMPI_PUBLIC_KEY: "pub_test_",
          WOMPI_PRIVATE_KEY: "prv_test_",
          WOMPI_EVENTS_SECRET: "test_events_",
          WOMPI_INTEGRITY_SECRET: "test_integrity_"
        };

  if (environment !== "sandbox" && environment !== "production") {
    return {
      name: "wompi_environment",
      ok: false,
      required: true,
      message: "WOMPI_ENV must be sandbox or production"
    };
  }

  const mismatched = Object.entries(prefixes)
    .filter(([variable, prefix]) => {
      const value = process.env[variable];
      return value && !value.startsWith(prefix);
    })
    .map(([variable]) => variable);

  return {
    name: "wompi_environment",
    ok: mismatched.length === 0,
    required: true,
    message:
      mismatched.length === 0
        ? `all configured keys match ${environment}`
        : `${mismatched.join(", ")} do not match ${environment}`
  };
}

async function checkSupabaseSchema() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return [
      {
        name: "supabase_payment_schema",
        ok: false,
        required: true,
        message: "missing Supabase admin environment"
      }
    ];
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false }
  });

  const reservationResult = await supabase
    .from("reservations")
    .select("id, expected_amount_cents, terms_version, terms_accepted_at, privacy_accepted_at")
    .limit(1);
  const paymentResult = await supabase
    .from("payments")
    .select("reservation_id, provider_reference, provider_transaction_id, amount_cents, currency, status")
    .limit(1);

  return [
    {
      name: "supabase_reservation_payment_columns",
      ok: !reservationResult.error,
      required: true,
      message: reservationResult.error
        ? `${reservationResult.error.code ?? "unknown"} ${reservationResult.error.message}`
        : "payment and legal acceptance columns exist"
    },
    {
      name: "supabase_payments_table",
      ok: !paymentResult.error,
      required: true,
      message: paymentResult.error
        ? `${paymentResult.error.code ?? "unknown"} ${paymentResult.error.message}`
        : "payments table is queryable"
    }
  ];
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

function getAppUrl() {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co");
  } catch {
    return null;
  }
}

function buildDiagnosticWompiCheckoutUrl({ reservationId, amountInCents, customer }) {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  const appUrl = getAppUrl();

  if (!publicKey || !integritySecret || !appUrl) return undefined;

  const currency = "COP";
  const paymentReference = `${reservationId}.0000000000000000`;
  const redirectUrl = new URL("/pago-exitoso", appUrl);
  redirectUrl.searchParams.set("reservation", reservationId);
  const signature = createHash("sha256")
    .update(`${paymentReference}${amountInCents}${currency}${integritySecret}`)
    .digest("hex");
  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference: paymentReference,
    "redirect-url": redirectUrl.toString(),
    "signature:integrity": signature
  });

  params.set("customer-data:email", customer.email);
  params.set("customer-data:full-name", customer.fullName);
  params.set("customer-data:phone-number-prefix", "+57");
  params.set("customer-data:phone-number", customer.phone.replace(/^\+?57/, ""));

  return `https://checkout.wompi.co/p/?${params.toString()}`;
}
