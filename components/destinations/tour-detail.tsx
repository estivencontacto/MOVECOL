import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Clock,
  Compass,
  MapPin,
  MessageCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { TourGrid } from "@/components/destinations/tour-grid";
import { TourGalleryCarousel } from "@/components/destinations/tour-gallery-carousel";
import { TourRoutePreviewMap } from "@/components/destinations/tour-route-preview-map";
import { Price } from "@/components/preferences/site-preferences";
import { TourConditionBanner } from "@/components/weather/tour-condition-banner";
import { getTourRoutePreview } from "@/lib/data/tour-route-previews";
import { getTourPhysicalDemand, getTourPrimaryRecommendation } from "@/lib/data/tour-insights";
import type { City, Tour } from "@/lib/domain/types";
import { breadcrumbSchema, jsonLd, tourSchema } from "@/lib/seo";

const whatsappUrl = "https://wa.link/6f907x";

export function TourDetail({
  city,
  tour,
  relatedTours
}: {
  city: City;
  tour: Tour;
  relatedTours: Tour[];
}) {
  const reservationUrl = `/reservar?city=${city.slug}&tour=${tour.id}`;
  const heroImage = tour.heroImage ?? tour.gallery[0];
  const galleryImages = tour.gallery.length > 0 ? tour.gallery : [heroImage];
  const scheduleLabel = tour.schedules.join(" / ");
  const primaryRecommendation = getTourPrimaryRecommendation(tour);
  const physicalDemand = getTourPhysicalDemand(tour);
  const routePreview = getTourRoutePreview(city.slug, tour.slug, tour.name);
  const priceLabel =
    tour.pricingMode === "global" ? "Tarifa global del servicio" : "Tarifa por persona, mínimo 2 pasajeros";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(tourSchema(city, tour)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Inicio", url: "/" },
              { name: city.name, url: `/destinos/${city.slug}` },
              { name: tour.name, url: `/destinos/${city.slug}/${tour.slug}` }
            ])
          )
        }}
      />

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <Image
          src={heroImage}
          alt={`${tour.name} en ${city.name}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,128,0.92),rgba(7,18,128,0.66),rgba(7,18,128,0.22))]" />
        <div className="container relative grid min-h-[620px] items-center gap-10 py-20 lg:grid-cols-[1fr_0.56fr]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-secondary text-secondary-foreground">
                <MapPin className="mr-2 size-3" aria-hidden />
                {city.name}
              </Badge>
              <Badge className="bg-primary-foreground/12 text-primary-foreground">
                <ShieldCheck className="mr-2 size-3" aria-hidden />
                Experiencia privada
              </Badge>
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">{tour.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/84">
              {tour.description}
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <HeroFact icon={Clock} label="Duracion" value={tour.duration} />
              <HeroFact icon={CalendarDays} label="Salidas" value={scheduleLabel} />
              <HeroFact icon={Users} label="Viajeros" value={`Min. ${tour.minimumPassengers ?? 2}`} />
              <HeroFact icon={Activity} label="Exigencia fisica" value={physicalDemand} />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={reservationUrl}>
                  Reservar tour <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={whatsappUrl} target="_blank">
                  <WhatsAppIcon className="size-4" />
                  Cotizar por WhatsApp
                </Link>
              </Button>
            </div>
          </div>

          <aside className="hidden rounded-lg border border-primary-foreground/18 bg-primary-foreground/10 p-5 backdrop-blur md:block">
            <p className="eyebrow text-primary-foreground/70">Brief del viaje</p>
            <div className="mt-5 space-y-4">
              {[
                ["Servicio privado", "Vehiculo y conductor coordinados para tu grupo."],
                ["Ritmo flexible", "Paradas y tiempos ajustados a la operación del día."],
                ["Confirmacion directa", "El equipo MOVE valida disponibilidad antes de operar."]
              ].map(([title, description]) => (
                <div key={title} className="rounded-md bg-primary-foreground/10 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-primary-foreground/74">{description}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <TourConditionBanner
        citySlug={city.slug}
        duration={tour.duration}
        recommendation={primaryRecommendation}
        physicalDemand={physicalDemand}
      />

      <section className="section">
        <div className="container space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-lg border bg-card p-6 shadow-sm md:p-8">
              <p className="eyebrow">Detalle del tour</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{tour.name}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{tour.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <DetailPill icon={Clock} label="Duracion" value={tour.duration} />
                <DetailPill icon={CalendarDays} label="Horarios" value={scheduleLabel} />
                <DetailPill icon={Users} label="Minimo" value={`${tour.minimumPassengers ?? 2} pasajeros`} />
                <DetailPill icon={Activity} label="Exigencia" value={physicalDemand} />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold">Que incluye</h3>
                <div className="mt-4 grid gap-3">
                  {tour.includes.map((item, index) => (
                    <div key={item} className="flex gap-3 rounded-md border bg-muted/35 p-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <TourGalleryCarousel images={galleryImages} alt={tour.name} videoUrl={tour.videoUrl} />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.42fr]">
            <div className="space-y-12">
              <TourRoutePreviewMap citySlug={city.slug} route={routePreview} />

              <div>
                <p className="eyebrow">Experiencia</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  Un plan privado con logistica cuidada de principio a fin
                </h2>
                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                  MOVE organiza el recorrido para que el foco este en disfrutar el destino:
                  recogida puntual, tiempos realistas, conductor profesional y acompanamiento
                  operativo antes y durante la reserva.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <ValueCard
                    icon={Compass}
                    title="Ruta con criterio local"
                    description="El recorrido se ajusta al trafico, clima, horarios y prioridades del grupo."
                  />
                  <ValueCard
                    icon={Route}
                    title="Tiempos coordinados"
                    description="Horarios claros para salida, paradas principales, espera y regreso."
                  />
                  <ValueCard
                    icon={MessageCircle}
                    title="Soporte cercano"
                    description="Confirmacion por WhatsApp y asistencia para resolver detalles del servicio."
                  />
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <Card className="overflow-hidden border-primary/20">
                <CardHeader className="bg-primary text-primary-foreground">
                  <p className="text-sm text-primary-foreground/74">Desde</p>
                  <CardTitle className="text-4xl">
                    <Price value={tour.basePrice} />
                  </CardTitle>
                  <p className="text-xs font-medium text-primary-foreground/74">{priceLabel}</p>
                </CardHeader>
                <CardContent className="space-y-5 pt-6 text-sm">
                  <DetailRow icon={Clock} label="Duracion" value={tour.duration} />
                  <DetailRow icon={CalendarDays} label="Horarios" value={scheduleLabel} />
                  <DetailRow icon={Users} label="Minimo" value={`${tour.minimumPassengers ?? 2} pasajeros`} />
                  <Button asChild className="w-full">
                    <Link href={reservationUrl}>Reservar tour</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={whatsappUrl} target="_blank">
                      <WhatsAppIcon className="size-4" />
                      Cotizar por WhatsApp
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <InfoList title="No incluye" items={tour.excludes} icon="x" muted />
              <InfoList title="Recomendaciones" items={tour.recommendations ?? []} icon="spark" muted />
            </aside>
          </div>
        </div>
      </section>

      {relatedTours.length > 0 ? (
        <TourGrid
          city={city}
          tours={relatedTours}
          eyebrow="Tambien puedes reservar"
          title={`Mas experiencias privadas en ${city.name}`}
          description="Alternativas con el mismo estandar de transporte privado, coordinacion directa y tiempos pensados para viajar sin afanes."
          muted
        />
      ) : null}
    </>
  );
}

function HeroFact({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-primary-foreground/16 bg-primary-foreground/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4" aria-hidden />
        {label}
      </div>
      <p className="mt-2 text-sm text-primary-foreground/74">{value}</p>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="grid size-10 place-items-center rounded-md bg-secondary text-secondary-foreground">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function DetailPill({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-muted/35 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" aria-hidden />
        {label}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function InfoList({
  title,
  items,
  icon,
  muted = false
}: {
  title: string;
  items: string[];
  icon: "x" | "spark";
  muted?: boolean;
}) {
  if (items.length === 0) return null;

  const Icon = icon === "x" ? XCircle : Sparkles;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.map((item) => (
          <p key={item} className={muted ? "flex gap-3 text-muted-foreground" : "flex gap-3"}>
            <Icon className="mt-0.5 size-4 text-primary" aria-hidden />
            {item}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
