import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/authorization";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

const updateSchema = z.object({
  id: z.string().uuid(),
  driverId: z.string().uuid().nullable().optional(),
  status: z.enum(["pending", "confirmed", "accepted", "en_route", "started", "completed", "cancelled"]).optional(),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reservationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  pickupAddress: z.string().trim().min(4).max(300).optional(),
  dropoffAddress: z.string().trim().min(4).max(300).optional(),
  notes: z.string().trim().max(800).nullable().optional(),
  observation: z.string().trim().min(2).max(1000).optional(),
  observationAction: z.enum(["open", "close", "reopen", "note"]).optional()
}).refine((value) => Object.keys(value).length > 1, "No hay cambios");

const createSchema = z.object({
  customerName: z.string().trim().min(3).max(120),
  customerEmail: z.string().trim().email().max(200),
  customerPhone: z.string().trim().min(7).max(24),
  cityId: z.enum(["bogota", "medellin"]),
  serviceId: z.string().trim().min(2).max(80),
  tourId: z.string().trim().max(80).nullable().optional(),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  pickupAddress: z.string().trim().min(4).max(300),
  dropoffAddress: z.string().trim().min(4).max(300),
  passengers: z.coerce.number().int().min(1).max(50),
  observation: z.string().trim().min(2).max(1000)
});

export async function GET(request: Request) {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const driverId = url.searchParams.get("driverId");
  let query = auth.supabase
    .from("reservations")
    .select("id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,driver_id,notes,customers(full_name,email,phone),drivers(full_name),reservation_observations(id,action,observation,author_name,created_at)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (driverId) query = query.eq("driver_id", driverId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reservations: data });
}

export async function POST(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = createSchema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 422 });
  const value = parsed.data;
  let expectedAmountCents: number | null = null;
  if (value.tourId) {
    const { data: tour } = await auth.supabase.from("tours")
      .select("base_price_cents,active").eq("id", value.tourId).maybeSingle();
    if (!tour?.active) return NextResponse.json({ error: "El tour no existe o está inactivo" }, { status: 422 });
    expectedAmountCents = tour.base_price_cents;
  }
  const { data: customer, error: customerError } = await auth.supabase.from("customers").upsert({
    full_name: value.customerName,
    email: value.customerEmail.toLowerCase(),
    phone: value.customerPhone
  }, { onConflict: "email" }).select("id").single();
  if (customerError || !customer) return NextResponse.json({ error: "No se pudo guardar el cliente" }, { status: 409 });
  const { data: reservation, error } = await auth.supabase.from("reservations").insert({
    customer_id: customer.id,
    city_id: value.cityId,
    service_id: value.serviceId,
    tour_id: value.tourId || null,
    vehicle_type: "sedan",
    status: "pending",
    reservation_date: value.reservationDate,
    reservation_time: value.reservationTime,
    passengers: value.passengers,
    luggage: 0,
    pickup_address: value.pickupAddress,
    dropoff_address: value.dropoffAddress,
    expected_amount_cents: expectedAmountCents
  }).select("id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,driver_id").single();
  if (error || !reservation) return NextResponse.json({ error: "No se pudo crear la reserva" }, { status: 409 });
  await auth.supabase.from("reservation_observations").insert({
    reservation_id: reservation.id,
    action: "open",
    observation: value.observation,
    author_id: auth.user.id,
    author_name: auth.user.user_metadata?.full_name ?? auth.user.email ?? "Administrador"
  });
  return NextResponse.json({ reservation }, { status: 201 });
}

export async function PATCH(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = updateSchema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 422 });
  const value = parsed.data;
  if ((value.observation && !value.observationAction) || (!value.observation && value.observationAction)) {
    return NextResponse.json({ error: "La acción y la observación son obligatorias" }, { status: 422 });
  }
  const changes = {
    ...(value.driverId !== undefined ? { driver_id: value.driverId } : {}),
    ...(value.status ? { status: value.status } : {}),
    ...(value.reservationDate ? { reservation_date: value.reservationDate } : {}),
    ...(value.reservationTime ? { reservation_time: value.reservationTime } : {}),
    ...(value.pickupAddress ? { pickup_address: value.pickupAddress } : {}),
    ...(value.dropoffAddress ? { dropoff_address: value.dropoffAddress } : {}),
    ...(value.notes !== undefined ? { notes: value.notes } : {}),
    updated_at: new Date().toISOString()
  };
  const { data, error } = await auth.supabase.from("reservations").update(changes).eq("id", value.id).select("id,status,driver_id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  if (value.observation && value.observationAction) {
    const { error: observationError } = await auth.supabase.from("reservation_observations").insert({
      reservation_id: value.id,
      action: value.observationAction,
      observation: value.observation,
      author_id: auth.user.id,
      author_name: auth.user.user_metadata?.full_name ?? auth.user.email ?? "Administrador"
    });
    if (observationError) return NextResponse.json({ error: "La reserva cambió, pero no se guardó la observación" }, { status: 500 });
  }
  return NextResponse.json({ reservation: data });
}
