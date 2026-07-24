import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveDriverSession } from "@/lib/auth/driver-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

const updateTripSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["started", "completed"]),
  observation: z.string().trim().max(1000).optional()
}).superRefine((value, context) => {
  if (value.status === "completed" && (!value.observation || value.observation.length < 2)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observation"],
      message: "La observación final es obligatoria"
    });
  }
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
  if (error) return NextResponse.json({ error: "No fue posible consultar los viajes" }, { status: 500 });
  return NextResponse.json({ trips: data });
}

export async function PATCH(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;

  const session = await getActiveDriverSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = updateTripSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { data, error } = await createAdminClient().rpc("driver_update_trip", {
    p_driver_id: session.driverId,
    p_reservation_id: parsed.data.id,
    p_status: parsed.data.status,
    p_observation: parsed.data.observation ?? null
  });

  if (error) {
    console.error("Driver trip update rejected", {
      driverId: session.driverId,
      reservationId: parsed.data.id,
      code: error.code
    });
    return NextResponse.json(
      { error: "No fue posible actualizar el viaje. Verifica su estado e intenta de nuevo." },
      { status: 409 }
    );
  }

  const trip = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ trip });
}

export const POST = readOnly;
export const PUT = readOnly;
export const DELETE = readOnly;

function readOnly() {
  return NextResponse.json(
    { error: "Método no permitido" },
    { status: 405, headers: { Allow: "GET, PATCH" } }
  );
}
