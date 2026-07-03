import { randomUUID } from "crypto";
import { cities, services, tours, vehicles } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import { estimateReservationPricing, toCents } from "@/lib/services/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingExpectedAmountColumnError } from "@/lib/supabase/schema-errors";

export async function createReservation(input: ReservationInput) {
  const supabase = createAdminClient();
  const reservationId = randomUUID();
  const city = cities.find((item) => item.id === input.cityId);
  const service = services.find((item) => item.id === input.serviceId);
  const tour = input.tourId ? tours.find((item) => item.id === input.tourId) : null;
  const vehicle = vehicles.find((item) => item.type === input.vehicleType);
  const pricing = estimateReservationPricing(input);
  const expectedAmountCents = toCents(pricing.amount);

  if (!city || !service || !vehicle) {
    throw new Error("La ciudad, servicio o vehiculo seleccionado no existe");
  }

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        email: input.customer.email,
        full_name: input.customer.fullName,
        phone: input.customer.phone
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (customerError) {
    throw customerError;
  }

  const reservationPayload = {
    id: reservationId,
    customer_id: customer.id,
    city_id: city.id,
    service_id: service.id,
    tour_id: tour?.id ?? null,
    vehicle_type: vehicle.type,
    status: "pending_payment",
    reservation_date: input.date,
    reservation_time: input.time,
    passengers: input.passengers,
    luggage: input.luggage,
    pickup_address: input.pickup,
    dropoff_address: input.dropoff,
    notes: input.notes ?? null,
    expected_amount_cents: expectedAmountCents
  };

  const { error: reservationError } = await supabase.from("reservations").insert(reservationPayload);

  if (reservationError) {
    if (!isMissingExpectedAmountColumnError(reservationError)) {
      throw reservationError;
    }

    console.error("Supabase migration missing: reservations.expected_amount_cents. Retrying reservation insert without the column.");

    const { expected_amount_cents: _expectedAmountCents, ...legacyReservationPayload } = reservationPayload;
    const { error: legacyReservationError } = await supabase.from("reservations").insert(legacyReservationPayload);

    if (legacyReservationError) {
      throw legacyReservationError;
    }
  }

  return {
    id: reservationId,
    city,
    service,
    tour,
    vehicle,
    expectedAmountCents,
    pricing
  };
}
