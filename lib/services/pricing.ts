import "server-only";
import { tours } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import type { VehicleType } from "@/lib/domain/types";
import { isQuoteOnlyVehicle } from "@/lib/domain/vehicle-rules";

export const COP_PER_KM = 4500;
const COP_PER_HOUR = 45000;
const AIRPORT_BASE_COP = 30000;
const PAYMENT_GATEWAY_RATE = 0.05;
const UPSELL_PROMO_CODE = "upsell5";
const UPSELL_DISCOUNT_RATE = 0.05;
const MINIMUM_BY_CITY: Record<string, number> = {
  bogota: 40000,
  medellin: 150000
};
export const SUV_SURCHARGE_COP = 40000;
export const SIX_PASSENGER_SURCHARGE_COP = 50000;

export type PriceEstimate = {
  amount: number;
  subtotal: number;
  gatewayFee: number;
  requiresAvailabilityCheck: boolean;
  quoteOnly: boolean;
  breakdown: Array<{ label: string; amount: number }>;
};

export function estimateReservationPricing(
  input: Pick<
    ReservationInput,
    "cityId" | "serviceId" | "tourId" | "vehicleType" | "distanceKm" | "hours" | "passengers" | "promoCode"
  >
): PriceEstimate {
  const tour = input.tourId ? tours.find((item) => item.id === input.tourId) : null;
  const requiresAvailabilityCheck = isQuoteOnlyVehicle(input.vehicleType);

  if (requiresAvailabilityCheck) {
    return quoteOnlyEstimate();
  }

  if (tour) {
    if (tour.isTest) {
      return {
        amount: tour.basePrice,
        subtotal: tour.basePrice,
        gatewayFee: 0,
        requiresAvailabilityCheck: false,
        quoteOnly: false,
        breakdown: [{ label: "Producto de prueba", amount: tour.basePrice }]
      };
    }

    const passengers = Math.max(input.passengers ?? 2, tour.minimumPassengers ?? 2);
    const tourPrice = tour.pricingMode === "global" ? tour.basePrice : tour.basePrice * passengers;
    const surcharge = getVehicleSurcharge(input.vehicleType);
    return withGatewayFee({
      subtotal: tourPrice + surcharge,
      requiresAvailabilityCheck,
      promoCode: input.promoCode
    });
  }

  if (input.serviceId === "hourly") {
    const hours = input.hours ?? 1;
    const base = hours * COP_PER_HOUR;
    const surcharge = getVehicleSurcharge(input.vehicleType);
    return withGatewayFee({
      subtotal: base + surcharge,
      requiresAvailabilityCheck,
      promoCode: input.promoCode
    });
  }

  if (input.serviceId === "airport-transfer" || input.serviceId === "transfers") {
    return estimateDistancePricing({
      cityId: input.cityId,
      serviceId: input.serviceId,
      vehicleType: input.vehicleType,
      distanceKm: input.distanceKm ?? 0,
      promoCode: input.promoCode
    });
  }

  const surcharge = getVehicleSurcharge(input.vehicleType);
  return withGatewayFee({
    subtotal: 280000 + surcharge,
    requiresAvailabilityCheck,
    promoCode: input.promoCode
  });
}

export function estimateReservationAmount(
  input: Pick<
    ReservationInput,
    "cityId" | "serviceId" | "tourId" | "vehicleType" | "distanceKm" | "hours" | "passengers" | "promoCode"
  >
) {
  return estimateReservationPricing(input).amount;
}

export function estimateDistancePricing({
  cityId,
  serviceId,
  vehicleType,
  distanceKm,
  promoCode
}: {
  cityId: string;
  serviceId: string;
  vehicleType: VehicleType;
  distanceKm: number;
  promoCode?: string;
}): PriceEstimate {
  if (isQuoteOnlyVehicle(vehicleType)) {
    return quoteOnlyEstimate();
  }

  const surcharge = getVehicleSurcharge(vehicleType);

  if (serviceId === "transfers") {
    const distanceAmount = Math.round(Math.max(0, distanceKm) * COP_PER_KM);

    return withGatewayFee({
      subtotal: distanceAmount + surcharge,
      requiresAvailabilityCheck: false,
      promoCode,
      serviceBreakdown: [
        {
          label: `Distancia ${distanceKm.toFixed(1)} km × COP $4.500`,
          amount: distanceAmount
        },
        ...(surcharge > 0 ? [{ label: "Recargo por tipo de vehículo", amount: surcharge }] : [])
      ]
    });
  }

  const distanceAmount = Math.ceil(Math.max(0, distanceKm)) * COP_PER_KM;
  const airportBase = serviceId === "airport-transfer" && cityId === "bogota" ? AIRPORT_BASE_COP : 0;
  const minimum = MINIMUM_BY_CITY[cityId] ?? 40000;
  const routeSubtotal = distanceAmount + airportBase;
  const minimumAdjustment = Math.max(0, minimum - routeSubtotal);
  const subtotal = routeSubtotal + minimumAdjustment + surcharge;

  return withGatewayFee({
    subtotal,
    requiresAvailabilityCheck: false,
    promoCode
  });
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function getVehicleSurcharge(vehicleType: VehicleType) {
  if (vehicleType === "suv") return SUV_SURCHARGE_COP;
  if (vehicleType === "six-passenger") return SIX_PASSENGER_SURCHARGE_COP;
  return 0;
}

function withGatewayFee({
  subtotal,
  requiresAvailabilityCheck,
  promoCode,
  serviceBreakdown
}: {
  subtotal: number;
  requiresAvailabilityCheck: boolean;
  promoCode?: string;
  serviceBreakdown?: Array<{ label: string; amount: number }>;
}): PriceEstimate {
  const discount = getPromoDiscount(subtotal, promoCode);
  const discountedSubtotal = subtotal - discount;
  const gatewayFee = Math.ceil(discountedSubtotal * PAYMENT_GATEWAY_RATE);
  const breakdown = [
    ...(serviceBreakdown ?? [{ label: "Precio del servicio", amount: subtotal }]),
    ...(discount > 0 ? [{ label: "Descuento upsell (5%)", amount: -discount }] : []),
    { label: "Uso pasarela de pago (5%)", amount: gatewayFee }
  ];

  return {
    amount: discountedSubtotal + gatewayFee,
    subtotal: discountedSubtotal,
    gatewayFee,
    requiresAvailabilityCheck,
    quoteOnly: false,
    breakdown
  };
}

function quoteOnlyEstimate(): PriceEstimate {
  return {
    amount: 0,
    subtotal: 0,
    gatewayFee: 0,
    requiresAvailabilityCheck: true,
    quoteOnly: true,
    breakdown: []
  };
}

function getPromoDiscount(subtotal: number, promoCode?: string) {
  if (promoCode !== UPSELL_PROMO_CODE) return 0;

  return Math.floor(subtotal * UPSELL_DISCOUNT_RATE);
}
