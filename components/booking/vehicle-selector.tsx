"use client";

import { CheckCircle2 } from "lucide-react";
import { vehicles } from "@/lib/data/catalog";
import type { VehicleType } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export function VehicleSelector({
  value,
  onChange
}: {
  value: VehicleType;
  onChange: (value: VehicleType) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {vehicles.map((vehicle) => (
        <button
          key={vehicle.id}
          type="button"
          onClick={() => onChange(vehicle.type)}
          className={cn(
            "focus-ring rounded-lg border bg-card p-4 text-left transition hover:border-primary/50",
            value === vehicle.type && "border-primary"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{vehicle.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {vehicle.capacity} pasajeros | {vehicle.luggage} maletas
              </p>
            </div>
            {value === vehicle.type ? <CheckCircle2 className="size-5 text-primary" aria-hidden /> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
