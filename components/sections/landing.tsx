import { CityExplorer } from "@/components/landing/city-explorer";
import { LandingHero } from "@/components/landing/landing-hero";
import type { LandingCityOption, LandingService } from "@/components/landing/types";
import { cities, getToursByCity, services } from "@/lib/data/catalog";

const cityDisplay = {
  bogota: {
    displayName: "Bogotá",
    coverage: {
      ES: "El Dorado, ciudad y Cundinamarca",
      EN: "El Dorado, city and Cundinamarca"
    },
    preferredTourIds: ["bog-city-tour", "bog-monserrate", "bog-guatavita", "bog-catedral-sal"]
  },
  medellin: {
    displayName: "Medellín",
    coverage: {
      ES: "José María Córdova, ciudad y Antioquia",
      EN: "José María Córdova, city and Antioquia"
    },
    preferredTourIds: ["med-guatape", "med-comuna-13", "med-city-tour", "med-vuelta-oriente"]
  }
} as const;

const serviceDescriptions: Record<string, { ES: string; EN: string }> = {
  "airport-transfer": {
    ES: "Recogidas y salidas coordinadas según tu vuelo y ciudad.",
    EN: "Arrivals and departures coordinated around your flight and city."
  },
  transfers: {
    ES: "Rutas privadas punto a punto dentro y fuera de la ciudad.",
    EN: "Private point-to-point routes inside and outside the city."
  },
  hourly: {
    ES: "Vehículo y conductor para agendas flexibles con varias paradas.",
    EN: "Vehicle and driver for flexible schedules with multiple stops."
  },
  "medical-tourism": {
    ES: "Movilidad discreta entre aeropuerto, hotel, clínica y controles.",
    EN: "Discreet mobility between airport, hotel, clinic and appointments."
  },
  "private-tours": {
    ES: "Experiencias culturales y naturales con un ritmo privado.",
    EN: "Cultural and nature experiences at a private pace."
  },
  corporate: {
    ES: "Transporte para invitados, equipos, reuniones y eventos.",
    EN: "Transport for guests, teams, meetings and events."
  }
};

const serviceTitles: Record<string, { ES: string; EN: string }> = {
  "airport-transfer": { ES: "Traslado aeropuerto", EN: "Airport transfer" },
  transfers: { ES: "Traslados dentro y fuera de la ciudad", EN: "City and regional transfers" },
  hourly: { ES: "Servicio privado por horas", EN: "Private hourly service" },
  "medical-tourism": { ES: "Turismo médico", EN: "Medical travel" },
  "private-tours": { ES: "Tours privados", EN: "Private tours" },
  corporate: { ES: "Transporte corporativo", EN: "Corporate transport" }
};

const tourDescriptions: Record<string, { ES: string; EN: string }> = {
  "bog-city-tour": {
    ES: "Historia, arquitectura y cultura de Bogotá con tiempos flexibles y transporte privado.",
    EN: "Bogotá history, architecture and culture with flexible timing and private transport."
  },
  "bog-monserrate": {
    ES: "Visita el cerro más emblemático de Bogotá con traslado, entradas y guía.",
    EN: "Visit Bogotá's most iconic mountain with transfer, admission and guide."
  },
  "bog-guatavita": {
    ES: "Laguna sagrada, pueblo blanco y una ruta privada por Cundinamarca.",
    EN: "Sacred lagoon, white village and a private route through Cundinamarca."
  },
  "med-guatape": {
    ES: "Un día completo entre la Piedra del Peñol, el embalse y los zócalos de Guatapé.",
    EN: "A full day around El Peñol rock, the reservoir and Guatapé's colorful streets."
  },
  "med-comuna-13": {
    ES: "Arte urbano, memoria local y miradores en una experiencia privada guiada.",
    EN: "Street art, local history and viewpoints in a private guided experience."
  },
  "med-city-tour": {
    ES: "Los lugares esenciales de Medellín en un recorrido privado de ritmo flexible.",
    EN: "Medellín's essential places in a flexible private city tour."
  }
};

function getLandingCities(): LandingCityOption[] {
  return (["bogota", "medellin"] as const).map((slug) => {
    const city = cities.find((item) => item.slug === slug);
    if (!city) throw new Error(`Missing landing city: ${slug}`);
    const display = cityDisplay[slug];
    const cityTours = getToursByCity(slug);
    const ordered = display.preferredTourIds
      .map((tourId) => cityTours.find((tour) => tour.id === tourId))
      .filter((tour): tour is (typeof cityTours)[number] => Boolean(tour));
    const featured = cityTours.filter(
      (tour) => tour.featured && !ordered.some((orderedTour) => orderedTour.id === tour.id)
    );
    const fallback = cityTours.filter(
      (tour) =>
        !ordered.some((orderedTour) => orderedTour.id === tour.id) &&
        !featured.some((featuredTour) => featuredTour.id === tour.id)
    );

    return {
      city,
      displayName: display.displayName,
      coverage: display.coverage,
      featuredTours: [...ordered, ...featured, ...fallback].slice(0, 3).map((tour) => ({
        ...tour,
        shortDescription: tourDescriptions[tour.id] ?? {
          ES: tour.description,
          EN: "A private experience with direct coordination and transport included as described."
        }
      }))
    };
  });
}

function getLandingServices(): LandingService[] {
  return ["airport-transfer", "transfers", "hourly", "medical-tourism", "private-tours", "corporate"]
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service): service is (typeof services)[number] => Boolean(service))
    .map((service) => ({
      ...service,
      displayTitle: serviceTitles[service.id],
      shortDescription: serviceDescriptions[service.id]
    }));
}

export function LandingPage({ initialCity = "bogota" }: { initialCity?: string }) {
  const landingCities = getLandingCities();
  const safeInitialCity = landingCities.some((item) => item.city.slug === initialCity)
    ? initialCity
    : "bogota";

  return (
    <>
      <LandingHero
        bogotaImage={landingCities[0].city.heroImage ?? landingCities[0].city.image}
        medellinImage={landingCities[1].city.heroImage ?? landingCities[1].city.image}
      />
      <CityExplorer
        cities={landingCities}
        services={getLandingServices()}
        initialCity={safeInitialCity}
      />
    </>
  );
}
