import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/domain/schemas";
import { buildWompiCheckoutUrl } from "@/lib/wompi";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de checkout invalidos" }, { status: 422 });
  }

  const checkoutUrl = await buildWompiCheckoutUrl({
    reservationId: parsed.data.reservationId,
    amountInCents: parsed.data.amountInCents
  });

  if (!checkoutUrl) {
    return NextResponse.json({ error: "Wompi no esta configurado" }, { status: 503 });
  }

  return NextResponse.json({ checkoutUrl });
}
