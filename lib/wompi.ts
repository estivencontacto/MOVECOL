import { createHash, createHmac, timingSafeEqual } from "crypto";

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
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co"}/pago-exitoso?reservation=${reservationId}`;
  const signature = createHash("sha256")
    .update(`${reservationId}${amountInCents}${currency}${integritySecret}`)
    .digest("hex");

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference: reservationId,
    "redirect-url": redirectUrl
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
  const privateKey = process.env.WOMPI_PRIVATE_KEY;

  if (!privateKey) {
    console.error("Wompi transaction lookup skipped: WOMPI_PRIVATE_KEY is not configured.");
    return null;
  }

  const response = await fetch(`${getWompiApiBaseUrl()}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${privateKey}`
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

  const payload = (await response.json()) as { data?: WompiTransaction };
  return payload.data ?? null;
}

export function verifyWompiWebhook(rawBody: string, checksumHeader?: string | null) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.error("Wompi webhook rejected: WOMPI_EVENTS_SECRET is not configured.");
    return false;
  }

  const wompiVerification = verifyWompiEventChecksum(rawBody, secret, checksumHeader);

  if (wompiVerification !== null) {
    return wompiVerification;
  }

  return verifyLegacyWebhookSignature(rawBody, secret, checksumHeader);
}

function getWompiApiBaseUrl() {
  const publicKey = process.env.WOMPI_PUBLIC_KEY ?? "";
  const privateKey = process.env.WOMPI_PRIVATE_KEY ?? "";

  if (
    process.env.WOMPI_ENV === "production" ||
    publicKey.startsWith("pub_prod_") ||
    privateKey.startsWith("prv_prod_")
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
      return null;
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

function verifyLegacyWebhookSignature(rawBody: string, secret: string, signatureHeader?: string | null) {
  if (!signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = signatureHeader.replace(/^sha256=/i, "");

  return safeCompareHex(expected, actual);
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
  try {
    return timingSafeEqual(Buffer.from(expected.toLowerCase(), "hex"), Buffer.from(actual.toLowerCase(), "hex"));
  } catch {
    return false;
  }
}
