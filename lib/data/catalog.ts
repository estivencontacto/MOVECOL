import type { City, Service, Tour, Vehicle } from "@/lib/domain/types";

const image = (id: string, params = "auto=format&fit=crop&w=1600&q=80") =>
  `https://images.unsplash.com/${id}?${params}`;

const unsplash = (id: string, params = "auto=format&fit=crop&w=1600&q=82") =>
  `https://images.unsplash.com/${id}?${params}`;

const localImage = (path: string) =>
  path
    .split("/")
    .map((part, index) => (index === 0 ? part : encodeURIComponent(part)))
    .join("/");

const gallery = (...paths: string[]) => paths.map(localImage);

export const serviceAssetsByCity: Record<string, Record<string, { hero?: string; card?: string; gallery?: string[] }>> = {
  bogota: {
    "airport-transfer": {
      hero: localImage("/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/HERO/turismo-en-bogota_-aeropuerto-el-dorado-mejor-conectado-america-latina.png"),
      card: localImage("/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/CARD/images (2).jpg"),
      gallery: gallery(
        "/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/GALERIA/Captura de pantalla 2026-07-01 093544.png",
        "/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/GALERIA/d7422453-92cd-4341-be80-18a6db3d69e5.jpeg"
      )
    },
    transfers: {
      hero: localImage("/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/HERO/turismo-en-bogota_-aeropuerto-el-dorado-mejor-conectado-america-latina.png"),
      card: localImage("/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/CARD/images (2).jpg")
    },
    hourly: {
      hero: localImage("/images/BOGOTA/SERVICIOS/TRANSPORTE POR HORAS/HERO/ChatGPT Image 1 jul 2026, 09_56_07 a.m.png")
    },
    "medical-tourism": {
      hero: localImage("/images/BOGOTA/SERVICIOS/TURISMO MEDICO/HERO/ChatGPT Image 1 jul 2026, 09_52_30 a.m.png")
    },
    "private-tours": {
      hero: localImage("/images/BOGOTA/SERVICIOS/TOURS PRIVADOS/HERO/ChatGPT Image 1 jul 2026, 09_41_18 a.m.png"),
      card: localImage("/images/BOGOTA/SERVICIOS/TOURS PRIVADOS/CARD/images (2).jpg")
    },
    corporate: {
      hero: localImage("/images/BOGOTA/SERVICIOS/TRANSPORTE CORPORATIVO/HERO/17a262cc-796c-424a-87aa-c6dd1300ae66.png")
    }
  },
  medellin: {
    "airport-transfer": {
      hero: localImage("/images/MEDELLIN/SERVICIOS/AEROPUERTO JOSE MARIA CORDOVA/HERO/conexion-b-aeropuerto-jose-maria-cordova-13-1.jpg"),
      card: localImage("/images/MEDELLIN/SERVICIOS/AEROPUERTO JOSE MARIA CORDOVA/CARD/images (3).jpg"),
      gallery: gallery("/images/MEDELLIN/SERVICIOS/AEROPUERTO JOSE MARIA CORDOVA/GALERIA/images (2).jpg")
    },
    transfers: {
      hero: localImage("/images/MEDELLIN/SERVICIOS/AEROPUERTO JOSE MARIA CORDOVA/HERO/conexion-b-aeropuerto-jose-maria-cordova-13-1.jpg"),
      card: localImage("/images/MEDELLIN/SERVICIOS/AEROPUERTO JOSE MARIA CORDOVA/CARD/images (3).jpg")
    },
    hourly: {
      hero: localImage("/images/MEDELLIN/SERVICIOS/SERVICIO POR HORAS/HERO/ChatGPT Image 1 jul 2026, 09_56_07 a.m.png")
    },
    "medical-tourism": {
      hero: localImage("/images/MEDELLIN/SERVICIOS/TURISMO MEDICO/HERO/ChatGPT Image 1 jul 2026, 09_53_03 a.m.png")
    },
    "private-tours": {
      hero: localImage("/images/MEDELLIN/SERVICIOS/TOURS PRIVADOS/HERO/ChatGPT Image 1 jul 2026, 10_00_41 a.m.png"),
      gallery: gallery(
        "/images/MEDELLIN/SERVICIOS/TOURS PRIVADOS/GALERIA/ChatGPT Image 1 jul 2026, 10_18_12 a.m.png",
        "/images/MEDELLIN/SERVICIOS/TOURS PRIVADOS/GALERIA/images (2).jpg",
        "/images/MEDELLIN/SERVICIOS/TOURS PRIVADOS/GALERIA/images (3).jpg"
      )
    },
    corporate: {
      hero: localImage("/images/MEDELLIN/SERVICIOS/TRANSPORTE CORPORATIVO/HERO/ChatGPT Image 1 jul 2026, 10_01_55 a.m.png")
    }
  }
};

