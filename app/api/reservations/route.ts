import { NextResponse } from "next/server";
import { reservationSchema, type ReservationInput } from "@/lib/domain/schemas";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { sendReservationEmail } from "@/lib/services/email";
import { estimateReservationAmount, toCents } from "@/lib/services/pricing";
import { createReservation } from "@/lib/services/reservations";
import { buildDepartureAt, getRouteEstimateResult } from "@/lib/services/routes";
import { queueWhatsappConfirmation } from "@/lib/services/whatsapp";
import { buildWompiCheckoutUrl } from "@/lib/wompi";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = reservationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const reservationInput = await enrichRouteDistance(parsed.data);

    if (!isSupabaseAdminConfigured()) {
      const demoId = crypto.randomUUID();
      await Promise.all([
        sendReservationEmail(reservationInput, demoId),
        queueWhatsappConfirmation(reservationInput, demoId)
      ]);

      return NextResponse.json(
        {
          id: demoId,
          demo: true,
          message: "Reserva demo creada. Configura Supabase para guardarla en base de datos."
        },
        { status: 201 }
      );
    }

    const reservation = await createReservation(reservationInput);
    const amount = estimateReservationAmount(reservationInput);
    const checkoutUrl = await buildWompiCheckoutUrl({
      reservationId: reservation.id,
      amountInCents: toCents(amount)
    });

    await Promise.all([
      sendReservationEmail(reservationInput, reservation.id),
      queueWhatsappConfirmation(reservationInput, reservation.id)
    ]);

    return NextResponse.json({ id: reservation.id, checkoutUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No fue posible crear la reserva" },
      { status: 500 }
    );
  }
}

async function enrichRouteDistance(input: ReservationInput) {
  const needsRouteEstimate =
    !input.tourId && (input.serviceId === "airport-transfer" || input.serviceId === "transfers");

  if (!needsRouteEstimate) return input;

  const result = await getRouteEstimateResult({
    origin: input.pickup,
    destination: input.dropoff,
    originPlaceId: input.originPlaceId,
    destinationPlaceId: input.destinationPlaceId,
    departureAt: buildDepartureAt(input.date, input.time)
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return {
    ...input,
    distanceKm: Number(result.route.distanceKm.toFixed(1)),
    notes: [
      input.notes,
      `Ruta Google Maps: ${result.route.distanceKm.toFixed(1)} km${result.route.durationText ? `, ${result.route.durationText}` : ""}.`
    ]
      .filter(Boolean)
      .join("\n")
  };
}
