"use client";

import { Minus, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function QuantitySelector({
  id,
  label,
  value,
  min,
  max,
  icon: Icon,
  onChange
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  icon: LucideIcon;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-primary" aria-hidden />
        {label}
      </label>
      <div id={id} className="flex min-h-12 items-center justify-between border bg-background px-1">
        <Button type="button" variant="ghost" aria-label={`Reducir ${label}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
          <Minus className="size-4" aria-hidden />
        </Button>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="min-w-12 text-center font-bold"
            aria-live="polite"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <Button type="button" variant="ghost" aria-label={`Aumentar ${label}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
          <Plus className="size-4" aria-hidden />
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Min. {min} · Max. {max}</p>
    </div>
  );
}
