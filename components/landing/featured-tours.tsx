import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Price } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";
import type { LandingCityOption } from "@/components/landing/types";

export function FeaturedTours({
  city,
  language,
  copy
}: {
  city: LandingCityOption;
  language: "ES" | "EN";
  copy: {
    featuredIn: string;
    featuredText: string;
    viewTour: string;
    viewAllTours: string;
    from: string;
    globalPrice: string;
    perPerson: string;
  };
}) {
  return (
    <section className="section pt-10" aria-live="polite">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] md:text-5xl">
            {copy.featuredIn} {city.displayName}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">
            {copy.featuredText}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-[1.12fr_0.94fr_0.94fr]">
          {city.featuredTours.map((tour, index) => (
            <article
              key={tour.id}
              className={
                index === 0
                  ? "group overflow-hidden rounded-lg border bg-card md:col-span-2 xl:col-span-1"
                  : "group overflow-hidden rounded-lg border bg-card"
              }
            >
              <div className={index === 0 ? "relative aspect-[16/10] xl:aspect-[4/3]" : "relative aspect-[16/10]"}>
                <Image
                  src={tour.cardImage ?? tour.heroImage ?? tour.gallery[0]}
                  alt={tour.name}
                  fill
                  className="object-cover transition-transform duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]"
                  sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <MapPin className="size-4" strokeWidth={1.8} aria-hidden />
                  {city.displayName}
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em]">{tour.name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {tour.shortDescription[language]}
                </p>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t pt-5">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" strokeWidth={1.8} aria-hidden />
                    {tour.duration}
                  </span>
                  <span className="text-right text-sm font-semibold">
                    {copy.from} <Price value={tour.basePrice} />
                    <span className="block text-[0.7rem] font-medium text-muted-foreground">
                      {tour.pricingMode === "global" ? copy.globalPrice : copy.perPerson}
                    </span>
                  </span>
                </div>
                <Button asChild variant="ghost" className="mt-4 px-0 hover:bg-transparent hover:text-primary">
                  <Link href={`/destinos/${tour.citySlug}/${tour.slug}`}>
                    {copy.viewTour}
                    <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <Button asChild size="lg" className="mt-8 active:scale-[0.98]">
          <Link href={`/destinos/${city.city.slug}#tours`}>
            {copy.viewAllTours} {city.displayName}
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
