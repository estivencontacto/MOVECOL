import { NextResponse } from "next/server";
import { cities, services, tours } from "@/lib/data/catalog";
import { sendPaymentConfirmedEmail } from "@/lib/services/email";
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
  const { data: reservation, error: reservationLookupError } = await supabase
    .from("reservations")
    .select(
      "id, expected_amount_cents, city_id, service_id, tour_id, reservation_date, reservation_time, passengers, pickup_address, dropoff_address, customers(email, full_name)"
    )
    .eq("id", transaction.reference)
    .maybeSingle();

  if (reservationLookupError) {
    console.error("Wompi reservation lookup failed", {
      reservationId: transaction.reference,
      message: reservationLookupError.message
    });
  }

  const expectedAmountCents = getExpectedAmountCents(reservation);
  if (
    typeof expectedAmountCents === "number" &&
    typeof transaction.amount_in_cents === "number" &&
    expectedAmountCents !== transaction.amount_in_cents
  ) {
    console.error("Wompi amount mismatch", {
      reservationId: transaction.reference,
      expectedAmountCents,
      paidAmountCents: transaction.amount_in_cents,
      transactionId: transaction.id
    });
  }

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

  if (paymentStatus === "paid" && reservation) {
    const customer = getReservationCustomer(reservation);
    const city = cities.find((item) => item.id === reservation.city_id);
    const service = services.find((item) => item.id === reservation.service_id);
    const tour = reservation.tour_id ? tours.find((item) => item.id === reservation.tour_id) : null;

    await sendPaymentConfirmedEmail({
      reservationId: transaction.reference,
      to: customer?.email,
      fullName: customer?.full_name,
      city: city?.name ?? reservation.city_id,
      service: service?.title ?? reservation.service_id,
      tour: tour?.name,
      date: reservation.reservation_date,
      time: reservation.reservation_time,
      passengers: reservation.passengers,
      pickup: reservation.pickup_address,
      dropoff: reservation.dropoff_address,
      amountCents: transaction.amount_in_cents
    });
  }

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

function getExpectedAmountCents(reservation: unknown) {
  if (!reservation || typeof reservation !== "object") return null;
  const value = (reservation as { expected_amount_cents?: unknown }).expected_amount_cents;
  return typeof value === "number" ? value : null;
}

function getReservationCustomer(reservation: unknown) {
  if (!reservation || typeof reservation !== "object") return null;
  const customer = (reservation as { customers?: unknown }).customers;
  const normalized = Array.isArray(customer) ? customer[0] : customer;

  if (!normalized || typeof normalized !== "object") return null;

  return normalized as { email?: string | null; full_name?: string | null };
}
