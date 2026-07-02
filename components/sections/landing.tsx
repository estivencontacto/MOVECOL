"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Headphones,
  MapPin,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Star,
  Timer,
  UsersRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Price, useLanguage } from "@/components/preferences/site-preferences";
import { SectionReveal } from "@/components/sections/section-reveal";
import { CityWeatherSummary } from "@/components/weather/city-weather-summary";
import { cities, localImage, reviews, serviceAssetsByCity, services, tours, vehicles } from "@/lib/data/catalog";

type LandingCityContent = {
  heroImage: string;
  topTourIds: string[];
  ES: {
    badge: string;
    title: string;
    subtitle: string;
    serviceDescription: string;
    tourDescription: string;
  };
  EN: {
    badge: string;
    title: string;
    subtitle: string;
    serviceDescription: string;
    tourDescription: string;
  };
};

const cityOrder = ["bogota", "medellin"];

const landingCityContent: Record<string, LandingCityContent> = {
  bogota: {
    heroImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg"),
    topTourIds: ["bog-city-tour", "bog-monserrate", "bog-guatavita", "bog-catedral-sal"],
    ES: {
      badge: "Bogota privada",
      title: "Bogota con agenda privada, segura y flexible.",
      subtitle:
        "Traslados desde El Dorado, agenda corporativa, Monserrate, Candelaria y escapadas a Cundinamarca con operacion premium.",
      serviceDescription:
        "Servicios destacados para moverte entre aeropuerto, hoteles, clinicas, reuniones y planes culturales en Bogota.",
      tourDescription:
        "Las experiencias que mas reservan viajeros y equipos cuando quieren conocer Bogota con transporte privado."
    },
    EN: {
      badge: "Private Bogota",
      title: "Bogota on a private, secure and flexible schedule.",
      subtitle:
        "El Dorado transfers, business agendas, Monserrate, La Candelaria and Cundinamarca escapes with a premium operation.",
      serviceDescription:
        "Featured services for airport, hotels, clinics, meetings and cultural plans in Bogota.",
      tourDescription:
        "The experiences most booked by travelers and teams who want to explore Bogota with private transport."
    }
  },
  medellin: {
    heroImage: localImage("/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/HERO/images (2).jpg"),
    topTourIds: ["med-guatape", "med-comuna-13", "med-city-tour", "med-vuelta-oriente"],
    ES: {
      badge: "Medellin privada",
      title: "Medellin sin afanes, con traslados y tours privados.",
      subtitle:
        "Aeropuerto Jose Maria Cordova, Guatape, Comuna 13, miradores y agendas por horas con conductores profesionales.",
      serviceDescription:
        "Servicios destacados para aeropuerto, tours, turismo medico, eventos y recorridos flexibles en Medellin.",
      tourDescription:
        "Las rutas mas solicitadas para vivir Medellin y Antioquia con tiempos claros y acompanamiento privado."
    },
    EN: {
      badge: "Private Medellin",
      title: "Medellin with private rides and tours, no rush.",
      subtitle:
        "Jose Maria Cordova airport, Guatape, Comuna 13, viewpoints and hourly agendas with professional drivers.",
      serviceDescription:
        "Featured services for airport, tours, medical travel, events and flexible routes in Medellin.",
      tourDescription:
        "The most requested routes to experience Medellin and Antioquia with clear timing and private support."
    }
  }
};

const landingTourImages: Record<string, string> = {};

const landingServiceImages: Record<string, string> = {};

