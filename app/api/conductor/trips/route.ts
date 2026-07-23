import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveDriverSession } from "@/lib/auth/driver-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAllowedDriverTransition } from "@/lib/domain/trip-status";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

const transitionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["accepted", "en_route", "started", "completed"])
});

export async function GET() {
  const session = await getActiveDriverSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data, error } = await createAdminClient()
    .from("reservations")
    .select("id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,notes")
    .eq("driver_id", session.driverId)
    .order("reservation_date")
    .order("reservation_time");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ trips: data });
}

export async function PATCH(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;
  const session = await getActiveDriverSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = transitionSchema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: "Transición inválida" }, { status: 422 });
  const admin = createAdminClient();
  const { data: current } = await admin.from("reservations").select("status").eq("id", parsed.data.id).eq("driver_id", session.driverId).maybeSingle();
  if (!current || !isAllowedDriverTransition(current.status, parsed.data.status)) {
    return NextResponse.json({ error: "Estado no permitido" }, { status: 409 });
  }
  const { data, error } = await admin.from("reservations")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .eq("driver_id", session.driverId)
    .select("id,status")
    .single();
  if (error) return NextResponse.json({ error: "Estado no permitido" }, { status: 409 });
  return NextResponse.json({ trip: data });
}
