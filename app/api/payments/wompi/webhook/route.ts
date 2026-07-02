import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWompiWebhook } from "@/lib/wompi";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const isValid = verifyWompiWebhook(
    rawBody,
    request.headers.get("x-signature") ?? request.headers.get("wompi-signature")
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

  const paymentStatus = mapWompiStatus(transaction.status);
  const reservationStatus = paymentStatus === "paid" ? "confirmed" : "pending_payment";
  const supabase = createAdminClient();

  await supabase.from("payments").upsert(
    {
      reservation_id: transaction.reference,
      provider: "wompi",
      provider_transaction_id: transaction.id,
      amount_cents: transaction.amount_in_cents,
      currency: transaction.currency ?? "COP",
      status: paymentStatus,
      raw_payload: event
    },
    { onConflict: "provider_transaction_id" }
  );

  await supabase
    .from("reservations")
    .update({ status: reservationStatus })
    .eq("id", transaction.reference);

  return NextResponse.json({ ok: true });
}

function mapWompiStatus(status?: string) {
  switch (status) {
    case "APPROVED":
      return "paid";
    case "VOIDED":
    case "DECLINED":
      return "cancelled";
    default:
      return "pending";
  }
}
