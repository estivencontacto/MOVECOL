"use client";

import Image from "next/image";
import { Check, Clock } from "lucide-react";
import type { BookingLanguage } from "@/components/booking/booking-types";
import { Price } from "@/components/preferences/site-preferences";
import type { Tour } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export function TourSelector({
  tours,
  value,
  language,
  onChange
}: {
  tours: Tour[];
  value?: string;
  language: BookingLanguage;
  onChange: (tour: Tour) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
        {tours.map((tour) => {
          const active = tour.id === value;
          return (
            <button
              key={tour.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(tour)}
              className={cn(
                "focus-ring grid min-h-28 grid-cols-[88px_1fr] overflow-hidden border bg-card text-left transition-colors duration-200 hover:border-primary/45",
                active && "border-primary bg-primary/[0.06]"
              )}
            >
              <span className="relative">
                <Image src={tour.cardImage ?? tour.heroImage ?? tour.gallery[0]} alt="" fill className="object-cover" sizes="88px" />
              </span>
              <span className="relative p-3">
                {active ? <Check className="absolute right-3 top-3 size-4 text-primary" aria-hidden /> : null}
                <span className="block pr-5 text-sm font-bold">{tour.name}</span>
                <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden /> {tour.duration}
                </span>
                <span className="mt-1 block text-xs font-semibold">
                  <Price value={tour.basePrice} /> · {tour.pricingMode === "global" ? "global" : language === "EN" ? "per person" : "por persona"}
                </span>
              </span>
            </button>
          );
        })}
    </div>
  );
}
