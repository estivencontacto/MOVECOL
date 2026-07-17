import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, Plane, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import type { City } from "@/lib/domain/types";

const whatsappUrl = "https://wa.link/6f907x";

export function CityHero({ city }: { city: City }) {
  const gallery = city.heroGallery?.length ? city.heroGallery : [city.image];

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <Image
        src={city.heroImage ?? city.image}
        alt={city.name}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,128,0.94),rgba(7,18,128,0.68),rgba(7,18,128,0.2))]" />
      <div className="container relative grid min-h-[640px] items-center gap-10 py-20 lg:grid-cols-[1fr_0.72fr]">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <MapPin className="mr-2 size-3" aria-hidden />
              {city.name}
            </Badge>
            <Badge className="bg-primary-foreground/12 text-primary-foreground">
              <Plane className="mr-2 size-3" aria-hidden />
              {city.airport}
            </Badge>
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
            {city.heroTitle ?? `Transporte privado en ${city.name}`}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/84">
            {city.heroSubtitle ?? city.headline}
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/72">{city.description}</p>

          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <HeroSignal icon={ShieldCheck} title="Conductores" text="Profesionales verificados" />
            <HeroSignal icon={Clock} title="Operación" text="Puntual y coordinada" />
            <HeroSignal icon={Sparkles} title="Experiencias" text="Privadas y flexibles" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/reservar?city=${city.slug}`}>
                <CalendarCheck className="size-4" aria-hidden />
                Reservar ahora
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

        <div className="hidden lg:block">
          <div className="grid gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-primary-foreground/18">
              <Image
                src={gallery[0]}
                alt={`${city.name} servicio privado`}
                fill
                className="object-cover"
                sizes="38vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/72 to-transparent p-5">
                <p className="text-sm font-semibold">Destino con cobertura MOVE</p>
                <p className="mt-1 text-xs text-primary-foreground/72">
                  Aeropuerto, ciudad, tours, salud y agenda corporativa.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {gallery.slice(1, 3).map((src, index) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-primary-foreground/18"
                >
                  <Image
                    src={src}
                    alt={`${city.name} detalle ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="18vw"
                  />
                </div>
              ))}
              {gallery.length < 3 ? (
                <div className="rounded-lg border border-primary-foreground/18 bg-primary-foreground/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold">Plan a tu medida</p>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/72">
                    Elige aeropuerto, traslado, horas o tour privado y el equipo confirma disponibilidad.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
