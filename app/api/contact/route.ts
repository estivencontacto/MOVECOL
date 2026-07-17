import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/domain/schemas";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, {
      key: "contact",
      limit: 5,
      windowMs: 10 * 60_000
    });

    if (limited) return limited;

    const invalidOrigin = enforceTrustedOrigin(request);
    if (invalidOrigin) return invalidOrigin;

    const body = await readJsonBody(request);
    if (!body.ok) return body.response;

    const parsed = contactSchema.safeParse(body.data);

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
