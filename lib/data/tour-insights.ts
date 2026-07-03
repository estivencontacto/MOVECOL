import type { Tour } from "@/lib/domain/types";

const physicalDemandByTourId: Record<string, string> = {
  "med-city-tour": "Baja a media",
  "med-comuna-13": "Media",
  "med-guatape": "Media",
  "med-vuelta-oriente": "Baja",
  "med-coffee-tour": "Baja a media",
  "med-hacienda-napoles": "Baja, jornada larga",
  "med-parapente": "Media",
  "med-compras": "Media",
  "med-pablo-escobar": "Baja",
  "med-miradores": "Baja",
  "med-santa-fe": "Baja",
  "bog-city-tour": "Baja a media",
  "bog-hacienda-napoles": "Baja, jornada larga",
  "bog-miradores": "Baja",
  "bog-monserrate": "Media por altura",
  "bog-centro-historico-candelaria": "Media",
  "bog-gran-san-victorino": "Media",
  "bog-zona-t": "Baja",
  "bog-guatavita": "Media a alta",
  "bog-catedral-sal": "Baja a media",
  "bog-jaime-duque": "Baja a media"
};

export function getTourPhysicalDemand(tour: Tour) {
  return physicalDemandByTourId[tour.id] ?? "Baja";
}

export function getTourPrimaryRecommendation(tour: Tour) {
  return tour.recommendations?.[0] ?? "Usar ropa comoda y confirmar el punto de recogida antes de salir.";
}
