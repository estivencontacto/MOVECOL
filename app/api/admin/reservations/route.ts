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
  notes: z.string().trim().max(800).nullable().optional()
}).refine((value) => Object.keys(value).length > 1, "No hay cambios");

export async function GET(request: Request) {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const driverId = url.searchParams.get("driverId");
  let query = auth.supabase
    .from("reservations")
    .select("id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,driver_id,notes,customers(full_name,email,phone),drivers(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (driverId) query = query.eq("driver_id", driverId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reservations: data });
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
  return NextResponse.json({ reservation: data });
}
