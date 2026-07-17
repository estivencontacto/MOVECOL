import { NextResponse } from "next/server";
import { z } from "zod";
import { vehicleTypes } from "@/lib/domain/vehicle-rules";
import { estimateReservationPricing } from "@/lib/services/pricing";
import { enforceRateLimit } from "@/lib/services/rate-limit";
import { enforceTrustedOrigin, readJsonBody } from "@/lib/services/request-security";
import { getRouteEstimateResult, type RouteEstimateErrorCode } from "@/lib/services/routes";

const routePricingSchema = z.object({
  cityId: z.string().trim().min(1).max(80).regex(/^[a-z0-9][a-z0-9_-]*$/i),
  serviceId: z.string().trim().min(1).max(80).regex(/^[a-z0-9][a-z0-9_-]*$/i),
  origin: z.string().trim().max(300).refine(withoutMarkup).optional(),
  destination: z.string().trim().max(300).refine(withoutMarkup).optional(),
  originPlaceId: z.string().trim().max(255).regex(/^[a-z0-9_-]*$/i).optional(),
  destinationPlaceId: z.string().trim().max(255).regex(/^[a-z0-9_-]*$/i).optional(),
  tourId: z.string().trim().max(80).regex(/^[a-z0-9_-]*$/i).optional(),
  hours: z.coerce.number().min(1).max(24).optional(),
  promoCode: z.string().trim().max(40).regex(/^[a-z0-9_-]*$/i).optional(),
  vehicleType: z.enum(vehicleTypes),
  passengers: z.coerce.number().int().min(2).max(50).optional(),
  departureAt: z.string().datetime({ offset: true }).max(40).optional()
}).superRefine((value, context) => {
  if (!value.originPlaceId && (!value.origin || value.origin.length < 3)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["origin"],
      message: "Indica un origen valido"
    });
  }

  if (!value.destinationPlaceId && (!value.destination || value.destination.length < 3)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["destination"],
      message: "Indica un destino valido"
    });
  }
});

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, {
      key: "route-pricing",
      limit: 30,
      windowMs: 60_000
    });
    if (limited) return limited;

    const invalidOrigin = enforceTrustedOrigin(request);
    if (invalidOrigin) return invalidOrigin;

    const body = await readJsonBody(request);
    if (!body.ok) return body.response;

    const parsed = routePricingSchema.safeParse(body.data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos para calcular la ruta", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const result = await getRouteEstimateResult({
      origin: parsed.data.origin ?? "",
      destination: parsed.data.destination ?? "",
      originPlaceId: parsed.data.originPlaceId,
      destinationPlaceId: parsed.data.destinationPlaceId,
      departureAt: parsed.data.departureAt
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error.message,
          code: result.error.code,
          googleStatus: result.error.googleStatus
        },
        { status: getRouteErrorStatus(result.error.code) }
      );
    }

    const distanceKm = Number(result.route.distanceKm.toFixed(1));
    const pricing = estimateReservationPricing({
      cityId: parsed.data.cityId,
      serviceId: parsed.data.serviceId,
      tourId: parsed.data.tourId,
      vehicleType: parsed.data.vehicleType,
      passengers: parsed.data.passengers ?? 2,
      hours: parsed.data.hours,
      distanceKm,
      promoCode: parsed.data.promoCode
    });

    return NextResponse.json({
      distanceKm,
      durationText: result.route.durationText,
      originAddress: result.route.originAddress,
      destinationAddress: result.route.destinationAddress,
      ...pricing
    });
  } catch (error) {
    console.error("Route pricing failed", error);
    return NextResponse.json(
      { error: "No pudimos calcular la ruta, intenta de nuevo" },
      { status: 500 }
    );
  }
}

function withoutMarkup(value: string) {
  return !/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function getRouteErrorStatus(code: RouteEstimateErrorCode) {
  if (code === "missing-api-key") return 503;
  if (code === "request-failed" || code === "google-error") return 502;
  return 422;
}
