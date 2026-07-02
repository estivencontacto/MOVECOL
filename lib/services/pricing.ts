import { tours } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import type { VehicleType } from "@/lib/domain/types";

const COP_PER_KM = 4500;
const COP_PER_HOUR = 45000;
const AIRPORT_BASE_COP = 30000;
const PAYMENT_GATEWAY_RATE = 0.05;
const MINIMUM_BY_CITY: Record<string, number> = {
  bogota: 40000,
  medellin: 150000
};
const SUV_SURCHARGE_COP = 40000;

export type PriceEstimate = {
  amount: number;
  subtotal: number;
  gatewayFee: number;
  requiresAvailabilityCheck: boolean;
  breakdown: Array<{ label: string; amount: number }>;
};

export function estimateReservationPricing(
  input: Pick<ReservationInput, "cityId" | "serviceId" | "tourId" | "vehicleType" | "distanceKm" | "hours" | "passengers">
): PriceEstimate {
  const tour = input.tourId ? tours.find((item) => item.id === input.tourId) : null;
  const requiresAvailabilityCheck = input.vehicleType === "van" || input.vehicleType === "bus";

  if (tour) {
    const passengers = Math.max(input.passengers ?? 2, tour.minimumPassengers ?? 2);
    const tourPrice = tour.pricingMode === "global" ? tour.basePrice : tour.basePrice * passengers;
    const surcharge = getVehicleSurcharge(input.vehicleType);
    return withGatewayFee({
      subtotal: tourPrice + surcharge,
      requiresAvailabilityCheck
    });
  }

  if (input.serviceId === "hourly") {
    const hours = input.hours ?? 1;
    const base = hours * COP_PER_HOUR;
    const surcharge = getVehicleSurcharge(input.vehicleType);
    return withGatewayFee({
      subtotal: base + surcharge,
      requiresAvailabilityCheck
    });
  }

  if (input.serviceId === "airport-transfer" || input.serviceId === "transfers") {
    return estimateDistancePricing({
      cityId: input.cityId,
      serviceId: input.serviceId,
      vehicleType: input.vehicleType,
      distanceKm: input.distanceKm ?? 0
    });
  }

  const surcharge = getVehicleSurcharge(input.vehicleType);
  return withGatewayFee({
    subtotal: 280000 + surcharge,
    requiresAvailabilityCheck
  });
}

export function estimateReservationAmount(
  input: Pick<ReservationInput, "cityId" | "serviceId" | "tourId" | "vehicleType" | "distanceKm" | "hours" | "passengers">
) {
  return estimateReservationPricing(input).amount;
}

export function estimateDistancePricing({
  cityId,
  serviceId,
  vehicleType,
  distanceKm
}: {
  cityId: string;
  serviceId: string;
  vehicleType: VehicleType;
  distanceKm: number;
}): PriceEstimate {
  const distanceAmount = Math.ceil(distanceKm) * COP_PER_KM;
  const airportBase = serviceId === "airport-transfer" && cityId === "bogota" ? AIRPORT_BASE_COP : 0;
  const minimum = MINIMUM_BY_CITY[cityId] ?? 40000;
  const surcharge = getVehicleSurcharge(vehicleType);
  const routeSubtotal = distanceAmount + airportBase;
  const minimumAdjustment = Math.max(0, minimum - routeSubtotal);
  const subtotal = routeSubtotal + minimumAdjustment + surcharge;

  return withGatewayFee({
    subtotal,
    requiresAvailabilityCheck: vehicleType === "van" || vehicleType === "bus"
  });
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}

function getVehicleSurcharge(vehicleType: VehicleType) {
  return vehicleType === "suv" ? SUV_SURCHARGE_COP : 0;
}

function withGatewayFee({
  subtotal,
  requiresAvailabilityCheck
}: {
  subtotal: number;
  requiresAvailabilityCheck: boolean;
}): PriceEstimate {
  const gatewayFee = Math.ceil(subtotal * PAYMENT_GATEWAY_RATE);

  return {
    amount: subtotal + gatewayFee,
    subtotal,
    gatewayFee,
    requiresAvailabilityCheck,
    breakdown: [
      { label: "Precio del servicio", amount: subtotal },
      { label: "Uso pasarela de pago (5%)", amount: gatewayFee }
    ]
  };
}
