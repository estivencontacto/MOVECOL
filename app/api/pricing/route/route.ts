import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateDistancePricing } from "@/lib/services/pricing";
import { getRouteEstimateResult, type RouteEstimateErrorCode } from "@/lib/services/routes";

const routePricingSchema = z.object({
  cityId: z.string().min(1),
  serviceId: z.string().min(1),
  origin: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  originPlaceId: z.string().trim().optional(),
  destinationPlaceId: z.string().trim().optional(),
  vehicleType: z.enum(["sedan", "suv", "van", "bus"]),
  passengers: z.coerce.number().int().min(2).max(50).optional(),
  departureAt: z.string().optional()
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
  const payload = await request.json();
  const parsed = routePricingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos para calcular la ruta", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  if (parsed.data.serviceId !== "airport-transfer" && parsed.data.serviceId !== "transfers") {
    return NextResponse.json(
      { error: "El servicio seleccionado no se liquida por ruta." },
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

  const pricing = estimateDistancePricing({
    cityId: parsed.data.cityId,
    serviceId: parsed.data.serviceId,
    vehicleType: parsed.data.vehicleType,
    distanceKm: result.route.distanceKm
  });

  return NextResponse.json({
    distanceKm: result.route.distanceKm,
    durationText: result.route.durationText,
    originAddress: result.route.originAddress,
    destinationAddress: result.route.destinationAddress,
    ...pricing
  });
}

function getRouteErrorStatus(code: RouteEstimateErrorCode) {
  if (code === "missing-api-key") return 503;
  if (code === "request-failed" || code === "google-error") return 502;
  return 422;
}
