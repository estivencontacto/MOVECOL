import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TourDetail } from "@/components/destinations/tour-detail";
import { getCity, getRelatedTours, getTour, tours } from "@/lib/data/catalog";
import { tourMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ city: string; tour: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ city: tour.citySlug, tour: tour.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, tour: tourSlug } = await params;
  const tour = getTour(citySlug, tourSlug);
  const city = getCity(citySlug);

  if (!tour || !city) return {};

  return tourMetadata(city, tour);
}

export default async function TourPage({ params }: Props) {
  const { city: citySlug, tour: tourSlug } = await params;
  const city = getCity(citySlug);
  const tour = getTour(citySlug, tourSlug);

  if (!city || !tour) notFound();
  const relatedTours = getRelatedTours(city.slug, tour.id);

  return <TourDetail city={city} tour={tour} relatedTours={relatedTours} />;
}