const bogotaImages = {
  skyline: unsplash("photo-1534943441045-1009d7cb0bb9"),
  city: unsplash("photo-1720067392108-89b9485aa090"),
  monserrate: unsplash("photo-1562857557-4ff821b4aa8d"),
  street: unsplash("photo-1611148261486-4e315d904232"),
  airport: unsplash("photo-1436491865332-7a61a109cc05"),
  graffiti: "/images/bogota-graffiti-unsplash.jpg",
  gold: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=82",
  nature: unsplash("photo-1500530855697-b586d89ba3ee"),
  business: unsplash("photo-1549924231-f129b911e442")
};

export const cities: City[] = [
  {
    id: "medellin",
    name: "Medellin",
    slug: "medellin",
    heroTitle: "Transporte privado en Medellin",
    heroSubtitle: "Viaja en confianza. Sin afanes. Servicio personalizado.",
    headline: "Movilidad privada y experiencias personalizadas en Colombia.",
    description:
      "Traslados, tours culturales, turismo medico y logistica especializada con vehiculos confortables y conductores profesionales.",
    airport: "Aeropuerto Internacional Jose Maria Cordova",
    image: image("photo-1582647509711-c8aa8a8bda71"),
    heroImage: image("photo-1582647509711-c8aa8a8bda71"),
    serviceIds: ["airport-transfer", "transfers", "hourly", "medical-tourism", "private-tours", "corporate"],
    active: true
  },
  {
    id: "bogota",
    name: "Bogota",
    slug: "bogota",
    heroTitle: "Descubre Bogotá",
    heroSubtitle: "Nosotros te llevamos con comodidad, seguridad y confianza.",
    headline: "Transporte privado para aeropuerto, agenda corporativa, cultura, gastronomia y tours a Cundinamarca.",
    description:
      "Traslados desde El Dorado, transporte por horas, turismo medico, tours privados y movilidad corporativa con conductores profesionales.",
    airport: "Aeropuerto Internacional El Dorado",
    image: bogotaImages.skyline,
    heroImage: bogotaImages.skyline,
    heroGallery: [bogotaImages.airport, bogotaImages.monserrate, bogotaImages.business],
    serviceIds: ["airport-transfer", "transfers", "hourly", "medical-tourism", "private-tours", "corporate"],
    active: true
  }
];

