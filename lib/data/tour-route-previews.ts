export type TourRoutePreview = {
  origin: string;
  destination: string;
  title: string;
  note: string;
};

const defaultOrigins: Record<string, string> = {
  bogota: "Parque de la 93, Bogota, Colombia",
  medellin: "Parque El Poblado, Medellin, Colombia"
};

export function getTourRoutePreview(citySlug: string, tourSlug: string, tourName: string): TourRoutePreview {
  const origin = defaultOrigins[citySlug] ?? defaultOrigins.medellin;
  const tour = tours.find((item) => item.citySlug === citySlug && item.slug === tourSlug);
  const destination = (tour ? getTourRouteDestination(tour.id)?.label : undefined) ?? `${tourName}, Colombia`;

  return {
    origin,
    destination,
    title: `Minimapa del recorrido ${tourName}`,
    note:
      "Ruta referencial desde una zona hotelera central. En la reserva final el mapa se recalcula con la direccion exacta de recogida del cliente."
  };
}
import { getTourRouteDestination, tours } from "@/lib/data/catalog";
