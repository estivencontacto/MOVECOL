import type { VehicleType } from "@/lib/domain/types";

export type VehicleCompatibility = {
  compatible: boolean;
  luggageFits: boolean;
  passengerCapacity: number;
  passengersFit: boolean;
};

const vehicleRuleSet: Record<
  VehicleType,
  {
    defaultPassengerCapacity: number;
    luggageCapacity: number | null;
    quoteOnly: boolean;
  }
> = {
  sedan: {
    defaultPassengerCapacity: 4,
    luggageCapacity: 2,
    quoteOnly: false
  },
  suv: {
    defaultPassengerCapacity: 4,
    luggageCapacity: 4,
    quoteOnly: false
  },
  "six-passenger": {
    defaultPassengerCapacity: 6,
    luggageCapacity: null,
    quoteOnly: false
  },
  van: {
    defaultPassengerCapacity: 10,
    luggageCapacity: 8,
    quoteOnly: true
  },
  bus: {
    defaultPassengerCapacity: 35,
    luggageCapacity: 25,
    quoteOnly: true
  }
};

export const vehicleTypes = ["sedan", "suv", "six-passenger", "van", "bus"] as const;

export function getVehiclePassengerCapacity(vehicleType: VehicleType, serviceId: string) {
  if (vehicleType === "sedan" && serviceId === "airport-transfer") return 3;
  return vehicleRuleSet[vehicleType].defaultPassengerCapacity;
}

export function getVehicleLuggageCapacity(vehicleType: VehicleType) {
  return vehicleRuleSet[vehicleType].luggageCapacity;
}

export function isQuoteOnlyVehicle(vehicleType: VehicleType) {
  return vehicleRuleSet[vehicleType].quoteOnly;
}

export function getVehicleCompatibility({
  vehicleType,
  serviceId,
  passengers,
  luggage
}: {
  vehicleType: VehicleType;
  serviceId: string;
  passengers: number;
  luggage: number;
}): VehicleCompatibility {
  const passengerCapacity = getVehiclePassengerCapacity(vehicleType, serviceId);
  const luggageCapacity = getVehicleLuggageCapacity(vehicleType);
  const passengersFit = passengers <= passengerCapacity;
  const luggageFits = luggageCapacity === null || luggage <= luggageCapacity;

  return {
    compatible: passengersFit && luggageFits,
    luggageFits,
    passengerCapacity,
    passengersFit
  };
}

export function getRecommendedVehicleType({
  serviceId,
  passengers,
  luggage
}: {
  serviceId: string;
  passengers: number;
  luggage: number;
}) {
  return vehicleTypes.find((vehicleType) =>
    getVehicleCompatibility({ vehicleType, serviceId, passengers, luggage }).compatible
  );
}