export const services: Service[] = [
  {
    id: "airport-transfer",
    title: "Traslado Aeropuerto",
    slug: "traslado-aeropuerto",
    category: "airport-transfer",
    description:
      "Servicio personalizado desde y hacia los principales aeropuertos de Colombia, con recepcion directa, monitoreo de vuelo y puntualidad.",
    benefits: ["Monitoreo en tiempo real", "Asistencia con equipaje", "Vehiculo segun necesidad"],
    process: ["Comparte vuelo y pasajeros", "Asignamos vehiculo adecuado", "Te recibimos con asistencia"],
    faqs: [
      {
        question: "Que pasa si mi vuelo se retrasa?",
        answer: "Monitoreamos el vuelo y ajustamos la recogida sin friccion operativa."
      }
    ]
  },
  {
    id: "transfers",
    title: "Traslados dentro y fuera de la ciudad",
    slug: "traslados",
    category: "transfers",
    description:
      "Traslados privados punto a punto dentro de la ciudad o hacia destinos cercanos, liquidados por distancia, ciudad, horario y tipo de vehiculo.",
    benefits: ["Precio por kilometro", "Origen y destino personalizados", "Ideal para hoteles, clinicas, reuniones y viajes intermunicipales"],
    process: ["Indica origen y destino", "Calculamos kilometros de ruta", "Confirmamos tarifa y disponibilidad"],
    faqs: [
      {
        question: "Como se calcula el precio?",
        answer: "La tarifa base se calcula por distancia de ruta, minimo por ciudad y tipo de vehiculo."
      }
    ]
  },
  {
    id: "private-tours",
    title: "Tours Privados",
    slug: "tours-privados",
    category: "private-tour",
    description:
      "Experiencias culturales, naturales y gastronomicas con transporte privado, ritmo flexible y coordinacion directa.",
    benefits: ["Itinerario personalizado", "Tiempo libre coordinado", "Acompanamiento operativo"],
    process: ["Elige destino", "Definimos horario y vehiculo", "Disfruta el tour sin afanes"],
    faqs: [
      {
        question: "Puedo combinar varios lugares?",
        answer: "Si. Ajustamos el recorrido segun tiempo disponible, trafico y prioridades del viajero."
      }
    ]
  },
  {
    id: "corporate",
    title: "Transporte Corporativo",
    slug: "transporte-corporativo",
    category: "corporate",
    description:
      "Movilidad organizada para empresas, equipos, invitados, eventos, reuniones y rutas corporativas.",
    benefits: ["Coordinacion por agenda", "Vehiculos por capacidad", "Soporte para grupos"],
    process: ["Recibimos el itinerario", "Asignamos flota y conductores", "Reportamos el avance operativo"],
    faqs: [
      {
        question: "Pueden coordinar varios vehiculos?",
        answer: "Si. La plataforma esta preparada para flota, disponibilidad y reservas por grupo."
      }
    ]
  },
  {
    id: "hourly",
    title: "Servicio Privado por Horas",
    slug: "servicio-por-horas",
    category: "hourly",
    description:
      "Movilidad personalizada con conductor profesional para recorridos flexibles dentro y fuera de la ciudad.",
    benefits: ["Disponibilidad por horas", "Recorridos personalizados", "Coordinacion directa"],
    process: ["Indica horas estimadas", "Define zonas y paradas", "Ajustamos el recorrido en ruta"],
    faqs: [
      {
        question: "Hay limite de paradas?",
        answer: "No hay limite fijo; se coordina segun tiempo contratado y condiciones de ruta."
      }
    ]
  },
  {
    id: "medical-tourism",
    title: "Turismo Medico",
    slug: "turismo-medico",
    category: "medical-tourism",
    description:
      "Logistica privada y organizada para pacientes que viajan a Colombia por tratamientos, cirugias o controles medicos.",
    benefits: ["Traslados clinica, hotel y aeropuerto", "Servicio discreto", "Convenios con hoteles"],
    process: ["Comparte agenda medica", "Asignamos vehiculo confortable", "Coordinamos cada traslado"],
    faqs: [
      {
        question: "Pueden coordinar varias citas?",
        answer: "Si, el equipo organiza rutas con tiempos de espera y ventanas entre citas."
      }
    ]
  },
  {
    id: "events",
    title: "Eventos",
    slug: "eventos",
    category: "events",
    description:
      "Logistica de transporte para bodas, congresos, lanzamientos y eventos privados.",
    benefits: ["Flota coordinada", "Rutas por grupos", "Control de disponibilidad"],
    process: ["Dimensionamos asistentes", "Creamos plan logistico", "Operamos el calendario"],
    faqs: [
      {
        question: "Pueden operar buses y vans?",
        answer: "Si, el inventario contempla sedan, SUV, van y bus segun disponibilidad."
      }
    ]
  }
];

