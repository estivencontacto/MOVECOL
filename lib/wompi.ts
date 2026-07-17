import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { wompiTransactionSchema } from "@/lib/domain/schemas";

const checkoutBaseUrl = "https://checkout.wompi.co/p/";
const wompiApiBaseUrls = {
  production: "https://production.wompi.co/v1",
  sandbox: "https://sandbox.wompi.co/v1"
} as const;

export type WompiTransaction = {
  id?: string;
  reference?: string;
  status?: string;
  amount_in_cents?: number;
  currency?: string;
};

export function isWompiCheckoutConfigured() {
  return Boolean(process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET);
}

export async function buildWompiCheckoutUrl({
  reservationId,
  amountInCents,
  customer
}: {
  reservationId: string;
  amountInCents: number;
  customer?: {
    email?: string;
    fullName?: string;
    phone?: string;
  };
}) {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!publicKey || !integritySecret) {
    return undefined;
  }

  const currency = "COP";
  if (!Number.isSafeInteger(amountInCents) || amountInCents <= 0) {
    throw new Error("Wompi checkout amount must be a positive integer.");
  }

  const appUrl = getAppUrl();
  const redirectUrl = new URL("/pago-exitoso", appUrl);
  redirectUrl.searchParams.set("reservation", reservationId);
  const paymentReference = createPaymentReference(reservationId);
  const signature = createHash("sha256")
    .update(`${paymentReference}${amountInCents}${currency}${integritySecret}`)
    .digest("hex");

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference: paymentReference,
    "redirect-url": redirectUrl.toString()
  });

  params.set("signature:integrity", signature);

  if (customer?.email) {
    params.set("customer-data:email", customer.email);
  }

  if (customer?.fullName) {
    params.set("customer-data:full-name", customer.fullName);
  }

  const phone = normalizePhone(customer?.phone);
  if (phone) {
    params.set("customer-data:phone-number-prefix", phone.prefix);
    params.set("customer-data:phone-number", phone.number);
  }

  return `${checkoutBaseUrl}?${params.toString()}`;
}

export async function getWompiTransaction(transactionId: string) {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Wompi transaction lookup skipped: WOMPI_PUBLIC_KEY is not configured.");
    return null;
  }

  if (!/^[a-z0-9_-]{1,160}$/i.test(transactionId)) {
    console.error("Wompi transaction lookup rejected: invalid transaction id.");
    return null;
  }

  const response = await fetch(`${getWompiApiBaseUrl()}/transactions/${encodeURIComponent(transactionId)}`, {
    headers: {
      Authorization: `Bearer ${publicKey}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    console.error("Wompi transaction lookup failed", {
      transactionId,
      status: response.status
    });
    return null;
  }

  const payload = (await response.json()) as { data?: unknown };
  const parsed = wompiTransactionSchema.safeParse(payload.data);
  if (!parsed.success) {
    console.error("Wompi transaction lookup returned an invalid payload", { transactionId });
    return null;
  }

  return parsed.data;
}

export function verifyWompiWebhook(rawBody: string, checksumHeader?: string | null) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.error("Wompi webhook rejected: WOMPI_EVENTS_SECRET is not configured.");
    return false;
  }

  return verifyWompiEventChecksum(rawBody, secret, checksumHeader);
}

export function getReservationIdFromWompiReference(reference: string) {
  const reservationId = reference.split(".", 1)[0];
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    reservationId
  )
    ? reservationId
    : null;
}

function getWompiApiBaseUrl() {
  const publicKey = process.env.WOMPI_PUBLIC_KEY ?? "";

  if (
    process.env.WOMPI_ENV === "production" ||
    publicKey.startsWith("pub_prod_")
  ) {
    return wompiApiBaseUrls.production;
  }

  return wompiApiBaseUrls.sandbox;
}

function verifyWompiEventChecksum(rawBody: string, secret: string, checksumHeader?: string | null) {
  try {
    const payload = JSON.parse(rawBody) as {
      data?: unknown;
      signature?: {
        checksum?: unknown;
        properties?: unknown;
      };
      timestamp?: unknown;
    };
    const properties = payload.signature?.properties;
    const checksum =
      checksumHeader?.replace(/^sha256=/i, "") ??
      (typeof payload.signature?.checksum === "string" ? payload.signature.checksum : null);

    if (!Array.isArray(properties) || !checksum) {
      return false;
    }

    const signedValues = properties
      .map((property) =>
        typeof property === "string" ? String(getPathValue(payload.data, property) ?? "") : ""
      )
      .join("");
    const expected = createHash("sha256")
      .update(`${signedValues}${String(payload.timestamp ?? "")}${secret}`)
      .digest("hex");

    return safeCompareHex(expected, checksum);
  } catch {
    return false;
  }
}

function getPathValue(source: unknown, propertyPath: string): unknown {
  return propertyPath.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;

    return (current as Record<string, unknown>)[key];
  }, source);
}

function normalizePhone(value?: string) {
  if (!value) return null;

  const normalized = value.replace(/[^\d+]/g, "");

  if (normalized.startsWith("+57")) {
    return { prefix: "+57", number: normalized.slice(3) };
  }

  if (normalized.startsWith("57") && normalized.length > 10) {
    return { prefix: "+57", number: normalized.slice(2) };
  }

  return { prefix: "+57", number: normalized.replace(/^\+/, "") };
}

function safeCompareHex(expected: string, actual: string) {
  if (!/^[a-f0-9]{64}$/i.test(expected) || !/^[a-f0-9]{64}$/i.test(actual)) {
    return false;
  }

  try {
    return timingSafeEqual(
      Buffer.from(expected.toLowerCase(), "hex"),
      Buffer.from(actual.toLowerCase(), "hex")
    );
  } catch {
    return false;
  }
}

function createPaymentReference(reservationId: string) {
  return `${reservationId}.${randomBytes(8).toString("hex")}`;
}

function getAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co";
  const url = new URL(configured);

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS in production.");
  }

  return url;
}
