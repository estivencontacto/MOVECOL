import { NextResponse } from "next/server";
import { getActiveDriverSession } from "@/lib/auth/driver-session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const session = await getActiveDriverSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { data, error } = await createAdminClient()
    .from("reservations")
    .select("id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,notes")
    .eq("driver_id", session.driverId)
    .order("reservation_date")
    .order("reservation_time");
  if (error) return NextResponse.json({ error: "No fue posible consultar los viajes" }, { status: 500 });
  return NextResponse.json({ trips: data });
}

function readOnly() {
  return NextResponse.json(
    { error: "Acceso de solo lectura" },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export const POST = readOnly;
export const PATCH = readOnly;
export const PUT = readOnly;
export const DELETE = readOnly;
