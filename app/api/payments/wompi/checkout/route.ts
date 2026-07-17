import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/domain/schemas";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildWompiCheckoutUrl } from "@/lib/wompi";
import { isQuoteOnlyVehicle } from "@/lib/domain/vehicle-rules";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, {
    key: "wompi-checkout",
    limit: 10,
    windowMs: 10 * 60_000
  });

  if (limited) return limited;

  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = checkoutSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de checkout invalidos" }, { status: 422 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Reservas no esta configurado" }, { status: 503 });
  }

  const reservation = await resolveCheckoutReservation(parsed.data.reservationId);

  if (!reservation) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (reservation.status === "confirmed" || reservation.status === "completed") {
    return NextResponse.json({ error: "La reserva ya fue pagada" }, { status: 409 });
  }

  if (isQuoteOnlyVehicle(reservation.vehicle_type)) {
    return NextResponse.json(
      { error: "Van y bus se cotizan por WhatsApp y no generan checkout" },
      { status: 409 }
    );
  }

  if (typeof reservation.expected_amount_cents !== "number") {
    return NextResponse.json(
      { error: "La reserva no tiene un monto de pago valido" },
      { status: 409 }
    );
  }

  const checkoutUrl = await buildWompiCheckoutUrl({
    reservationId: parsed.data.reservationId,
    amountInCents: reservation.expected_amount_cents,
    customer: reservation.customer
  });

  if (!checkoutUrl) {
    return NextResponse.json({ error: "Wompi no esta configurado" }, { status: 503 });
  }

  return NextResponse.json({ checkoutUrl });
}

async function resolveCheckoutReservation(reservationId: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("reservations")
      .select("id, status, vehicle_type, expected_amount_cents, customers(email, full_name, phone)")
      .eq("id", reservationId)
      .maybeSingle();

    if (error) {
      console.error("Wompi checkout reservation lookup failed", {
        reservationId,
        message: error.message
      });
      return null;
    }

    if (!data) return null;

    const customer = normalizeCustomer(data.customers);

    return {
      id: data.id as string,
      status: data.status as string,
      vehicle_type: data.vehicle_type as "sedan" | "suv" | "six-passenger" | "van" | "bus",
      expected_amount_cents: data.expected_amount_cents as number | null,
      customer
    };
  } catch (error) {
    console.error("Wompi checkout reservation lookup failed", {
      reservationId,
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return null;
  }
}

function normalizeCustomer(customer: unknown) {
  const normalized = Array.isArray(customer) ? customer[0] : customer;

  if (!normalized || typeof normalized !== "object") return undefined;
  const record = normalized as {
    email?: string | null;
    full_name?: string | null;
    phone?: string | null;
  };

  return {
    email: record.email ?? undefined,
    fullName: record.full_name ?? undefined,
    phone: record.phone ?? undefined
  };
}
