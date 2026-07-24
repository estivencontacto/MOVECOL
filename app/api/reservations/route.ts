import { NextResponse } from "next/server";
import { reservationSchema, type ReservationInput } from "@/lib/domain/schemas";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { sendReservationEmail } from "@/lib/services/email";
import { createReservation } from "@/lib/services/reservations";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";
import { buildDepartureAt, getRouteEstimateResult } from "@/lib/services/routes";
import { queueWhatsappConfirmation } from "@/lib/services/whatsapp";
import { buildWompiCheckoutUrl, isWompiCheckoutConfigured } from "@/lib/wompi";
import { company } from "@/lib/legal/company";
import { isQuoteOnlyVehicle } from "@/lib/domain/vehicle-rules";
import { buildSpecialVehicleWhatsappUrl } from "@/lib/services/whatsapp-quote";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, {
    key: "reservations",
    limit: 5,
    windowMs: 10 * 60_000
  });

  if (limited) return limited;

  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = reservationSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  if (parsed.data.termsVersion !== company.termsVersion) {
    return NextResponse.json(
      { error: "Los términos fueron actualizados. Recarga la página y vuelve a aceptar." },
      { status: 409 }
    );
  }

  try {
    const { input: reservationInput, route } = await enrichRouteDistance(parsed.data);

    if (isQuoteOnlyVehicle(reservationInput.vehicleType)) {
      return NextResponse.json(
        { quoteUrl: buildSpecialVehicleWhatsappUrl(reservationInput, route) },
        { status: 200 }
      );
    }

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

    if (!isWompiCheckoutConfigured()) {
      return NextResponse.json(
        { error: "La pasarela de pagos no esta configurada. Intenta de nuevo mas tarde." },
        { status: 503 }
      );
    }

    const reservation = await createReservation(reservationInput);
    const checkoutUrl = await buildWompiCheckoutUrl({
      reservationId: reservation.id,
      amountInCents: reservation.expectedAmountCents,
      customer: {
        email: reservationInput.customer.email,
        fullName: reservationInput.customer.fullName,
        phone: reservationInput.customer.phone
      }
    });

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "La pasarela de pagos no esta configurada. Intenta de nuevo mas tarde." },
        { status: 503 }
      );
    }

    await Promise.all([
      sendReservationEmail(reservationInput, reservation.id, reservation.expectedAmountCents),
      queueWhatsappConfirmation(reservationInput, reservation.id)
    ]);

    return NextResponse.json({ id: reservation.id, checkoutUrl }, { status: 201 });
  } catch (error) {
    console.error("Reservation creation failed", error);
    return NextResponse.json(
      { error: "No pudimos procesar tu reserva, intenta de nuevo" },
      { status: 500 }
    );
  }
}

async function enrichRouteDistance(input: ReservationInput) {
  const result = await getRouteEstimateResult({
    origin: input.pickup,
    destination: input.dropoff,
    originPlaceId: input.originPlaceId,
    destinationPlaceId: input.destinationPlaceId,
    departureAt: buildDepartureAt(input.date, input.time)
  });

  if (!result.ok) {
    const routeDeterminesPrice =
      input.serviceId === "airport-transfer" || input.serviceId === "transfers";
    if (routeDeterminesPrice && !isQuoteOnlyVehicle(input.vehicleType)) {
      throw new Error(result.error.message);
    }

    return { input, route: null };
  }

  return {
    input: {
      ...input,
      distanceKm: Number(result.route.distanceKm.toFixed(1)),
      notes: [
        input.notes,
        `Ruta Google Maps: ${result.route.distanceKm.toFixed(1)} km${result.route.durationText ? `, ${result.route.durationText}` : ""}.`
      ]
        .filter(Boolean)
        .join("\n")
    },
    route: result.route
  };
}
