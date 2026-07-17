"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  HeartPulse,
  Plane,
  Route
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BookingLanguage } from "@/components/booking/booking-types";
import { services } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  "airport-transfer": Plane,
  transfers: Route,
  "private-tours": Compass,
  hourly: Clock3,
  "medical-tourism": HeartPulse,
  corporate: BriefcaseBusiness,
  events: CalendarDays
};

const descriptions: Record<string, { ES: string; EN: string }> = {
  "airport-transfer": { ES: "Desde o hacia el aeropuerto con coordinación de vuelo.", EN: "From or to the airport with flight coordination." },
  transfers: { ES: "Ruta privada entre dos ubicaciones.", EN: "Private route between two locations." },
  "private-tours": { ES: "Experiencias privadas con precio de catálogo.", EN: "Private experiences with catalog pricing." },
  hourly: { ES: "Vehículo y conductor para una agenda flexible.", EN: "Vehicle and driver for a flexible schedule." },
  "medical-tourism": { ES: "Movilidad discreta entre hotel, clínica y aeropuerto.", EN: "Discreet mobility between hotel, clinic and airport." },
  corporate: { ES: "Movilidad para reuniones, equipos e invitados.", EN: "Mobility for meetings, teams and guests." },
  events: { ES: "Coordinación de transporte para grupos y eventos.", EN: "Transport coordination for groups and events." }
};

const titles: Record<string, { ES: string; EN: string }> = {
  "airport-transfer": { ES: "Traslado aeropuerto", EN: "Airport transfer" },
  transfers: { ES: "Traslados", EN: "Point-to-point transfer" },
  "private-tours": { ES: "Tours privados", EN: "Private tours" },
  hourly: { ES: "Servicio por horas", EN: "Hourly service" },
  "medical-tourism": { ES: "Turismo médico", EN: "Medical travel" },
  corporate: { ES: "Transporte corporativo", EN: "Corporate transport" },
  events: { ES: "Eventos", EN: "Events" }
};

export function ServiceSelector({
  value,
  language,
  availableIds,
  onChange
}: {
  value: string;
  language: BookingLanguage;
  availableIds: string[];
  onChange: (serviceId: string) => void;
}) {
  const availableServices = services.filter(
    (service) => availableIds.includes(service.id) || service.id === "events"
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {availableServices.map((service) => {
        const Icon = icons[service.id] ?? Route;
        const selected = value === service.id;
        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(service.id)}
            className={cn(
              "focus-ring relative min-h-36 border bg-card p-4 text-left transition-colors duration-200 hover:border-primary/45",
              selected && "border-primary bg-primary/[0.06]"
            )}
          >
            <span className={cn("grid size-10 place-items-center rounded-md bg-muted text-primary", selected && "bg-primary text-primary-foreground")}>
              <Icon className="size-5" strokeWidth={1.8} aria-hidden />
            </span>
            {selected ? <Check className="absolute right-4 top-4 size-5 text-primary" aria-hidden /> : null}
            <span className="mt-4 block font-bold">{titles[service.id]?.[language] ?? service.title}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {descriptions[service.id]?.[language] ?? service.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