const text = {
  ES: {
    badge: "Explora Colombia",
    title: "Descubre Colombia con transporte privado premium.",
    subtitle:
      "Conductores profesionales, tours personalizados, atencion 24/7 y traslados privados calculados por ruta real.",
    reserve: "Reservar ahora",
    whatsapp: "Cotizar por WhatsApp",
    formTitle: "Reserva tu transporte",
    formSubtitle: "Cotizacion inmediata en menos de un minuto",
    professionalDrivers: "Conductores profesionales",
    support: "Atencion 24/7",
    securePayment: "Pago seguro",
    flexibleCancel: "Cancelacion flexible",
    travelersServed: "Viajeros atendidos",
    citiesAvailable: "Ciudades disponibles",
    experiencesAvailable: "Experiencias disponibles",
    happyClients: "Clientes satisfechos",
    destination: "Destino",
    destinationPlaceholder: "Bogota, Medellin o aeropuerto",
    service: "Servicio",
    city: "Ciudad",
    cityHint: "Elige ciudad",
    date: "Fecha",
    time: "Hora",
    travelers: "Pasajeros",
    search: "Buscar disponibilidad",
    mostBooked: "Tours mas reservados",
    topRequest: "Top solicitudes",
    featured: "Destinos destacados",
    featuredTitle: "Experiencias privadas para moverte por Colombia",
    featuredDescription:
      "Elige ciudad, servicio o tour. MOVE calcula traslados por ruta real y mantiene una operacion privada, comoda y segura.",
    services: "Servicios",
    servicesTitle: "Movilidad lista para cada plan",
    tours: "Tours populares",
    toursTitle: "Rutas que ya puedes reservar",
    fleet: "Vehiculos",
    fleetTitle: "Flota segun comodidad, pasajeros y equipaje",
    why: "Por que elegir MOVE",
    whyTitle: "Viaja en confianza. Sin afanes.",
    steps: "Como funciona",
    stepsTitle: "Reserva clara, precio trazable y confirmacion operativa",
    reviews: "Opiniones",
    reviewsTitle: "Confianza desde el primer contacto",
    contact: "Contacto",
    contactTitle: "Coordinemos tu proximo traslado privado",
    contactText:
      "Reserva en linea o conversa por WhatsApp para solicitudes corporativas, turismo medico, grupos o eventos con multiples vehiculos.",
    viewAll: "Ver destinos",
    viewTour: "Ver tour",
    book: "Reservar",
    from: "Desde",
    duration: "Duracion",
    weather: "Clima",
    localTime: "Hora local",
    altitude: "Altura",
    weatherLoading: "Consultando",
    weatherUnavailable: "Clima no disponible"
  },
  EN: {
    badge: "Explore Colombia",
    title: "Discover Colombia with premium private transport.",
    subtitle:
      "Professional drivers, custom tours, 24/7 assistance and private transfers priced by real route.",
    reserve: "Book now",
    whatsapp: "Quote on WhatsApp",
    formTitle: "Book your transport",
    formSubtitle: "Instant quote in less than one minute",
    professionalDrivers: "Professional drivers",
    support: "24/7 assistance",
    securePayment: "Secure payment",
    flexibleCancel: "Flexible cancellation",
    travelersServed: "Travelers served",
    citiesAvailable: "Available cities",
    experiencesAvailable: "Available experiences",
    happyClients: "Happy clients",
    destination: "Destination",
    destinationPlaceholder: "Bogota, Medellin or airport",
    service: "Service",
    city: "City",
    cityHint: "Choose city",
    date: "Date",
    time: "Time",
    travelers: "Passengers",
    search: "Search availability",
    mostBooked: "Most booked tours",
    topRequest: "Top requests",
    featured: "Featured destinations",
    featuredTitle: "Private experiences to move around Colombia",
    featuredDescription:
      "Choose a city, service or tour. MOVE prices transfers by real route and keeps the operation private, comfortable and safe.",
    services: "Services",
    servicesTitle: "Mobility for every plan",
    tours: "Popular tours",
    toursTitle: "Routes you can book now",
    fleet: "Fleet",
    fleetTitle: "Vehicles by comfort, passengers and luggage",
    why: "Why MOVE",
    whyTitle: "Travel with confidence. No rush.",
    steps: "How it works",
    stepsTitle: "Clear booking, traceable price and operational confirmation",
    reviews: "Reviews",
    reviewsTitle: "Trust from the first contact",
    contact: "Contact",
    contactTitle: "Let us coordinate your next private ride",
    contactText:
      "Book online or chat on WhatsApp for corporate requests, medical tourism, groups or events with multiple vehicles.",
    viewAll: "View destinations",
    viewTour: "View tour",
    book: "Book",
    from: "From",
    duration: "Duration",
    weather: "Weather",
    localTime: "Local time",
    altitude: "Altitude",
    weatherLoading: "Loading",
    weatherUnavailable: "Weather unavailable"
  }
};

