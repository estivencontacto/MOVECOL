import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/authorization";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

const driverSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().trim().min(3).max(120),
  documentId: z.string().regex(/^\d{5,20}$/),
  phone: z.string().trim().max(24).optional().default(""),
  status: z.enum(["active", "inactive"]).optional()
});

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const { data, error } = await auth.supabase.from("drivers").select("id,full_name,document_id,phone,status,created_at").order("full_name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drivers: data });
}

export async function POST(request: Request) {
  const auth = await validateAdminMutation(request);
  if (!auth.ok) return auth.response;
  const parsed = driverSchema.safeParse(auth.body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 422 });
  const value = parsed.data;
  const { data: driver, error } = await auth.supabase.from("drivers").insert({
    full_name: value.fullName, document_id: value.documentId, phone: value.phone, status: "active"
  }).select("id,full_name,document_id,phone,status").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  return NextResponse.json({ driver }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await validateAdminMutation(request);
  if (!auth.ok) return auth.response;
  const parsed = driverSchema.safeParse(auth.body);
  if (!parsed.success || !parsed.data.id) return NextResponse.json({ error: "Datos inválidos" }, { status: 422 });
  const value = parsed.data;
  const { data, error } = await auth.supabase.from("drivers").update({
    full_name: value.fullName,
    document_id: value.documentId,
    phone: value.phone,
    ...(value.status ? {
      status: value.status,
      deactivated_at: value.status === "inactive" ? new Date().toISOString() : null
    } : {}),
    updated_at: new Date().toISOString()
  }).eq("id", value.id).select("id,full_name,document_id,phone,status").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  return NextResponse.json({ driver: data });
}

export async function DELETE(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Id inválido" }, { status: 422 });
  const { data, error } = await auth.supabase.from("drivers").update({
    status: "inactive", deactivated_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }).eq("id", id).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  return NextResponse.json({ driver: data });
}

async function validateAdminMutation(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return { ok: false as const, response: invalidOrigin };
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth;
  const body = await readJsonBody(request);
  if (!body.ok) return { ok: false as const, response: body.response };
  return { ...auth, body: body.data };
}
