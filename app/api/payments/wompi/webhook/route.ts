import { NextResponse } from "next/server";
import { syncWompiTransactionPayment } from "@/lib/services/payments";
import { verifyWompiWebhook } from "@/lib/wompi";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const isValid = verifyWompiWebhook(
    rawBody,
    request.headers.get("x-event-checksum")
  );

  if (!isValid) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event?: string;
    data?: {
      transaction?: {
        id?: string;
        reference?: string;
        status?: string;
        amount_in_cents?: number;
        currency?: string;
      };
    };
  };

  const transaction = event.data?.transaction;
  if (!transaction?.reference) {
    return NextResponse.json({ ok: true });
  }

  await syncWompiTransactionPayment(transaction);

  return NextResponse.json({ ok: true });
}
