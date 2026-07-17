"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check, MapPin, Plane } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import type { BookingLanguage } from "@/components/booking/booking-types";
import { ServiceSelector } from "@/components/booking/service-selector";
import { TourSelector } from "@/components/booking/tour-selector";
import { Button } from "@/components/ui/button";
import { CityWeatherSummary } from "@/components/weather/city-weather-summary";
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
  const reduceMotion = useReducedMotion();
  const coverage = cityId === "bogota"
    ? language === "EN" ? "El Dorado, Bogotá and Cundinamarca" : "El Dorado, Bogotá y Cundinamarca"
    : language === "EN" ? "José María Córdova, Medellín and Antioquia" : "José María Córdova, Medellín y Antioquia";

  return (
    <section aria-labelledby="experience-title">
      <p className="eyebrow">{language === "EN" ? "Step 1" : "Paso 1"}</p>
      <h2 id="experience-title" className="mt-2 text-2xl font-bold sm:text-3xl">
        {language === "EN" ? "What kind of trip do you need?" : "¿Qué tipo de recorrido necesitas?"}
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={city.id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
            className="mt-3 overflow-hidden border bg-[#07162f] text-white"
          >
            <div className="grid md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="relative min-h-32 md:min-h-full">
                <Image src={city.image} alt={city.name} fill className="object-cover" sizes="180px" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#07162f]/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-xl font-bold">{city.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/75">
                    <Plane className="size-3.5" aria-hidden /> {city.airport}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <CityWeatherSummary
                  citySlug={city.slug}
                  language={language}
                  altitudeMeters={city.altitudeMeters}
                  timeZone={city.timeZone}
                  variant="dark"
                  labels={{
                    weather: language === "EN" ? "Temperature" : "Temperatura",
                    localTime: language === "EN" ? "Local time" : "Hora local",
                    altitude: language === "EN" ? "Altitude" : "Altura",
                    loading: language === "EN" ? "Checking city information" : "Consultando información de la ciudad",
                    unavailable: language === "EN" ? "Weather temporarily unavailable" : "Clima temporalmente no disponible"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {errors.cityId?.message ? <p className="mt-2 text-sm text-destructive">{errors.cityId.message}</p> : null}
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold">{language === "EN" ? "Service" : "Servicio"}</legend>
        <p className="mt-1 text-sm text-muted-foreground">{coverage}</p>
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
