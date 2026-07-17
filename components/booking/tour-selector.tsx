"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Clock, ExternalLink, MapPin, Users } from "lucide-react";
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
  const selected = tours.find((tour) => tour.id === value);

  return (
    <div className="space-y-5">
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

      {selected ? (
        <article className="grid overflow-hidden border border-primary/25 bg-primary/[0.045] md:grid-cols-[210px_1fr]">
          <div className="relative min-h-48">
            <Image src={selected.heroImage ?? selected.cardImage ?? selected.gallery[0]} alt={selected.name} fill className="object-cover" sizes="210px" />
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-primary">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" aria-hidden /> {selected.citySlug === "bogota" ? "Bogotá" : "Medellín"}</span>
              <span className="flex items-center gap-1"><Clock className="size-3.5" aria-hidden /> {selected.duration}</span>
              <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden /> Min. {selected.minimumPassengers ?? 2}</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold">{selected.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{selected.description}</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t pt-4">
              <span className="font-bold">
                <Price value={selected.basePrice} />
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {selected.pricingMode === "global" ? (language === "EN" ? "global price" : "precio global") : (language === "EN" ? "per person" : "por persona")}
                </span>
              </span>
              <Link href={`/destinos/${selected.citySlug}/${selected.slug}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">
                {language === "EN" ? "View details" : "Ver detalles"} <ExternalLink className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
