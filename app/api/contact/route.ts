import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/domain/schemas";
import { enforceRateLimit } from "@/lib/services/rate-limit";

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, {
      key: "contact",
      limit: 8,
      windowMs: 60_000
    });

    if (limited) return limited;

    const payload = await request.json();
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 422 });
    }

    console.info("Contact request accepted");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact request failed", error);
    return NextResponse.json(
      { error: "No pudimos procesar tu mensaje, intenta de nuevo" },
      { status: 500 }
    );
  }
}