export const tours: Tour[] = [
  {
    id: "med-city-tour",
    citySlug: "medellin",
    name: "City Tour",
    slug: "city-tour",
    description: "Recorrido privado por los puntos esenciales de Medellin con ritmo flexible.",
    includes: ["Conductor privado", "Recogida en hotel", "Paradas fotograficas"],
    excludes: ["Alimentacion", "Entradas no especificadas"],
    duration: "4 horas",
    schedules: ["08:00", "10:00", "14:00"],
    basePrice: 145000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/HERO/images (2).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/CARD/images (2).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/GALERIA/F8Kbg-IWUAAiemq.jpg",
      "/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/GALERIA/images (2).jpg",
      "/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/GALERIA/images (5).jpg"
    ),
    featured: true
  },
  {
    id: "med-comuna-13",
    citySlug: "medellin",
    name: "Comuna 13",
    slug: "comuna-13",
    description: "Arte urbano, historia local y miradores en una experiencia privada guiada.",
    includes: ["Transporte privado", "Guia local", "Seguro de asistencia"],
    excludes: ["Almuerzo", "Compras personales"],
    duration: "3 horas",
    schedules: ["09:00", "13:00", "15:30"],
    basePrice: 135000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/COMUNA 13/HERO/e8.jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/COMUNA 13/CARD/images (2).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/COMUNA 13/GALERIA/caption.jpg",
      "/images/MEDELLIN/TOURS/COMUNA 13/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/COMUNA 13/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/COMUNA 13/GALERIA/ven-y-dejate-contar-la.jpg"
    ),
    featured: true
  },
  {
    id: "med-guatape",
    citySlug: "medellin",
    name: "Guatape",
    slug: "guatape",
    description: "Dia completo hacia la Piedra del Penol, zocalos y embalse de Guatape.",
    includes: ["Transporte privado", "Peajes", "Agua a bordo"],
    excludes: ["Entrada a la piedra", "Alimentacion"],
    duration: "10 horas",
    schedules: ["07:00", "08:00"],
    basePrice: 225000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/GUATAPE/HERO/b5.jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/GUATAPE/CARD/images (2).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/GUATAPE/GALERIA/77.jpg",
      "/images/MEDELLIN/TOURS/GUATAPE/GALERIA/bd.jpg",
      "/images/MEDELLIN/TOURS/GUATAPE/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/GUATAPE/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/GUATAPE/GALERIA/images (5).jpg"
    ),
    featured: true
  },
  {
    id: "med-vuelta-oriente",
    citySlug: "medellin",
    name: "Vuelta al Oriente Antioqueno",
    slug: "vuelta-al-oriente",
    description:
      "Recorrido privado por pueblos tradicionales del Oriente Antioqueno, combinando naturaleza, cultura y gastronomia.",
    includes: ["El Retiro", "La Ceja", "San Antonio de Pereira", "Alto de Tequendamita", "Recorrido gastronomico"],
    excludes: ["Alimentacion", "Entradas no especificadas"],
    duration: "8 horas",
    schedules: ["08:00"],
    basePrice: 550000,
    pricingMode: "global",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/VUELTA AL ORIENTE ANTIOQUENO/HERO/images (2).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/VUELTA AL ORIENTE ANTIOQUENO/CARD/images (3).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/VUELTA AL ORIENTE ANTIOQUENO/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/VUELTA AL ORIENTE ANTIOQUENO/GALERIA/images (5).jpg",
      "/images/MEDELLIN/TOURS/VUELTA AL ORIENTE ANTIOQUENO/GALERIA/images (6).jpg"
    ),
    featured: true
  },
  {
    id: "med-coffee-tour",
    citySlug: "medellin",
    name: "Coffee Tour",
    slug: "coffee-tour",
    description: "Experiencia cafetera privada con traslado desde Medellin.",
    includes: ["Transporte", "Experiencia cafetera", "Degustacion"],
    excludes: ["Almuerzo"],
    duration: "6 horas",
    schedules: ["08:00"],
    basePrice: 190000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/COFFEE TOUR/HERO/images (2).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/COFFEE TOUR/CARD/images (4).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/COFFEE TOUR/GALERIA/46.jpg",
      "/images/MEDELLIN/TOURS/COFFEE TOUR/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/COFFEE TOUR/GALERIA/images (5).jpg",
      "/images/MEDELLIN/TOURS/COFFEE TOUR/GALERIA/images (6).jpg"
    )
  },
  {
    id: "med-hacienda-napoles",
    citySlug: "medellin",
    name: "Hacienda Napoles",
    slug: "hacienda-napoles",
    description: "Traslado privado de dia completo hacia el parque tematico.",
    includes: ["Transporte", "Peajes", "Espera coordinada"],
    excludes: ["Entradas", "Alimentacion"],
    duration: "14 horas",
    schedules: ["05:30"],
    basePrice: 1350000,
    pricingMode: "global",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/HACIENDA NAPOLES/HERO/c9.jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/HACIENDA NAPOLES/CARD/0f.jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/5d019400aa462.jpeg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/images (2).jpg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/SANTUARIO-FAUNA-1024x682.jpg"
    )
  },
  {
    id: "med-parapente",
    citySlug: "medellin",
    name: "Parapente",
    slug: "parapente",
    description:
      "Experiencia panoramica para volar sobre Medellin y el Valle de Aburra con operador certificado.",
    includes: ["Transporte", "Coordinacion logistica", "Vuelo panoramico", "Operador certificado"],
    excludes: ["Fotos o videos del operador", "Extras no especificados"],
    duration: "4 horas",
    schedules: ["08:00", "11:00", "14:00"],
    basePrice: 350000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/PARAPENTE/HERO/eb.jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/PARAPENTE/CARD/images (3).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/PARAPENTE/GALERIA/Imagen-de-WhatsApp-2025-06-29-a-las-19.01.09_b0d04b01.jpg",
      "/images/MEDELLIN/TOURS/PARAPENTE/GALERIA/images (2).jpg"
    )
  },
  {
    id: "med-compras",
    citySlug: "medellin",
    name: "Tour de Compras",
    slug: "tour-de-compras",
    description:
      "Recorrido guiado por el corazon comercial de Medellin para moda, calzado y productos locales.",
    includes: ["El Hueco", "Moda y calzado", "Precios directos de fabrica", "Acompanamiento"],
    excludes: ["Compras personales", "Alimentacion"],
    duration: "5 horas",
    schedules: ["09:00", "13:00"],
    basePrice: 195000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/TOUR DE COMPRAS/HERO/images (4).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/TOUR DE COMPRAS/CARD/SIDE-HUECO.png"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/TOUR DE COMPRAS/GALERIA/images (2).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE COMPRAS/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE COMPRAS/GALERIA/images (5).jpg"
    )
  },
  {
    id: "med-pablo-escobar",
    citySlug: "medellin",
    name: "Pablo Escobar Tour",
    slug: "pablo-escobar-tour",
    description:
      "Recorrido historico privado por lugares representativos para entender el impacto urbano y social de esa epoca.",
    includes: ["Transporte privado con guia experto", "Parque de la Inflexion", "La Catedral", "Cementerio", "Contexto historico"],
    excludes: ["Entradas a museos historicos opcionales", "Alimentacion"],
    duration: "5 horas",
    schedules: ["08:30", "14:00"],
    basePrice: 195000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/PABLO ESCOBAR/HERO/images (2).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/PABLO ESCOBAR/CARD/images (3).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/PABLO ESCOBAR/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/PABLO ESCOBAR/GALERIA/images (5).jpg"
    )
  },
  {
    id: "med-miradores",
    citySlug: "medellin",
    name: "Miradores",
    slug: "miradores",
    description: "Ruta nocturna o al atardecer por miradores y zonas gastronomicas.",
    includes: ["Transporte privado", "Paradas flexibles"],
    excludes: ["Consumos"],
    duration: "4 horas",
    schedules: ["16:00", "18:00"],
    basePrice: 135000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/TOUR DE MIRADORES/HERO/images (5).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/TOUR DE MIRADORES/CARD/images (4).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/52.jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/ab.jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (2).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (6).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (7).jpg"
    )
  },
  {
    id: "med-santa-fe",
    citySlug: "medellin",
    name: "Santa Fe de Antioquia",
    slug: "santa-fe-de-antioquia",
    description: "Pueblo patrimonio, arquitectura colonial y Puente de Occidente.",
    includes: ["Transporte privado", "Peajes", "Agua a bordo"],
    excludes: ["Alimentacion", "Guia especializado"],
    duration: "8 horas",
    schedules: ["08:00"],
    basePrice: 215000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/HERO/images (2).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/CARD/cb.jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/GALERIA/bd.jpg",
      "/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/GALERIA/Santa-Fe-De-Antioquia-medellin.jpg"
    )
  },
  {
    id: "bog-city-tour",
    citySlug: "bogota",
    name: "City Tour Bogota",
    slug: "city-tour",
    description:
      "City Tour privado en Bogota para descubrir Plaza de Bolivar, La Candelaria, Museo del Oro, Chorro de Quevedo y el Eje Ambiental con comodidad, seguridad y tiempos flexibles.",
    includes: ["Plaza de Bolivar", "La Candelaria", "Museo del Oro", "Chorro de Quevedo", "Eje Ambiental", "Transporte privado"],
    excludes: ["Entradas", "Alimentacion"],
    duration: "5 horas",
    schedules: ["08:00", "13:00"],
    basePrice: 480000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/HERO/ChatGPT Image 1 jul 2026, 08_56_32 a.m.png"),
    cardImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/CARD/33860894418_cbc353dd66_b.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/53189280960_f52f80db0e_z.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/el-museo-de-bogota-_0.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/museo-del-oro-mo-salas-exposicion-permanente-2022-640x400.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/portada.foto_.hanz_.rippe_.idpc_.plaza_.de_.bolivar_0.jpg"
    ),
    recommendations: ["Llevar chaqueta liviana", "Usar zapatos comodos", "Reservar con tiempo si deseas ingresar al Museo del Oro"],
    keywords: ["city tour Bogota", "tour privado Bogota", "La Candelaria", "Museo del Oro"],
    featured: true
  },
  {
    id: "bog-hacienda-napoles",
    citySlug: "bogota",
    name: "Hacienda Napoles",
    slug: "hacienda-napoles",
    description: "Traslado privado de dia completo hacia Hacienda Napoles con coordinacion de ruta, tiempos de espera y regreso a Bogota.",
    includes: ["Transporte", "Peajes", "Espera coordinada"],
    excludes: ["Entradas", "Alimentacion"],
    duration: "Dia completo",
    schedules: ["05:00", "06:00"],
    basePrice: 1350000,
    pricingMode: "global",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/HACIENDA NAPOLES/HERO/c9.jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/HACIENDA NAPOLES/CARD/0f.jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/5d019400aa462.jpeg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/images (2).jpg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/images (4).jpg",
      "/images/MEDELLIN/TOURS/HACIENDA NAPOLES/GALERIA/SANTUARIO-FAUNA-1024x682.jpg"
    ),
    recommendations: ["Salida temprano", "Confirmar entradas con anticipacion"],
    keywords: ["Hacienda Napoles desde Bogota", "tour privado Hacienda Napoles"]
  },
  {
    id: "bog-miradores",
    citySlug: "bogota",
    name: "Miradores",
    slug: "miradores",
    description: "Ruta privada por miradores urbanos y zonas gastronomicas para disfrutar Bogota al atardecer o en la noche.",
    includes: ["Transporte privado", "Paradas flexibles"],
    excludes: ["Consumos"],
    duration: "4 horas",
    schedules: ["16:00", "18:00", "20:00"],
    basePrice: 135000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/TOUR DE MIRADORES/HERO/images (5).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/TOUR DE MIRADORES/CARD/images (4).jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/52.jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/ab.jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (2).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (6).jpg",
      "/images/MEDELLIN/TOURS/TOUR DE MIRADORES/GALERIA/images (7).jpg"
    ),
    recommendations: ["Llevar abrigo", "Ideal para grupos y parejas"],
    keywords: ["miradores Bogota", "tour nocturno Bogota"]
  },
  {
    id: "bog-monserrate",
    citySlug: "bogota",
    name: "Monserrate",
    slug: "monserrate",
    description:
      "El icono turistico mas representativo de Bogota, con una vista panoramica de toda la ciudad desde mas de 3.100 metros de altura.",
    includes: ["Transporte privado", "Tiempo libre", "Espera del conductor", "Opcional teleferico o funicular"],
    excludes: ["Ticket funicular/teleferico", "Alimentacion"],
    duration: "3 horas",
    schedules: ["08:00", "15:00"],
    basePrice: 90000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/MONSERRATE/HERO/1000_F_580460987_O8r0FPCDN8J0U0CXOnUbguQt4ahTkJDw.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/MONSERRATE/CARD/1000_F_784581854_gHHWOJXoWSx0U9EcGRoXMeHxZgyEu3Ee.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/MONSERRATE/GALERIA/1000_F_166395926_R7g0golcxzPdeHM36Z05MYMba5MEcobu.jpg",
      "/images/BOGOTA/TOURS/MONSERRATE/GALERIA/1000_F_529507674_UGuwbJ1aDybP9RLwGNF9wmXlRU7PSHpN.jpg",
      "/images/BOGOTA/TOURS/MONSERRATE/GALERIA/1000_F_567813429_Vu4QHkQTrbCbKPfkoP6ypjYDWdGZhZkW.jpg"
    ),
    recommendations: ["Llevar abrigo", "Evitar subir si tienes sintomas de mal de altura", "Confirmar operacion de teleferico o funicular"],
    keywords: ["Monserrate", "tour Monserrate Bogota", "teleferico Monserrate"],
    featured: true
  },
  {
    id: "bog-la-candelaria",
    citySlug: "bogota",
    name: "La Candelaria",
    slug: "la-candelaria",
    description:
      "Experiencia cultural e historica por el centro fundacional de Bogota, entre arquitectura colonial, museos, arte urbano y gastronomia local.",
    includes: ["Transporte privado", "Arquitectura colonial", "Museos", "Arte urbano", "Zonas gastronomicas"],
    excludes: ["Entradas a museos", "Alimentacion", "Guia especializado si no se solicita"],
    duration: "4 horas",
    schedules: ["09:00", "14:00"],
    basePrice: 85000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/LA CANDELARIA/HERO/michael-baron-YQSXw2YVqyU-unsplash.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/LA CANDELARIA/CARD/aniket-das-G0pfvtnmPvA-unsplash.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/LA CANDELARIA/GALERIA/disfruta-mejores-planes-candelaria.jpg",
      "/images/BOGOTA/TOURS/LA CANDELARIA/GALERIA/images (1).jpg"
    ),
    recommendations: ["Usar zapatos comodos", "Llevar efectivo para cafes o entradas", "Mantener objetos personales seguros"],
    keywords: ["La Candelaria Bogota", "tour cultural Bogota", "arte urbano Bogota"]
  },
  {
    id: "bog-plaza-bolivar",
    citySlug: "bogota",
    name: "Plaza de Bolivar",
    slug: "plaza-de-bolivar",
    description:
      "Recorrido historico por el corazon civico de Colombia, destacando la Catedral Primada, el Capitolio Nacional y el Palacio de Justicia.",
    includes: ["Transporte privado", "Tiempo libre en la plaza", "Paradas fotograficas", "Contexto historico"],
    excludes: ["Ingresos a edificios oficiales", "Alimentacion"],
    duration: "3 horas",
    schedules: ["09:00", "14:00"],
    basePrice: 80000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/HERO/portada.foto_.hanz_.rippe_.idpc_.plaza_.de_.bolivar_0.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/CARD/caption.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/GALERIA/images (2).jpg",
      "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/GALERIA/istockphoto-1944446888-612x612.jpg",
      "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/GALERIA/istockphoto-2160417598-612x612.jpg"
    ),
    recommendations: ["Ideal combinar con La Candelaria", "Llevar documento de identidad", "Revisar restricciones por eventos publicos"],
    keywords: ["Plaza de Bolivar", "Catedral Primada", "Capitolio Nacional"]
  },
  {
    id: "bog-museo-oro",
    citySlug: "bogota",
    name: "Museo del Oro",
    slug: "museo-del-oro",
    description:
      "Experiencia cultural para conocer colecciones prehispanicas, piezas de orfebreria y relatos que conectan el patrimonio indigena con la historia de Colombia.",
    includes: ["Transporte privado", "Espera coordinada", "Tiempo libre en el museo", "Recomendaciones de recorrido"],
    excludes: ["Entrada al museo", "Guia interno", "Alimentacion"],
    duration: "3 horas",
    schedules: ["10:00", "14:00"],
    basePrice: 90000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/MUSEO DEL ORO/HERO/images (1).jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/MUSEO DEL ORO/CARD/images (2).jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/c6.jpg",
      "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/images (1).jpg",
      "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/images (3).jpg",
      "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/museo-del-oro-mo-salas-exposicion-permanente-2022-640x400.jpg"
    ),
    recommendations: ["Verificar dias de apertura", "Reservar tiempo para la sala de ofrendas", "Combinar con Chorro de Quevedo"],
    keywords: ["Museo del Oro Bogota", "colecciones prehispanicas", "tour cultural Bogota"]
  },
  {
    id: "bog-zona-t",
    citySlug: "bogota",
    name: "Zona T",
    slug: "zona-t",
    description:
      "Salida privada hacia una de las zonas mas activas de Bogota para vida nocturna, restaurantes, compras, cocteleria y gastronomia.",
    includes: ["Transporte privado", "Espera del conductor", "Recogida segura", "Recomendaciones por tipo de plan"],
    excludes: ["Consumos", "Reservas en restaurantes", "Entradas a bares o clubes"],
    duration: "4 horas",
    schedules: ["17:00", "19:00", "21:00"],
    basePrice: 85000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/ZONA T/HERO/zona-rosa.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/ZONA T/CARD/caption.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/ZONA T/GALERIA/c4.jpg",
      "/images/BOGOTA/TOURS/ZONA T/GALERIA/caption.jpg",
      "/images/BOGOTA/TOURS/ZONA T/GALERIA/images (2).jpg"
    ),
    recommendations: ["Reservar restaurante con anticipacion", "Llevar documento", "Confirmar hora de regreso"],
    keywords: ["Zona T Bogota", "vida nocturna Bogota", "restaurantes Bogota"]
  },
  {
    id: "bog-guatavita",
    citySlug: "bogota",
    name: "Laguna de Guatavita",
    slug: "guatavita",
    description:
      "Tour privado de naturaleza hacia la Laguna de Guatavita, escenario de la leyenda de El Dorado y uno de los paisajes mas especiales de Cundinamarca.",
    includes: ["Transporte privado", "Peajes", "Tiempo estimado de caminata", "Espera del conductor", "Paradas fotograficas"],
    excludes: ["Entrada a la laguna", "Alimentacion", "Guia local obligatorio si aplica"],
    duration: "8 horas",
    schedules: ["07:00"],
    basePrice: 225000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/HERO/ricardo-cifuentes-t-4xjoKWv3Vhs-unsplash.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/CARD/david-hertle-1D0IXPsn3BQ-unsplash.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/GALERIA/images (1).jpg",
      "/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/GALERIA/images (2).jpg",
      "/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/GALERIA/photo-1707073687016-7e500a79b5c3.avif"
    ),
    recommendations: ["Llevar chaqueta impermeable", "Usar zapatos de caminata", "Considerar altura y clima frio"],
    keywords: ["Laguna de Guatavita", "El Dorado", "tour Guatavita desde Bogota"]
  },
  {
    id: "bog-catedral-sal",
    citySlug: "bogota",
    name: "Catedral de Sal de Zipaquira",
    slug: "catedral-de-sal",
    description:
      "Experiencia privada hacia la Catedral de Sal de Zipaquira, una obra subterranea que combina historia, arquitectura, espiritualidad e ingenieria.",
    includes: ["Transporte privado", "Peajes", "Espera del conductor", "Tiempo libre en el parque"],
    excludes: ["Entradas", "Almuerzo"],
    duration: "7 horas",
    schedules: ["08:00"],
    basePrice: 280000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/CATEDRAL DE SAL ZIPAQUIRA/HERO/willian-reis-TRo6jRvNMY0-unsplash.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/CATEDRAL DE SAL ZIPAQUIRA/CARD/images (1).jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/CATEDRAL DE SAL ZIPAQUIRA/GALERIA/542403bc3a4ad4d9a46954d907573e396757fdb8_2_333x500.jpeg",
      "/images/BOGOTA/TOURS/CATEDRAL DE SAL ZIPAQUIRA/GALERIA/cf.jpg",
      "/images/BOGOTA/TOURS/CATEDRAL DE SAL ZIPAQUIRA/GALERIA/images (1).jpg",
      "/images/BOGOTA/TOURS/CATEDRAL DE SAL ZIPAQUIRA/GALERIA/images (2).jpg"
    ),
    recommendations: ["Comprar entradas con anticipacion", "Llevar abrigo", "Combinar con centro historico de Zipaquira"],
    keywords: ["Catedral de Sal de Zipaquira", "tour Zipaquira", "experiencia subterranea"]
  }
];

