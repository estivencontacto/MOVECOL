"use client";

import { ArrowRight, Check, MapPin } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import type { BookingLanguage } from "@/components/booking/booking-types";
import { ServiceSelector } from "@/components/booking/service-selector";
import { TourSelector } from "@/components/booking/tour-selector";
import { Button } from "@/components/ui/button";
import { cities, tours } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import type { Tour } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export function ExperienceStep({
  cityId,
  serviceId,
  tourId,
  language,
  errors,
  onCityChange,
  onServiceChange,
  onTourChange,
  onContinue
}: {
  cityId: string;
  serviceId: string;
  tourId?: string;
  language: BookingLanguage;
  errors: FieldErrors<ReservationInput>;
  onCityChange: (cityId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onTourChange: (tour: Tour) => void;
  onContinue: () => void;
}) {
  const city = cities.find((item) => item.id === cityId) ?? cities[0];
  const cityTours = tours.filter((tour) => tour.citySlug === cityId);
  return (
    <section aria-labelledby="experience-title">
      <h2 id="experience-title" className="text-2xl font-bold sm:text-3xl">
        {language === "EN" ? "Choose your service" : "Selecciona tu servicio"}
      </h2>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold">{language === "EN" ? "City" : "Ciudad"}</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {cities.map((item) => {
            const selected = item.id === cityId;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onCityChange(item.id)}
                className={cn(
                  "focus-ring flex min-h-12 items-center justify-between border bg-background px-4 text-left font-semibold transition-colors",
                  selected ? "border-primary bg-primary/[0.06] text-primary" : "hover:border-primary/40"
                )}
              >
                <span className="flex items-center gap-2"><MapPin className="size-4" aria-hidden /> {item.name}</span>
                {selected ? <Check className="size-4" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
        {errors.cityId?.message ? <p className="mt-2 text-sm text-destructive">{errors.cityId.message}</p> : null}
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold">{language === "EN" ? "Service" : "Servicio"}</legend>
        <div className="mt-3">
          <ServiceSelector value={serviceId} language={language} availableIds={city.serviceIds ?? []} onChange={onServiceChange} />
        </div>
        {errors.serviceId?.message ? <p className="mt-2 text-sm text-destructive">{errors.serviceId.message}</p> : null}
      </fieldset>

      {serviceId === "private-tours" ? (
        <fieldset className="mt-6">
          <legend className="text-sm font-bold">{language === "EN" ? "Choose a private tour" : "Elige un tour privado"}</legend>
          <div className="mt-3"><TourSelector tours={cityTours} value={tourId} language={language} onChange={onTourChange} /></div>
          {errors.tourId?.message ? <p className="mt-2 text-sm text-destructive">{errors.tourId.message}</p> : null}
        </fieldset>
      ) : null}

      <Button type="button" size="lg" className="mt-6 w-full sm:w-auto" onClick={onContinue}>
        {language === "EN" ? "Continue with date and trip" : "Continuar con fecha y recorrido"}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </section>
  );
}
