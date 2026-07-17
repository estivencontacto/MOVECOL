import type { PriceEstimate } from "@/lib/services/pricing";

export type BookingStep = 1 | 2 | 3;
export type BookingLanguage = "ES" | "EN";
export type AirportDirection = "from-airport" | "to-airport";

export type RoutePricingResponse = PriceEstimate & {
  distanceKm: number;
  durationText?: string | null;
  originAddress?: string | null;
  destinationAddress?: string | null;
};
