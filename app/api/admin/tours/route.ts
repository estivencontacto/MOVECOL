import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/authorization";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

const tourSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]{3,80}$/),
  cityId: z.enum(["bogota", "medellin"]),
  name: z.string().trim().min(3).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]{3,100}$/),
  description: z.string().trim().min(10).max(1000),
  duration: z.string().trim().min(2).max(80),
  priceCop: z.coerce.number().int().min(1).max(100_000_000),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  isTest: z.boolean().default(false)
});

async function mutation(request: Request) {
  const invalidOrigin = enforceTrustedOrigin(request);
  if (invalidOrigin) return { ok: false as const, response: invalidOrigin };
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth;
  const body = await readJsonBody(request);
  if (!body.ok) return { ok: false as const, response: body.response };
  const parsed = tourSchema.safeParse(body.data);
  if (!parsed.success) {
    return { ok: false as const, response: NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 422 }) };
  }
  return { ...auth, value: parsed.data };
}

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return auth.response;
  const { data, error } = await auth.supabase
    .from("tours")
    .select("id,city_id,name,slug,description,duration,base_price_cents,active,featured,is_test,updated_at")
    .order("city_id")
    .order("name");
  if (error) return NextResponse.json({ error: "No fue posible consultar los tours" }, { status: 500 });
  return NextResponse.json({ tours: data });
}

export async function POST(request: Request) {
  const result = await mutation(request);
  if (!result.ok) return result.response;
  const value = result.value;
  const { data, error } = await result.supabase.from("tours").insert({
    id: value.id,
    city_id: value.cityId,
    name: value.name,
    slug: value.slug,
    description: value.description,
    duration: value.duration,
    base_price_cents: value.priceCop * 100,
    active: value.active,
    featured: value.featured,
    is_test: value.isTest,
    includes: [],
    excludes: [],
    schedules: [],
    gallery: []
  }).select("*").single();
  if (error) return NextResponse.json({ error: "No se pudo crear el tour" }, { status: 409 });
  return NextResponse.json({ tour: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const result = await mutation(request);
  if (!result.ok) return result.response;
  const value = result.value;
  const { data, error } = await result.supabase.from("tours").update({
    city_id: value.cityId,
    name: value.name,
    slug: value.slug,
    description: value.description,
    duration: value.duration,
    base_price_cents: value.priceCop * 100,
    active: value.active,
    featured: value.featured,
    is_test: value.isTest,
    updated_at: new Date().toISOString()
  }).eq("id", value.id).select("*").single();
  if (error) return NextResponse.json({ error: "No se pudo actualizar el tour" }, { status: 409 });
  return NextResponse.json({ tour: data });
}
