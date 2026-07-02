"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
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
        <motion.button
          key={vehicle.id}
          type="button"
          onClick={() => onChange(vehicle.type)}
          whileTap={{ scale: 0.97 }}
          animate={value === vehicle.type ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "focus-ring rounded-lg border bg-card p-4 text-left transition hover:border-primary/50",
            value === vehicle.type && "border-primary bg-primary/[0.06] shadow-[0_14px_40px_-28px_rgba(7,18,128,0.55)]"
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
        </motion.button>
      ))}
    </div>
  );
}
