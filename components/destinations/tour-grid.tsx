import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Compass, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Price } from "@/components/preferences/site-preferences";
import { SectionReveal } from "@/components/sections/section-reveal";
import type { City, Tour } from "@/lib/domain/types";

export function TourGrid({
  city,
  tours,
  id = "tours",
  eyebrow = "Tours privados",
  title = `Experiencias privadas en ${city.name}`,
  description = city.description,
  muted = false
}: {
  city: City;
  tours: Tour[];
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  muted?: boolean;
}) {
  return (
    <section id={id} className={muted ? "section scroll-mt-24 bg-muted/55" : "section scroll-mt-24"}>
      <div className="container">
        <nav aria-label="Cambiar ciudad" className="mb-8 flex w-fit items-center gap-1 rounded-md border bg-card p-1">
          {[
            { slug: "bogota", label: "Bogotá" },
            { slug: "medellin", label: "Medellín" }
          ].map((item) => (
            <Link
              key={item.slug}
              href={`/destinos/${item.slug}#tours`}
              aria-current={city.slug === item.slug ? "page" : undefined}
              className={
                city.slug === item.slug
                  ? "rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-sm px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SectionReveal>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
            </div>
            <Badge className="w-fit bg-secondary text-secondary-foreground">
              <ShieldCheck className="mr-2 size-3" aria-hidden />
              Operación privada
            </Badge>
          </div>
        </SectionReveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <SectionReveal key={tour.id}>
              <Card className="group premium-card flex h-full overflow-hidden">
                <div className="flex w-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={tour.cardImage ?? tour.gallery[0]}
                  alt={tour.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-4">
                  <Badge className="bg-background/92 text-foreground">
                    {tour.pricingMode === "global" ? "Plan global" : "Plan privado"}
                  </Badge>
                </div>
                <span className="premium-icon absolute right-4 top-4 border-white/35 bg-white/95">
                  <Compass className="size-5" aria-hidden />
                </span>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">{tour.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="min-h-[72px] text-sm leading-6 text-muted-foreground">{tour.description}</p>
                <div className="mt-5 grid gap-3 rounded-md bg-muted/65 p-4 text-sm sm:grid-cols-2">
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="size-4" aria-hidden />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-2 font-medium">
                    <Users className="size-4" aria-hidden />
                    Min. {tour.minimumPassengers ?? 2}
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4 border-t pt-5">
                  <span className="text-sm font-semibold">
                    Desde <Price value={tour.basePrice} />
                    <span className="block text-[0.68rem] font-medium text-muted-foreground">
                      {tour.pricingMode === "global" ? "precio global" : "por persona, mínimo 2"}
                    </span>
                  </span>
                  <Button asChild variant="ghost" className="px-0">
                    <Link href={`/destinos/${city.slug}/${tour.slug}`}>
                      Ver tour <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </CardContent>
                </div>
              </Card>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
