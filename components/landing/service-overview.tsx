import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CarFront,
  Clock3,
  HeartPulse,
  Plane,
  Route
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LandingService } from "@/components/landing/types";

const serviceIcons: Record<string, LucideIcon> = {
  "airport-transfer": Plane,
  transfers: Route,
  hourly: Clock3,
  "medical-tourism": HeartPulse,
  "private-tours": CarFront,
  corporate: BriefcaseBusiness
};

export function ServiceOverview({
  services,
  citySlug,
  language,
  title,
  description
}: {
  services: LandingService[];
  citySlug: string;
  language: "ES" | "EN";
  title: string;
  description: string;
}) {
  return (
    <section id="servicios" className="section bg-muted/45 scroll-mt-24">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-10 grid border-t md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1fr]">
          {services.map((service) => {
            const Icon = serviceIcons[service.id] ?? CarFront;
            return (
              <Link
                key={service.id}
                href={`/servicios/${service.slug}?city=${citySlug}`}
                className="group flex min-h-44 flex-col justify-between gap-6 border-b p-5 transition-colors duration-200 hover:bg-card focus-visible:bg-card md:p-6 lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{service.displayTitle[language]}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {service.shortDescription[language]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
