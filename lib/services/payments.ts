import { cities, services, tours } from "@/lib/data/catalog";
import { sendPaymentConfirmedEmail } from "@/lib/services/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingExpectedAmountColumnError } from "@/lib/supabase/schema-errors";
import { getReservationIdFromWompiReference, type WompiTransaction } from "@/lib/wompi";

type ReservationPaymentRecord = {
  id: string;
  status: string;
  expected_amount_cents: number | null;
  city_id: string;
  service_id: string;
  tour_id: string | null;
  reservation_date: string;
  reservation_time: string;
  passengers: number;
  pickup_address: string;
  dropoff_address: string;
  customers?: unknown;
};

type PaymentRecord = {
  status: string | null;
};

export async function syncWompiTransactionPayment(transaction: WompiTransaction) {
  if (!transaction.reference) {
    return { reservationId: null, paymentStatus: "ignored", reservationStatus: null };
  }

  const reservationId = getReservationIdFromWompiReference(transaction.reference);
  if (!reservationId) {
    return { reservationId: null, paymentStatus: "ignored", reservationStatus: null };
  }

  if (!transaction.id) {
    console.error("Wompi transaction ignored: missing transaction id", {
      reservationId
    });
    return { reservationId, paymentStatus: "ignored", reservationStatus: null };
  }

  if (
    !Number.isSafeInteger(transaction.amount_in_cents) ||
    (transaction.amount_in_cents ?? 0) <= 0 ||
    transaction.currency !== "COP"
  ) {
    throw new Error("Wompi transaction has an invalid amount or currency.");
  }

  if (!["PENDING", "APPROVED", "DECLINED", "VOIDED", "ERROR"].includes(transaction.status ?? "")) {
    throw new Error("Wompi transaction has an unsupported status.");
  }

  const paymentStatus = mapWompiStatus(transaction.status);
  const reservationStatus = mapReservationStatus(paymentStatus);
  const supabase = createAdminClient();
  const normalizedReservation = await getPaymentReservation(reservationId);
  if (!normalizedReservation) {
    throw new Error("Wompi transaction references an unknown reservation.");
  }

  const expectedAmountCents = normalizedReservation.expected_amount_cents;
  if (typeof expectedAmountCents !== "number") {
    throw new Error("Wompi payment cannot be verified until expected_amount_cents is migrated.");
  }

  if (expectedAmountCents !== transaction.amount_in_cents) {
    throw new Error("Wompi transaction amount does not match the reservation.");
  }

  const existingPayment = await getExistingPayment(transaction.id);

  const { error: paymentError } = await supabase.from("payments").upsert(
    {
      reservation_id: reservationId,
      provider: "wompi",
      provider_reference: transaction.reference,
      provider_transaction_id: transaction.id,
      amount_cents: transaction.amount_in_cents,
      currency: transaction.currency ?? "COP",
      status: paymentStatus,
      raw_payload: { transaction }
    },
    { onConflict: "provider_transaction_id" }
  );

  if (paymentError) {
    throw new Error(`Wompi payment persistence failed: ${paymentError.message}`);
  }

  if (reservationStatus) {
    const { error: reservationError } = await supabase
      .from("reservations")
      .update({ status: reservationStatus })
      .eq("id", reservationId);

    if (reservationError) {
      throw new Error(`Wompi reservation update failed: ${reservationError.message}`);
    }
  }

  const shouldSendEmail =
    paymentStatus === "paid" &&
    normalizedReservation &&
    normalizedReservation.status !== "confirmed" &&
    existingPayment?.status !== "paid";

  if (shouldSendEmail && normalizedReservation) {
    const customer = getReservationCustomer(normalizedReservation);
    const city = cities.find((item) => item.id === normalizedReservation.city_id);
    const service = services.find((item) => item.id === normalizedReservation.service_id);
    const tour = normalizedReservation.tour_id
      ? tours.find((item) => item.id === normalizedReservation.tour_id)
      : null;

    await sendPaymentConfirmedEmail({
      reservationId,
      to: customer?.email,
      fullName: customer?.full_name,
      city: city?.name ?? normalizedReservation.city_id,
      service: service?.title ?? normalizedReservation.service_id,
      tour: tour?.name,
      date: normalizedReservation.reservation_date,
      time: normalizedReservation.reservation_time,
      passengers: normalizedReservation.passengers,
      pickup: normalizedReservation.pickup_address,
      dropoff: normalizedReservation.dropoff_address,
      amountCents: transaction.amount_in_cents
    });
  }

  return {
    reservationId,
    paymentStatus,
    reservationStatus
  };
}

async function getPaymentReservation(reservationId: string) {
  const supabase = createAdminClient();
  const selectWithExpectedAmount =
    "id, status, expected_amount_cents, city_id, service_id, tour_id, reservation_date, reservation_time, passengers, pickup_address, dropoff_address, customers(email, full_name)";
  const selectLegacy =
    "id, status, city_id, service_id, tour_id, reservation_date, reservation_time, passengers, pickup_address, dropoff_address, customers(email, full_name)";
  const { data, error } = await supabase
    .from("reservations")
    .select(selectWithExpectedAmount)
    .eq("id", reservationId)
    .maybeSingle();

  if (!error) {
    return data as ReservationPaymentRecord | null;
  }

  if (!isMissingExpectedAmountColumnError(error)) {
    console.error("Wompi reservation lookup failed", {
      reservationId,
      message: error.message
    });
    return null;
  }

  console.error("Supabase migration missing during Wompi sync: reservations.expected_amount_cents.");

  const { data: legacyData, error: legacyError } = await supabase
    .from("reservations")
    .select(selectLegacy)
    .eq("id", reservationId)
    .maybeSingle();

  if (legacyError) {
    console.error("Wompi legacy reservation lookup failed", {
      reservationId,
      message: legacyError.message
    });
    return null;
  }

  return legacyData ? ({ ...legacyData, expected_amount_cents: null } as ReservationPaymentRecord) : null;
}

export function mapWompiStatus(status?: string) {
  switch (status) {
    case "APPROVED":
      return "paid";
    case "VOIDED":
    case "DECLINED":
    case "ERROR":
      return "cancelled";
    default:
      return "pending";
  }
}

function mapReservationStatus(paymentStatus: string) {
  if (paymentStatus === "paid") return "confirmed";
  if (paymentStatus === "cancelled") return "cancelled";
  return "pending_payment";
}

async function getExistingPayment(transactionId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("payments")
    .select("status")
    .eq("provider", "wompi")
    .eq("provider_transaction_id", transactionId)
    .maybeSingle();

  if (error) {
    console.error("Wompi payment lookup failed", {
      transactionId,
      message: error.message
    });
    return null;
  }

  return data as PaymentRecord | null;
}

function getReservationCustomer(reservation: ReservationPaymentRecord) {
  const customer = reservation.customers;
  const normalized = Array.isArray(customer) ? customer[0] : customer;

  if (!normalized || typeof normalized !== "object") return null;

  return normalized as { email?: string | null; full_name?: string | null };
}
