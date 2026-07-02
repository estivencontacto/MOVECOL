import { createHash, createHmac, timingSafeEqual } from "crypto";

const checkoutBaseUrl =
  process.env.WOMPI_ENV === "production"
    ? "https://checkout.wompi.co/p/"
    : "https://checkout.wompi.co/p/";

export async function buildWompiCheckoutUrl({
  reservationId,
  amountInCents
}: {
  reservationId: string;
  amountInCents: number;
}) {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!publicKey) {
    return undefined;
  }

  const currency = "COP";
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co"}/reservar?reservation=${reservationId}`;
  const signature = integritySecret
    ? createHash("sha256")
        .update(`${reservationId}${amountInCents}${currency}${integritySecret}`)
        .digest("hex")
    : undefined;

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference: reservationId,
    "redirect-url": redirectUrl
  });

  if (signature) {
    params.set("signature:integrity", signature);
  }

  return `${checkoutBaseUrl}?${params.toString()}`;
}

export function verifyWompiWebhook(rawBody: string, signatureHeader?: string | null) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = signatureHeader.replace(/^sha256=/, "");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
  } catch {
    return false;
  }
}
