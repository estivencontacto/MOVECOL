import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  Car,
  HeartPulse,
  MapPinned,
  Plane,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionReveal } from "@/components/sections/section-reveal";
import { serviceAssetsByCity } from "@/lib/data/catalog";
import type { Service } from "@/lib/domain/types";

const serviceIcons: Record<string, LucideIcon> = {
  "airport-transfer": Plane,
  transfers: MapPinned,
  hourly: CalendarClock,
  "medical-tourism": HeartPulse,
  "private-tours": Sparkles,
  corporate: BriefcaseBusiness,
  events: Car
};

const cityCopy: Record<string, { title: string; description: string }> = {
  bogota: {
    title: "Servicios privados para aterrizar, reunirte y descubrir Bogota",
    description:
      "Cobertura desde El Dorado, agenda por horas, turismo medico, tours culturales y movilidad corporativa con soporte operativo."
  },
  medellin: {
    title: "Servicios privados para moverte por Medellin y Antioquia",
    description:
      "Traslados aeropuerto, recorridos flexibles, citas medicas, tours privados y movilidad ejecutiva con conductores profesionales."
  }
};

export function CityServices({
  citySlug,
  services
}: {
  citySlug: string;
  services: Service[];
}) {
  const getTitle = (service: Service) => {
    if (citySlug !== "bogota") return service.title;

    const bogotaTitles: Record<string, string> = {
      "airport-transfer": "Traslado Aeropuerto El Dorado",
      transfers: "Traslados dentro y fuera de la ciudad",
      hourly: "Transporte por horas",
      "medical-tourism": "Turismo medico",
      "private-tours": "Tours privados",
      corporate: "Transporte corporativo"
    };

    return bogotaTitles[service.id] ?? service.title;
  };

  const copy = cityCopy[citySlug] ?? {
    title: "Servicios privados para moverte sin afanes",
    description:
      "El modelo operativo de MOVE se adapta a aeropuerto, traslados, horas, turismo medico, tours privados y transporte corporativo."
  };

  return (
    <section className="section bg-muted/55">
      <div className="container">
        <SectionReveal>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Servicios</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{copy.title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{copy.description}</p>
            </div>
            <Badge className="w-fit bg-secondary text-secondary-foreground">
              <ShieldCheck className="mr-2 size-3" aria-hidden />
              Coordinacion MOVE
            </Badge>
          </div>
        </SectionReveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.id] ?? Car;
            const image =
              serviceAssetsByCity[citySlug]?.[service.id]?.card ??
              serviceAssetsByCity[citySlug]?.[service.id]?.hero;

            return (
              <SectionReveal key={service.id}>
                <Card className="group premium-card flex h-full overflow-hidden">
                  <div className="flex w-full flex-col">
                  {image ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={image}
                        alt={getTitle(service)}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <CardHeader className="pb-3">
                    <div className="premium-icon mb-3">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <CardTitle className="text-2xl">{getTitle(service)}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                    <div className="mt-5 space-y-2 rounded-md bg-muted/65 p-4">
                      {service.benefits.slice(0, 2).map((benefit) => (
                        <p key={benefit} className="flex gap-2 text-sm font-medium">
                          <ShieldCheck className="mt-0.5 size-4 text-primary" aria-hidden />
                          {benefit}
                        </p>
                      ))}
                    </div>
                    <Button asChild variant="ghost" className="mt-auto px-0">
                      <Link href={`/servicios/${service.slug}?city=${citySlug}`}>
                        Ver servicio <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </CardContent>
                  </div>
                </Card>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
