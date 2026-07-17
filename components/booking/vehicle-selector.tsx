"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, CircleAlert, Luggage, Sparkles, Users } from "lucide-react";
import type { BookingLanguage } from "@/components/booking/booking-types";
import { vehicles } from "@/lib/data/catalog";
import type { VehicleType } from "@/lib/domain/types";
import {
  getRecommendedVehicleType,
  getVehicleCompatibility,
  getVehicleLuggageCapacity,
  getVehiclePassengerCapacity,
  isQuoteOnlyVehicle
} from "@/lib/domain/vehicle-rules";
import { getVehicleSurcharge } from "@/lib/services/pricing";
import { cn } from "@/lib/utils";

export function VehicleSelector({
  value,
  passengers,
  luggage,
  serviceId,
  language,
  onChange
}: {
  value: VehicleType;
  passengers: number;
  luggage: number;
  serviceId: string;
  language: BookingLanguage;
  onChange: (value: VehicleType) => void;
}) {
  const recommended = getRecommendedVehicleType({ serviceId, passengers, luggage });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {vehicles.map((vehicle) => {
        const compatibility = getVehicleCompatibility({
          vehicleType: vehicle.type,
          serviceId,
          passengers,
          luggage
        });
        const disabled = !vehicle.available || !compatibility.compatible;
        const selected = value === vehicle.type;
        const passengerCapacity = getVehiclePassengerCapacity(vehicle.type, serviceId);
        const luggageCapacity = getVehicleLuggageCapacity(vehicle.type);
        const surcharge = getVehicleSurcharge(vehicle.type);

        return (
          <motion.button
            key={vehicle.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(vehicle.type)}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            animate={selected ? { y: -2 } : { y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "focus-ring relative overflow-hidden border bg-card text-left transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-55",
              selected && "border-primary bg-primary/[0.06]"
            )}
          >
            <div className="relative aspect-[16/7] bg-muted">
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                fill
                className="object-contain p-3"
                sizes="(min-width: 640px) 260px, 100vw"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{vehicle.name}</p>
                {selected ? <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden /> : null}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" aria-hidden /> {passengerCapacity}
                </span>
                <span className="flex items-center gap-1">
                  <Luggage className="size-3.5" aria-hidden />
                  {luggageCapacity === null
                    ? language === "EN" ? "Luggage to confirm" : "Equipaje por confirmar"
                    : luggageCapacity}
                </span>
              </div>
              {recommended === vehicle.type ? (
                <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3.5" aria-hidden />
                  {language === "EN" ? "Recommended" : "Recomendado"}
                </p>
              ) : null}
              {surcharge > 0 ? (
                <p className="mt-2 text-xs font-semibold">
                  + COP ${surcharge.toLocaleString("es-CO")}
                </p>
              ) : null}
              {disabled ? (
                <p className="mt-3 flex gap-1 text-xs text-destructive">
                  <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {language === "EN" ? "Insufficient capacity" : "Capacidad insuficiente"}
                </p>
              ) : null}
              {isQuoteOnlyVehicle(vehicle.type) ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {language === "EN" ? "Price and availability to confirm" : "Precio y disponibilidad por confirmar"}
                </p>
              ) : null}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
