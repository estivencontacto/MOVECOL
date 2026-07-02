import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/domain/schemas";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildWompiCheckoutUrl } from "@/lib/wompi";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, {
    key: "wompi-checkout",
    limit: 12,
    windowMs: 60_000
  });

  if (limited) return limited;

  const payload = await request.json();
  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de checkout invalidos" }, { status: 422 });
  }

  const amountInCents = await resolveExpectedAmountCents(
    parsed.data.reservationId,
    parsed.data.amountInCents
  );

  const checkoutUrl = await buildWompiCheckoutUrl({
    reservationId: parsed.data.reservationId,
    amountInCents
  });

  if (!checkoutUrl) {
    return NextResponse.json({ error: "Wompi no esta configurado" }, { status: 503 });
  }

  return NextResponse.json({ checkoutUrl });
}

async function resolveExpectedAmountCents(reservationId: string, fallbackAmountCents: number) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("reservations")
      .select("expected_amount_cents")
      .eq("id", reservationId)
      .maybeSingle();

    if (error) {
      console.error("Wompi checkout amount lookup failed", {
        reservationId,
        message: error.message
      });
    }

    if (typeof data?.expected_amount_cents === "number") {
      return data.expected_amount_cents;
    }
  } catch (error) {
    console.error("Wompi checkout amount lookup failed", {
      reservationId,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }

  return fallbackAmountCents;
}
