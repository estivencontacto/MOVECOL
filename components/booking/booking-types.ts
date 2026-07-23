export type BookingStep = 1 | 2 | 3;
export type BookingLanguage = "ES" | "EN";
export type AirportDirection = "from-airport" | "to-airport";

export type PublicPriceEstimate = {
  total: number;
  requiresAvailabilityCheck: boolean;
  quoteOnly: boolean;
};

export type RoutePricingResponse = PublicPriceEstimate & {
  distanceKm: number;
  durationText?: string | null;
  originAddress?: string | null;
  destinationAddress?: string | null;
};
