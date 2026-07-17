import { NextResponse } from "next/server";
import { wompiEventSchema } from "@/lib/domain/schemas";
import { syncWompiTransactionPayment } from "@/lib/services/payments";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { readLimitedTextBody } from "@/lib/services/request-security";
import { verifyWompiWebhook } from "@/lib/wompi";

const MAX_WEBHOOK_BYTES = 128 * 1024;

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, {
    key: "wompi-webhook",
    limit: 300,
    windowMs: 60_000
  });
  if (limited) return limited;

  const rawBody = await readLimitedTextBody(request, MAX_WEBHOOK_BYTES);
  if (rawBody === null) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 413 });
  }

  if (!verifyWompiWebhook(rawBody, request.headers.get("x-event-checksum"))) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }

  const parsed = wompiEventSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }

  try {
    await syncWompiTransactionPayment(parsed.data.data.transaction);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Wompi webhook processing failed", {
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return NextResponse.json({ error: "No se pudo procesar el evento" }, { status: 500 });
  }
}