const serviceLabels: Record<string, { ES: string; EN: string }> = {
  "airport-transfer": { ES: "Aeropuerto", EN: "Airport" },
  transfers: { ES: "Traslados", EN: "Transfers" },
  hourly: { ES: "Por horas", EN: "Hourly" },
  "medical-tourism": { ES: "Turismo medico", EN: "Medical travel" },
  "private-tours": { ES: "Tours privados", EN: "Private tours" },
  corporate: { ES: "Corporativo", EN: "Corporate" },
  events: { ES: "Eventos", EN: "Events" }
};

const serviceDescriptions: Record<string, { ES: string; EN: string }> = {
  "airport-transfer": {
    ES: "Recogidas y salidas con monitoreo de vuelo y tarifa por ruta.",
    EN: "Arrivals and departures with flight monitoring and route-based pricing."
  },
  transfers: {
    ES: "Origen y destino personalizados dentro o fuera de la ciudad.",
    EN: "Custom origin and destination inside or outside the city."
  },
  hourly: {
    ES: "Conductor disponible para agendas flexibles y varias paradas.",
    EN: "Driver available for flexible schedules and multiple stops."
  },
  "medical-tourism": {
    ES: "Traslados discretos para clinicas, hoteles y controles medicos.",
    EN: "Discreet rides for clinics, hotels and medical appointments."
  },
  "private-tours": {
    ES: "Experiencias culturales y naturales con ritmo privado.",
    EN: "Cultural and nature experiences at a private pace."
  },
  corporate: {
    ES: "Movilidad para empresas, invitados, reuniones y eventos.",
    EN: "Mobility for companies, guests, meetings and events."
  },
  events: {
    ES: "Logistica de transporte para bodas, congresos y grupos.",
    EN: "Transport logistics for weddings, conferences and groups."
  }
};

const cityCopy: Record<string, { label: string; ES: string; EN: string }> = {
  bogota: {
    label: "City escape",
    ES: "Aeropuerto El Dorado, Monserrate, Candelaria y tours a Cundinamarca.",
    EN: "El Dorado airport, Monserrate, La Candelaria and tours around Cundinamarca."
  },
  medellin: {
    label: "Best seller",
    ES: "Aeropuerto JMC, Guatape, Comuna 13, miradores y experiencias privadas.",
    EN: "JMC airport, Guatape, Comuna 13, viewpoints and private experiences."
  }
};

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12
    }
  }
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: "easeOut" }
  }
};

function getServicesForCity(citySlug: string) {
  const city = cities.find((item) => item.slug === citySlug);
  const serviceIds = city?.serviceIds ?? services.map((service) => service.id);

  return serviceIds
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service): service is (typeof services)[number] => Boolean(service));
}

function getMostBookedTours(citySlug: string, limit = 6) {
  const content = landingCityContent[citySlug] ?? landingCityContent.bogota;
  const orderedTours = content.topTourIds
    .map((tourId) => tours.find((tour) => tour.id === tourId))
    .filter((tour): tour is (typeof tours)[number] => Boolean(tour));
  const fallbackTours = tours.filter(
    (tour) => tour.citySlug === citySlug && !orderedTours.some((orderedTour) => orderedTour.id === tour.id)
  );

  return [...orderedTours, ...fallbackTours].slice(0, limit);
}

function getLandingTourImage(tour: (typeof tours)[number], citySlug: string) {
  return (
    tour.cardImage ??
    tour.heroImage ??
    landingTourImages[tour.id] ??
    landingCityContent[citySlug]?.heroImage ??
    landingCityContent.bogota.heroImage
  );
}

function getLandingServiceImage(serviceId: string, citySlug: string) {
  const catalogAsset = serviceAssetsByCity[citySlug]?.[serviceId];

  return (
    catalogAsset?.card ??
    catalogAsset?.hero ??
    landingServiceImages[serviceId] ??
    landingCityContent[citySlug]?.heroImage ??
    landingCityContent.bogota.heroImage
  );
}

