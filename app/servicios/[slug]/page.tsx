import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cities, getCity, getService, serviceAssetsByCity, services } from "@/lib/data/catalog";
import type { Service } from "@/lib/domain/types";
import { breadcrumbSchema, faqSchema, jsonLd, serviceMetadata, serviceSchema } from "@/lib/seo";

const whatsappUrl = "https://wa.link/6f907x";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ city?: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const service = getService(slug);
  if (!service) return {};

  const city = getRequestedCity(query?.city);
  const assets = getServiceAssets(city.slug, service.id);

  return serviceMetadata(service, city, assets?.hero ?? assets?.card);
}

export default async function ServicePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const service = getService(slug);
  if (!service) notFound();

  const city = getRequestedCity(query?.city);
  const assets = getServiceAssets(city.slug, service.id);
  const serviceImage = assets?.hero ?? assets?.card;
  const gallery = Array.from(new Set([serviceImage, ...(assets?.gallery ?? [])])).filter(Boolean) as string[];
  const serviceTitle = getServiceTitle(service, city.slug);
  const reservationUrl = `/reservar?service=${service.slug}&city=${city.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema(service, city, serviceImage)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(service.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Inicio", url: "/" },
              { name: "Servicios", url: "/servicios" },
              { name: service.title, url: `/servicios/${service.slug}` }
            ])
          )
        }}
      />

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {serviceImage ? (
          <Image
            src={serviceImage}
            alt={serviceTitle}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,128,0.94),rgba(7,18,128,0.68),rgba(7,18,128,0.22))]" />
        <div className="container relative grid min-h-[600px] items-center gap-10 py-20 lg:grid-cols-[1fr_0.48fr]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-secondary text-secondary-foreground">
                <MapPin className="mr-2 size-3" aria-hidden />
                {city.name}
              </Badge>
              <Badge className="bg-primary-foreground/12 text-primary-foreground">
                <ShieldCheck className="mr-2 size-3" aria-hidden />
                Servicio privado
              </Badge>
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">{serviceTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/84">
              {service.description}
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              <HeroSignal icon={CalendarCheck} title="Reserva" text="Confirmacion directa" />
              <HeroSignal icon={Clock} title="Agenda" text="Horarios coordinados" />
              <HeroSignal icon={MessageCircle} title="Soporte" text="Atencion por WhatsApp" />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={reservationUrl}>
                  Reservar servicio <ArrowRight className="size-4" aria-hidden />
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

          <aside className="rounded-lg border border-primary-foreground/18 bg-primary-foreground/10 p-5 backdrop-blur">
            <p className="eyebrow text-primary-foreground/70">Incluye</p>
            <div className="mt-5 space-y-3">
              {service.benefits.map((benefit) => (
                <p key={benefit} className="flex gap-3 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                  {benefit}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.42fr]">
          <div className="space-y-12">
            <div>
              <p className="eyebrow">Operacion</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Un servicio pensado para agendas reales, no para plantillas rigidas
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                MOVE coordina vehiculo, conductor y tiempos segun origen, destino,
                pasajeros, equipaje y prioridad del viaje. El resultado es un traslado o
                acompaniamiento privado con informacion clara desde la reserva.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <ValueCard
                  icon={ShieldCheck}
                  title="Coordinacion previa"
                  description="Validamos ciudad, horario, tipo de servicio y disponibilidad antes de confirmar."
                />
                <ValueCard
                  icon={Clock}
                  title="Tiempos realistas"
                  description="La operacion considera trafico, ventanas de espera y condiciones del recorrido."
                />
                <ValueCard
                  icon={Sparkles}
                  title="Experiencia premium"
                  description="Comunicacion directa, vehiculo adecuado y trato discreto para cada perfil de viajero."
                />
              </div>
            </div>

            <div>
              <p className="eyebrow">Proceso</p>
              <h2 className="mt-3 text-3xl font-semibold">De solicitud a confirmacion</h2>
              <div className="mt-8 grid gap-4">
                {service.process.map((step, index) => (
                  <Card key={step}>
                    <CardContent className="flex gap-4 p-5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-muted-foreground">{step}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {gallery.length > 0 ? (
              <div>
                <p className="eyebrow">Galeria</p>
                <h2 className="mt-3 text-3xl font-semibold">Imagenes del servicio</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {gallery.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className={
                        index === 0
                          ? "relative aspect-[16/10] overflow-hidden rounded-lg sm:col-span-2"
                          : "relative aspect-[4/3] overflow-hidden rounded-lg"
                      }
                    >
                      <Image
                        src={src}
                        alt={`${serviceTitle} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden border-primary/20">
              <CardHeader className="bg-primary text-primary-foreground">
                <p className="text-sm text-primary-foreground/74">Servicio MOVE</p>
                <CardTitle className="text-3xl">{city.name}</CardTitle>
                <p className="text-sm leading-6 text-primary-foreground/74">{serviceTitle}</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {service.benefits.map((benefit) => (
                  <p key={benefit} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {benefit}
                  </p>
                ))}
                <Button asChild className="w-full">
                  <Link href={reservationUrl}>Reservar servicio</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={whatsappUrl} target="_blank">
                    <WhatsAppIcon className="size-4" />
                    Cotizar por WhatsApp
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preguntas del servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-md border bg-background p-4">
                    <summary className="cursor-pointer text-sm font-semibold">{faq.question}</summary>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}

function getRequestedCity(citySlug?: string) {
  const slug = cities.some((city) => city.slug === citySlug) ? citySlug : "bogota";
  return getCity(slug ?? "bogota") ?? cities[0];
}

function getServiceAssets(citySlug: string, serviceId: string) {
  return serviceAssetsByCity[citySlug]?.[serviceId] ?? serviceAssetsByCity.medellin?.[serviceId];
}

function getServiceTitle(service: Service, citySlug: string) {
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
}

function HeroSignal({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-primary-foreground/16 bg-primary-foreground/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4" aria-hidden />
        {title}
      </div>
      <p className="mt-2 text-sm text-primary-foreground/72">{text}</p>
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
