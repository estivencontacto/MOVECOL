import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/domain/schemas";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 422 });
  }

  console.info("Contact request", parsed.data);
  return NextResponse.json({ ok: true });
}
