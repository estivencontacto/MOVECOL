"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { useLanguage } from "@/components/preferences/site-preferences";
import { FeaturedTours } from "@/components/landing/featured-tours";
import { FinalCta } from "@/components/landing/final-cta";
import { landingCopy } from "@/components/landing/landing-copy";
import { ServiceOverview } from "@/components/landing/service-overview";
import { TrustStrip } from "@/components/landing/trust-strip";
import type { LandingCityOption, LandingService } from "@/components/landing/types";

export function CityExplorer({
  cities,
  services,
  initialCity
}: {
  cities: LandingCityOption[];
  services: LandingService[];
  initialCity: string;
}) {
  const [language] = useLanguage();
  const [activeCitySlug, setActiveCitySlug] = useState(initialCity);
  const t = landingCopy[language];
  const activeCity =
    cities.find((item) => item.city.slug === activeCitySlug) ?? cities[0];

  return (
    <>
      <section id="destinos" className="section scroll-mt-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow">{t.cityEyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.025em] md:text-5xl">
              {t.cityTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">
              {t.cityText}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {cities.map((item) => {
              const active = item.city.slug === activeCity.city.slug;
              return (
                <button
                  key={item.city.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCitySlug(item.city.slug)}
                  className={
                    active
                      ? "group relative min-h-72 overflow-hidden rounded-lg border-2 border-primary text-left text-white shadow-[0_12px_32px_-22px_rgba(13,34,88,0.7)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                      : "group relative min-h-72 overflow-hidden rounded-lg border-2 border-transparent text-left text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  }
                >
                  <Image
                    src={item.city.image}
                    alt={item.displayName}
                    fill
                    className="object-cover transition-transform duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07162f]/92 via-[#07162f]/28 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 sm:p-6">
                    <div>
                      <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
                        <MapPin className="size-4" strokeWidth={1.8} aria-hidden />
                        {item.coverage[language]}
                      </span>
                      <span className="mt-2 block text-3xl font-black tracking-[-0.025em]">
                        {item.displayName}
                      </span>
                    </div>
                    <span
                      className={
                        active
                          ? "grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground"
                          : "grid size-10 shrink-0 place-items-center rounded-md border border-white/35 bg-[#07162f]/36 text-white"
                      }
                      aria-hidden
                    >
                      <Check className={active ? "size-5 opacity-100" : "size-5 opacity-0"} strokeWidth={2} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary" aria-live="polite">
            <Check className="size-4" strokeWidth={2} aria-hidden />
            {t.exploring} {activeCity.displayName}
          </p>
        </div>
      </section>

      <div key={activeCity.city.slug} className="city-content-enter">
        <FeaturedTours city={activeCity} language={language} copy={t} />
        <ServiceOverview
          services={services}
          citySlug={activeCity.city.slug}
          language={language}
          title={t.servicesTitle}
          description={t.servicesText}
        />
      </div>
      <TrustStrip />
      <FinalCta
        citySlug={activeCity.city.slug}
        title={t.finalTitle}
        description={t.finalText}
        bookLabel={t.bookNow}
        whatsappLabel={t.whatsapp}
      />
    </>
  );
}
