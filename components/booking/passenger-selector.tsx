"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PassengerSelector({
  value,
  onChange,
  min = 1,
  max = 50
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex h-11 items-center justify-between rounded-md border bg-background px-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Reducir pasajeros"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-4" aria-hidden />
      </Button>
      <span className="min-w-10 text-center text-sm font-semibold">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Aumentar pasajeros"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