export const vehicles: Vehicle[] = [
  {
    id: "sedan-premium",
    type: "sedan",
    name: "Sedan Premium",
    capacity: 3,
    luggage: 2,
    image: localImage("/images/GLOBAL/VEHICULOS/SEDAN EJECUTIVO/87-sam-2546-still-virtus-23-cl-tsi-basico-5-8-frente-b4b4-cristal-estu-adv-sam.png"),
    description: "Ideal para aeropuerto, viajeros de negocio y parejas.",
    available: true
  },
  {
    id: "suv-premium",
    type: "suv",
    name: "SUV Premium",
    capacity: 5,
    luggage: 4,
    image: localImage("/images/GLOBAL/VEHICULOS/SUV PREMIUM/images (2).jpg"),
    description: "Mayor confort para familias, clientes VIP y equipaje.",
    available: true
  },
  {
    id: "van-private",
    type: "van",
    name: "Van Privada",
    capacity: 10,
    luggage: 8,
    image: localImage("/images/GLOBAL/VEHICULOS/VAN PRIVADA/Hyundai_iLoad_2010_1000_0001.jpg"),
    description: "Perfecta para grupos, tours y eventos.",
    available: true
  },
  {
    id: "bus-group",
    type: "bus",
    name: "Bus Empresarial",
    capacity: 35,
    luggage: 25,
    image: localImage("/images/GLOBAL/VEHICULOS/BUS EJECUTIVO/images (2).jpg"),
    description: "Transporte coordinado para eventos y grupos grandes.",
    available: true
  }
];

export const reviews = [
  {
    name: "Laura M.",
    context: "Traslado aeropuerto en Colombia",
    quote: "Puntuales, discretos y con una atencion impecable desde la reserva."
  },
  {
    name: "Andres R.",
    context: "Agenda corporativa en Bogota",
    quote: "El conductor conocia la ciudad y el equipo mantuvo todo coordinado."
  },
  {
    name: "Camila S.",
    context: "Tour privado a Guatape",
    quote: "El vehiculo estaba perfecto y el itinerario se sintio hecho a nuestra medida."
  }
];

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function getTour(citySlug: string, tourSlug: string) {
  return tours.find((tour) => tour.citySlug === citySlug && tour.slug === tourSlug);
}

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getToursByCity(citySlug: string) {
  return tours.filter((tour) => tour.citySlug === citySlug);
}

export function getServicesByCity(citySlug: string) {
  const city = getCity(citySlug);
  const serviceIds = city?.serviceIds ?? services.map((service) => service.id);
  return serviceIds
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service): service is Service => Boolean(service));
}

export function getRelatedTours(citySlug: string, tourId: string, limit = 3) {
  return tours.filter((tour) => tour.citySlug === citySlug && tour.id !== tourId).slice(0, limit);
}
