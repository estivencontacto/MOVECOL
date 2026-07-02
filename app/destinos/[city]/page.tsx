import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityHero } from "@/components/destinations/city-hero";
import { CityServices } from "@/components/destinations/city-services";
import { TourGrid } from "@/components/destinations/tour-grid";
import { cities, getCity, getServicesByCity, getToursByCity } from "@/lib/data/catalog";
import { breadcrumbSchema, cityMetadata, citySchema, jsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};

  return cityMetadata(city);
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const cityTours = getToursByCity(city.slug);
  const cityServices = getServicesByCity(city.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(citySchema(city, cityServices, cityTours)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Inicio", url: "/" },
              { name: "Destinos", url: "/destinos" },
              { name: city.name, url: `/destinos/${city.slug}` }
            ])
          )
        }}
      />
      <CityHero city={city} />
      <CityServices citySlug={city.slug} services={cityServices} />
      <TourGrid city={city} tours={cityTours} />
    </>
  );
}
