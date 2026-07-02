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

const routeDestinations: Record<string, Record<string, string>> = {
  bogota: {
    "city-tour": "Plaza de Bolivar, Bogota, Colombia",
    "hacienda-napoles": "Hacienda Napoles, Puerto Triunfo, Antioquia, Colombia",
    miradores: "Mirador La Calera, Bogota, Colombia",
    monserrate: "Cerro de Monserrate, Bogota, Colombia",
    "la-candelaria": "La Candelaria, Bogota, Colombia",
    "plaza-de-bolivar": "Plaza de Bolivar, Bogota, Colombia",
    "museo-del-oro": "Museo del Oro, Bogota, Colombia",
    "zona-t": "Zona T, Bogota, Colombia",
    guatavita: "Laguna de Guatavita, Sesquile, Cundinamarca, Colombia",
    "catedral-de-sal": "Catedral de Sal de Zipaquira, Colombia"
  },
  medellin: {
    "city-tour": "Plaza Botero, Medellin, Colombia",
    "comuna-13": "Graffitour Comuna 13, Medellin, Colombia",
    guatape: "Piedra del Penol, Guatape, Antioquia, Colombia",
    "vuelta-al-oriente": "El Retiro, Antioquia, Colombia",
    "coffee-tour": "Jardin, Antioquia, Colombia",
    "hacienda-napoles": "Hacienda Napoles, Puerto Triunfo, Antioquia, Colombia",
    parapente: "San Felix, Bello, Antioquia, Colombia",
    "tour-de-compras": "El Tesoro Parque Comercial, Medellin, Colombia",
    "pablo-escobar-tour": "Cementerio Jardines Montesacro, Itagui, Colombia",
    miradores: "Mirador Las Palmas, Medellin, Colombia",
    "santa-fe-de-antioquia": "Santa Fe de Antioquia, Antioquia, Colombia"
  }
};

export function getTourRoutePreview(citySlug: string, tourSlug: string, tourName: string): TourRoutePreview {
  const origin = defaultOrigins[citySlug] ?? defaultOrigins.medellin;
  const destination = routeDestinations[citySlug]?.[tourSlug] ?? `${tourName}, Colombia`;

  return {
    origin,
    destination,
    title: `Minimapa del recorrido ${tourName}`,
    note:
      "Ruta referencial desde una zona hotelera central. En la reserva final el mapa se recalcula con la direccion exacta de recogida del cliente."
  };
}