export function LandingPage() {
  const [language] = useLanguage();
  const [activeCitySlug, setActiveCitySlug] = useState("bogota");
  const [selectedServiceId, setSelectedServiceId] = useState("airport-transfer");
  const router = useRouter();
  const t = text[language];
  const activeCity = cities.find((city) => city.slug === activeCitySlug) ?? cities[0];
  const activeCityDetails = landingCityContent[activeCity.slug] ?? landingCityContent.bogota;
  const activeCityCopy = activeCityDetails[language];
  const cityButtons = cityOrder
    .map((citySlug) => cities.find((city) => city.slug === citySlug))
    .filter((city): city is (typeof cities)[number] => Boolean(city));
  const visibleServices = useMemo(() => getServicesForCity(activeCity.slug), [activeCity.slug]);
  const mostBookedTours = useMemo(() => getMostBookedTours(activeCity.slug), [activeCity.slug]);

  useEffect(() => {
    if (visibleServices.some((service) => service.id === selectedServiceId)) return;

    setSelectedServiceId(visibleServices[0]?.id ?? "transfers");
  }, [selectedServiceId, visibleServices]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const city = activeCity.slug;
    const service = String(data.get("service") ?? selectedServiceId);
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "09:00");
    const passengers = String(data.get("passengers") ?? "2");
    const params = new URLSearchParams({ city, service, date, time, passengers });
    router.push(`/reservar?${params.toString()}`);
  };

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-[#111318]">
        <motion.div
          key={activeCity.slug}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1.07 }}
          transition={{ duration: 18, ease: "easeInOut" }}
        >
          <Image
            src={activeCityDetails.heroImage}
            alt={`${activeCity.name} private travel with MOVE Colombia`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,18,0.86),rgba(10,12,18,0.44)_48%,rgba(10,12,18,0.22))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,18,0.16),rgba(10,12,18,0.72))]" />
        <motion.div
          className="container relative flex min-h-[100svh] flex-col justify-end pb-8 pt-28 md:justify-center md:pb-12 md:pt-32"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="max-w-3xl pb-2 text-white md:pb-8">
              <motion.div variants={heroItem}>
                <Badge className="mb-5 rounded-md border border-white/20 bg-white/[0.14] text-white shadow-sm backdrop-blur">
                  {activeCityCopy.badge}
                </Badge>
              </motion.div>
              <motion.h1 variants={heroItem} className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                {activeCityCopy.title}
              </motion.h1>
              <motion.p variants={heroItem} className="mt-5 max-w-xl text-base leading-7 text-white/[0.86] md:text-lg">
                {activeCityCopy.subtitle}
              </motion.p>
              <motion.div variants={heroItem} className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-md bg-white text-foreground shadow-lg transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/[0.92] hover:shadow-xl active:scale-[0.98]">
                  <Link href="/reservar">
                    {t.reserve} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="rounded-md shadow-lg transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                  <Link href="https://wa.link/6f907x" target="_blank">
                    <WhatsAppIcon className="size-4" />
                    {t.whatsapp}
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={heroItem} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/[0.88] md:text-sm">
                {[
                  { icon: ShieldCheck, label: t.professionalDrivers },
                  { icon: Headphones, label: t.support },
                  { icon: CreditCard, label: t.securePayment },
                  { icon: CheckCircle2, label: t.flexibleCancel }
                ].map((item, index) => (
                  <span key={item.label} className="flex items-center gap-2">
                    {index > 0 ? <span className="hidden h-4 w-px bg-white/30 sm:block" /> : null}
                    <item.icon className="size-4 text-secondary" aria-hidden />
                    {item.label}
                  </span>
                ))}
              </motion.div>
              <motion.div
                variants={heroItem}
                className="mt-6 max-w-3xl rounded-lg border border-white/[0.16] bg-black/25 p-3 shadow-[0_24px_80px_-52px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-white/68">
                    {language === "EN" ? "Live city context" : "Datos actuales de la ciudad"}
                  </p>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white">
                    {activeCity.name}
                  </span>
                </div>
                <CityWeatherSummary
                  citySlug={activeCity.slug}
                  language={language}
                  labels={{
                    weather: t.weather,
                    localTime: t.localTime,
                    altitude: t.altitude,
                    loading: t.weatherLoading,
                    unavailable: t.weatherUnavailable
                  }}
                  variant="dark"
                />
              </motion.div>
              <motion.div
                variants={heroItem}
                className="mt-7 max-w-2xl rounded-lg border border-white/[0.16] bg-white/[0.10] p-3 shadow-[0_22px_80px_-50px_rgba(0,0,0,0.75)] backdrop-blur-md"
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-white">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Timer className="size-4 text-secondary" aria-hidden />
                    {t.mostBooked}
                  </p>
                  <span className="text-xs font-semibold text-white/[0.64]">{t.topRequest} - {activeCity.name}</span>
                </div>
                <div className="grid gap-2">
                  {mostBookedTours.slice(0, 3).map((tour, index) => (
                    <Link
                      key={tour.id}
                      href={`/destinos/${tour.citySlug}/${tour.slug}`}
                      className="group grid grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-white/10 bg-black/[0.18] p-2 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.28] hover:bg-white/[0.12]"
                    >
                      <div className="relative h-16 overflow-hidden rounded-md">
                        <Image
                          src={getLandingTourImage(tour, activeCity.slug)}
                          alt={tour.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="76px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          #{index + 1} {tour.name}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                          <Clock className="size-3.5" aria-hidden />
                          {tour.duration}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-white/[0.54] transition duration-300 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.form
              variants={heroItem}
              onSubmit={submitSearch}
              className="rounded-lg border border-white/[0.28] bg-white/[0.92] p-4 shadow-[0_28px_90px_-38px_rgba(0,0,0,0.65)] backdrop-blur-xl transition duration-300 hover:shadow-[0_38px_110px_-42px_rgba(0,0,0,0.75)] md:p-5"
            >
              <div className="mb-4">
                <p className="text-xl font-semibold">{t.formTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.formSubtitle}</p>
              </div>
              <div className="grid gap-3">
                <input type="hidden" name="city" value={activeCity.slug} />
                <div className="rounded-lg border bg-background p-3">
                  <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-bold uppercase text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden />
                    {t.cityHint}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cityButtons.map((city) => {
                      const cityDetails = landingCityContent[city.slug] ?? landingCityContent.bogota;
                      const isActive = city.slug === activeCity.slug;

                      return (
                        <button
                          key={city.id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setActiveCitySlug(city.slug)}
                          className={
                            isActive
                              ? "travel-card flex min-h-[78px] items-center gap-3 overflow-hidden rounded-md border border-foreground bg-foreground p-2 text-left text-background shadow-md transition duration-300"
                              : "travel-card flex min-h-[78px] items-center gap-3 overflow-hidden rounded-md border bg-white p-2 text-left text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                          }
                        >
                          <span className="travel-icon" aria-hidden="true">
                            <PlaneTakeoff className="size-4" aria-hidden />
                          </span>
                          <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={cityDetails.heroImage}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{city.name}</span>
                            <span className={isActive ? "block truncate text-xs text-background/[0.68]" : "block truncate text-xs text-muted-foreground"}>
                              {cityDetails[language].badge}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3">
                    <CityWeatherSummary
                      citySlug={activeCity.slug}
                      language={language}
                      labels={{
                        weather: t.weather,
                        localTime: t.localTime,
                        altitude: t.altitude,
                        loading: t.weatherLoading,
                        unavailable: t.weatherUnavailable
                      }}
                    />
                  </div>
                </div>
                <SearchField icon={Car} label={t.service}>
                  <select
                    name="service"
                    value={selectedServiceId}
                    onChange={(event) => setSelectedServiceId(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  >
                    {visibleServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {serviceLabels[service.id]?.[language] ?? service.title}
                      </option>
                    ))}
                  </select>
                </SearchField>
                <div className="grid gap-3 sm:grid-cols-3">
                  <SearchField icon={CalendarDays} label={t.date}>
                    <input name="date" type="date" className="w-full bg-transparent text-sm font-semibold outline-none" />
                  </SearchField>
                  <SearchField icon={Clock} label={t.time}>
                    <input name="time" type="time" defaultValue="09:00" className="w-full bg-transparent text-sm font-semibold outline-none" />
                  </SearchField>
                  <SearchField icon={UsersRound} label={t.travelers}>
                    <input
                      name="passengers"
                      type="number"
                      min={2}
                      max={50}
                      defaultValue={2}
                      className="w-full bg-transparent text-sm font-semibold outline-none"
                    />
                  </SearchField>
                </div>
                <Button type="submit" size="lg" className="mt-1 h-12 rounded-md bg-foreground text-background shadow-lg transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-foreground/[0.92] hover:shadow-xl active:scale-[0.98]">
                  <Search className="size-4" aria-hidden />
                  {t.search}
                </Button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </section>

      <section className="bg-background py-8 md:py-10">
        <div className="container">
          <motion.div
            className="grid gap-3 rounded-3xl border bg-card p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={heroContainer}
          >
            {[
              { value: 5000, suffix: "+", label: t.travelersServed },
              { value: cities.length, suffix: "", label: t.citiesAvailable },
              { value: tours.length, suffix: "+", label: t.experiencesAvailable },
              { value: 98, suffix: "%", label: t.happyClients }
            ].map((item) => (
              <motion.div key={item.label} variants={heroItem} className="rounded-2xl bg-muted/[0.45] p-5 text-center">
                <p className="text-3xl font-black text-primary">
                  <CountUp value={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="destinos" className="section bg-background">
        <div className="container">
          <SectionHeader eyebrow={t.featured} title={t.featuredTitle} description={t.featuredDescription} />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {cities.map((city) => (
              <Link key={city.id} href={`/destinos/${city.slug}`} className="group travel-card overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-36px_rgba(15,23,42,0.55)]">
                <span className="travel-icon" aria-hidden="true">
                  <PlaneTakeoff className="size-4" aria-hidden />
                </span>
                <div className="relative aspect-[16/11]">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-foreground/0 transition duration-300 group-hover:bg-foreground/20" />
                  <Badge className="absolute left-4 top-4 rounded-full bg-foreground text-background">{cityCopy[city.slug]?.label}</Badge>
                  <span className="absolute bottom-4 right-4 translate-y-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {language === "EN" ? "View more" : "Ver mas"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold transition duration-300 group-hover:translate-x-1">{city.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{cityCopy[city.slug]?.[language] ?? city.description}</p>
                    </div>
                    <span className="rounded-full border px-3 py-1 text-sm font-semibold">4.9</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="section bg-muted/[0.45]">
        <div className="container">
          <SectionHeader
            eyebrow={t.services}
            title={`${t.servicesTitle} - ${activeCity.name}`}
            description={activeCityCopy.serviceDescription}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service) => {
              const serviceImage = getLandingServiceImage(service.id, activeCity.slug);
              return (
                <SectionReveal key={service.id}>
                  <Link href={`/servicios/${service.slug}`} className="group travel-card relative block h-full overflow-hidden rounded-lg border bg-card shadow-sm transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_70px_-38px_rgba(15,23,42,0.45)]">
                    <span className="travel-icon" aria-hidden="true">
                      <PlaneTakeoff className="size-4" aria-hidden />
                    </span>
                    <div className="relative aspect-[16/10]">
                      <Image src={serviceImage} alt={service.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <Car className="mb-3 size-5 text-primary" aria-hidden />
                      <h3 className="text-lg font-semibold">{serviceLabels[service.id]?.[language] ?? service.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {serviceDescriptions[service.id]?.[language] ?? service.description}
                      </p>
                    </div>
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition duration-300 group-hover:scale-x-100" />
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="tours">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow={t.mostBooked}
              title={`${t.toursTitle} - ${activeCity.name}`}
              description={activeCityCopy.tourDescription}
            />
            <Button asChild variant="outline" className="w-fit rounded-md">
              <Link href={`/destinos/${activeCity.slug}`}>{t.viewAll}</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mostBookedTours.map((tour) => (
              <Card key={tour.id} className="group travel-card overflow-hidden rounded-lg transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_80px_-42px_rgba(15,23,42,0.55)]">
                <span className="travel-icon" aria-hidden="true">
                  <PlaneTakeoff className="size-4" aria-hidden />
                </span>
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image src={getLandingTourImage(tour, activeCity.slug)} alt={tour.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <Badge className="absolute left-4 top-4 rounded-md bg-foreground text-background">{activeCity.name}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{tour.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{tour.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4" aria-hidden /> {tour.duration}
                    </span>
                    <span className="font-semibold">
                      {t.from} <Price value={tour.basePrice} />
                      <span className="block text-right text-[0.68rem] font-medium text-muted-foreground">
                        {tour.pricingMode === "global"
                          ? language === "EN" ? "global price" : "precio global"
                          : language === "EN" ? "per person, min. 2" : "por persona, minimo 2"}
                      </span>
                    </span>
                  </div>
                  <Button asChild className="mt-5 w-full rounded-md transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]">
                    <Link href={`/destinos/${tour.citySlug}/${tour.slug}`}>{t.viewTour}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="vehiculos" className="section bg-foreground text-background">
        <div className="container">
          <SectionHeader eyebrow={t.fleet} title={t.fleetTitle} description={t.contactText} inverted />
          <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-5">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="min-w-[82%] snap-center overflow-hidden rounded-2xl border border-white/[0.12] bg-white text-foreground shadow-[0_22px_70px_-44px_rgba(255,255,255,0.55)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_100px_-46px_rgba(255,255,255,0.45)] sm:min-w-[46%] lg:min-w-[340px] xl:min-w-[370px]">
                <div className="relative aspect-[16/10]">
                  <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{vehicle.description}</p>
                  <div className="mt-4 flex justify-between text-sm font-semibold">
                    <span>{vehicle.capacity} pax</span>
                    <span>{vehicle.luggage} bags</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="como-funciona">
        <div className="container">
          <SectionHeader eyebrow={t.steps} title={t.stepsTitle} description={t.featuredDescription} />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { icon: MapPin, ES: "Elige ciudad y ruta", EN: "Choose city and route" },
              { icon: Car, ES: "Selecciona vehiculo", EN: "Select vehicle" },
              { icon: ShieldCheck, ES: "Confirma precio", EN: "Confirm price" },
              { icon: CheckCircle2, ES: "Recibe soporte", EN: "Get support" }
            ].map((item, index) => (
              <Card key={item.ES} className="rounded-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
                <CardHeader>
                  <item.icon className="size-6 text-primary" aria-hidden />
                  <CardTitle>{item[language]}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted/[0.55]" id="opiniones">
        <div className="container">
          <SectionHeader eyebrow={t.reviews} title={t.reviewsTitle} description={t.featuredDescription} />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-40px_rgba(15,23,42,0.42)]">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 fill-secondary text-secondary" aria-hidden />
                  ))}
                </div>
                <p className="leading-7 text-muted-foreground">"{review.quote}"</p>
                <p className="mt-5 font-semibold">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contacto">
        <div className="container grid gap-8 rounded-3xl bg-primary p-6 text-primary-foreground md:p-10 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <p className="eyebrow text-primary-foreground/70">{t.contact}</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{t.contactTitle}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/[0.78]">{t.contactText}</p>
          </div>
          <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg" variant="secondary" className="rounded-full transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/reservar">
                <CalendarDays className="size-4" aria-hidden />
                {t.reserve}
              </Link>
            </Button>
            <Button asChild size="lg" className="rounded-full bg-white text-foreground transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]">
              <Link href="https://wa.link/6f907x" target="_blank">
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SearchField({
  icon: Icon,
  label,
  children
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-16 items-center gap-3 rounded-lg border bg-background px-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.68rem] font-bold uppercase text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const totalFrames = 70;

    const animate = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {suffix === "+" ? "+" : ""}
      {displayValue.toLocaleString("es-CO")}
      {suffix !== "+" ? suffix : ""}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  inverted = false
}: {
  eyebrow: string;
  title: string;
  description: string;
  inverted?: boolean;
}) {
  return (
    <SectionReveal>
      <div className="max-w-3xl">
        <p className={inverted ? "eyebrow text-background/[0.62]" : "eyebrow"}>{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
        <p className={inverted ? "mt-4 leading-7 text-background/[0.72]" : "mt-4 leading-7 text-muted-foreground"}>
          {description}
        </p>
      </div>
    </SectionReveal>
  );
}
