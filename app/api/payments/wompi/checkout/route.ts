import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/domain/schemas";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildWompiCheckoutUrl } from "@/lib/wompi";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, {
    key: "wompi-checkout",
    limit: 12,
    windowMs: 60_000
  });

  if (limited) return limited;

  const payload = await request.json();
  const parsed = checkoutSchema.safeParse(payload);

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
      .select("id, status, expected_amount_cents, customers(email, full_name, phone)")
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
