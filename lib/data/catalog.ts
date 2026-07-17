import type { City, Service, Tour, Vehicle } from "@/lib/domain/types";

export const localImage = (path: string) =>
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

export const cities: City[] = [
  {
    id: "medellin",
    name: "Medellín",
    slug: "medellin",
    heroTitle: "Transporte privado en Medellin",
    heroSubtitle: "Viaja en confianza. Sin afanes. Servicio personalizado.",
    headline: "Movilidad privada y experiencias personalizadas en Colombia.",
    description:
      "Traslados, tours culturales, turismo medico y logistica especializada con vehiculos confortables y conductores profesionales.",
    airport: "Aeropuerto Internacional José María Córdova",
    image: localImage("/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/HERO/images (2).jpg"),
    heroImage: localImage("/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/HERO/images (2).jpg"),
    videoUrl: "https://www.youtube.com/watch?v=7589HBckaoo",
    serviceIds: ["airport-transfer", "transfers", "hourly", "medical-tourism", "private-tours", "corporate", "events"],
    mapCenter: { lat: 6.2442, lng: -75.5812 },
    altitudeMeters: 1495,
    timeZone: "America/Bogota",
    active: true
  },
  {
    id: "bogota",
    name: "Bogotá",
    slug: "bogota",
    heroTitle: "Descubre Bogotá",
    heroSubtitle: "Nosotros te llevamos con comodidad, seguridad y confianza.",
    headline: "Transporte privado para aeropuerto, agenda corporativa, cultura, gastronomia y tours a Cundinamarca.",
    description:
      "Traslados desde El Dorado, transporte por horas, turismo medico, tours privados y movilidad corporativa con conductores profesionales.",
    airport: "Aeropuerto Internacional El Dorado",
    image: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg"),
    heroImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg"),
    heroGallery: [
      localImage("/images/BOGOTA/SERVICIOS/AEROPUERTO EL DORADO/HERO/turismo-en-bogota_-aeropuerto-el-dorado-mejor-conectado-america-latina.png"),
      localImage("/images/BOGOTA/TOURS/MONSERRATE/HERO/1000_F_580460987_O8r0FPCDN8J0U0CXOnUbguQt4ahTkJDw.jpg"),
      localImage("/images/BOGOTA/SERVICIOS/TRANSPORTE CORPORATIVO/HERO/17a262cc-796c-424a-87aa-c6dd1300ae66.png")
    ],
    videoUrl: "https://www.youtube.com/shorts/FaOBWw-TzMo",
    serviceIds: ["airport-transfer", "transfers", "hourly", "medical-tourism", "private-tours", "corporate", "events"],
    mapCenter: { lat: 4.711, lng: -74.0721 },
    altitudeMeters: 2640,
    timeZone: "America/Bogota",
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
      "Traslados privados punto a punto dentro de la ciudad o hacia destinos cercanos, con una tarifa base de COP 4.500 por kilometro de ruta.",
    benefits: ["Tarifa base de COP 4.500 por kilometro", "Origen y destino personalizados", "Ideal para hoteles, clinicas, reuniones y viajes intermunicipales"],
    process: ["Indica origen y destino", "Calculamos kilometros de ruta", "Confirmamos tarifa y disponibilidad"],
    faqs: [
      {
        question: "Como se calcula el precio?",
        answer: "La tarifa base corresponde a la distancia real de la ruta multiplicada por COP 4.500. Los recargos por tipo de vehiculo y pasarela de pago se muestran por separado antes de reservar."
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

const haciendaNapolesDescription =
  "Tour de dia completo a Hacienda Napoles. Puedes elegir Pasaporte Basico Adulto, enfocado en fauna, flora, museos, animales y recorridos sin zona acuatica, o Pasaporte Safari, que ademas incluye Parque Acuatico DINOS y Rio Salvaje. El Pasaporte Safari no incluye Mundo de Pangea y ambos pasaportes son validos por un solo dia.";

const haciendaNapolesIncludes = [
  "Transporte privado con recogida en Airbnb/hotel",
  "Desayuno",
  "Ingreso con el pasaporte elegido"
];

const haciendaNapolesExcludes = [
  "Gastos no especificados",
  "Gastos en carretera",
  "Pasaporte de ingreso a la Hacienda Napoles"
];

export const tours: Tour[] = [
  {
    id: "med-city-tour",
    citySlug: "medellin",
    name: "City Tour",
    slug: "city-tour",
    description: "Recorrido privado por los puntos esenciales de Medellin con ritmo flexible.",
    includes: [
      "Comuna 13",
      "Metro Cable",
      "Pueblito Paisa",
      "Plaza Botero",
      "Parques emblematicos",
      "Transporte privado ida y vuelta al hotel/airbnb"
    ],
    excludes: ["Alimentacion", "Entradas no especificadas"],
    duration: "4 horas",
    schedules: ["08:00", "10:00", "14:00"],
    basePrice: 180000,
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
    videoUrl: "https://www.youtube.com/watch?v=HogDmIHgc5s",
    featured: true
  },
  {
    id: "med-comuna-13",
    citySlug: "medellin",
    name: "Comuna 13",
    slug: "comuna-13",
    description: "Arte urbano, historia local y miradores en una experiencia privada guiada.",
    includes: [
      "Recorrido por graffitis y arte urbano",
      "Paradas para fotos",
      "Compra de souvenirs",
      "Entrada a miradores",
      "Escaleras electricas",
      "Historia y transformacion social",
      "Guia/acompanamiento",
      "Degustacion local"
    ],
    excludes: ["Almuerzo", "Compras personales"],
    duration: "3 horas",
    schedules: ["09:00", "13:00", "15:30"],
    basePrice: 120000,
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
    videoUrl: "https://www.youtube.com/watch?v=yoYJBUTfs6g",
    featured: true
  },
  {
    id: "med-guatape",
    citySlug: "medellin",
    name: "Guatape",
    slug: "guatape",
    description:
      "Dia completo hacia Guatape con paradas en Alto del Chocho, granja interactiva, Casa al reves, Replica del Viejo Penol, Piedra del Penol y el pueblo de Guatape. Incluye descuentos con restaurantes y tiendas de souvenirs aliados, y permite sumar actividades opcionales como donas, jetski o tour en lancha por la represa. Es uno de los tours mas completos y recomendados: practicamente haces de todo en un solo dia.",
    includes: [
      "Parada en el Alto del Chocho",
      "Granja interactiva",
      "Casa al reves",
      "Replica del Viejo Penol",
      "Piedra del Penol (subida opcional)",
      "Visita al pueblo de Guatape",
      "Caminata guiada al malecon",
      "Calle de las sombrillas",
      "Museo del chocolate",
      "Plaza central",
      "Calle de los zocalos"
    ],
    excludes: ["Entrada a la piedra", "Alimentacion", "Subida a la Piedra del Penol"],
    duration: "10 horas",
    schedules: ["07:00", "08:00"],
    basePrice: 260000,
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
    videoUrl: "https://www.youtube.com/watch?v=u6HtNoqqc9Y",
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
    videoUrl: "https://www.youtube.com/watch?v=ezOSpRIJ-ls",
    featured: true
  },
  {
    id: "med-coffee-tour",
    citySlug: "medellin",
    name: "Coffee Tour",
    slug: "coffee-tour",
    description:
      "Experiencia cafetera autentica: no es un show, es la vida real de una finca cafetera local con caficultores. Aprendes el proceso del cafe, conectas con historias reales y apoyas turismo comunitario sostenible.",
    includes: [
      "Tour guiado por caficultores (90 min)",
      "Cata premium de cafe especial",
      "Transporte en chiva tipica desde Parque Arvi",
      "Certificado oficial como Cafetero"
    ],
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
    ),
    videoUrl: "https://www.youtube.com/watch?v=-pal5tzL-lw"
  },
  {
    id: "med-hacienda-napoles",
    citySlug: "medellin",
    name: "Hacienda Napoles",
    slug: "hacienda-napoles",
    description: haciendaNapolesDescription,
    includes: haciendaNapolesIncludes,
    excludes: haciendaNapolesExcludes,
    duration: "14 horas",
    schedules: ["05:30"],
    basePrice: 500000,
    pricingMode: "per-person",
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
    videoUrl: "https://www.youtube.com/watch?v=wkFDgtAvhCw",
    recommendations: ["Estacion Estadio 3:45am", "Av. Oriental 4:10am", "Parque del Poblado 4:30am"]
  },
  {
    id: "med-parapente",
    citySlug: "medellin",
    name: "Parapente",
    slug: "parapente",
    description:
      "Actividad operada por una empresa externa en San Felix, a 40 minutos de Medellin. El vuelo dura aproximadamente 15 minutos y depende 100% del clima.",
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
    ),
    videoUrl: "https://www.youtube.com/watch?v=aFCv_VJii7o",
    recommendations: [
      "No aptas personas embarazadas",
      "Personas con condiciones cardiacas requieren certificado medico",
      "Edad minima 5 anos",
      "Peso maximo 130kg",
      "Franja recomendada 9:30am a 12:30pm",
      "Fotos y videos disponibles como servicio adicional de la empresa"
    ]
  },
  {
    id: "med-compras",
    citySlug: "medellin",
    name: "Tour de Compras",
    slug: "tour-de-compras",
    description:
      "Recorrido guiado por el corazon comercial de Medellin para comprar moda y productos locales a precios directos de fabrica.",
    includes: ["El Hueco", "Moda y calzado", "Precios directos de fabrica", "Acompanamiento"],
    excludes: ["Compras personales", "Alimentacion"],
    duration: "4 horas aproximadamente",
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
    ),
    videoUrl: "https://www.youtube.com/watch?v=aGu0LgirrwA"
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
    includes: ["Mirador El Picacho", "Mirador El Cielo", "La Octava Maravilla", "Paradas panoramicas"],
    excludes: ["Consumos"],
    duration: "4 horas",
    schedules: ["16:00", "18:00"],
    basePrice: 180000,
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
    videoUrl: "https://www.youtube.com/shorts/la2MaGHby3I"
  },
  {
    id: "med-santa-fe",
    citySlug: "medellin",
    name: "Santa Fe de Antioquia",
    slug: "santa-fe-de-antioquia",
    description: "Pueblo patrimonio, arquitectura colonial y Puente de Occidente.",
    includes: [
      "Transporte privado",
      "Museo Juan del Corral",
      "Iglesia y Parque Santa Barbara",
      "Catedral Basilica de la Inmaculada Concepcion",
      "Parque Principal",
      "Iglesia y Parque Nuestra Senora de Chiquinquira",
      "Visita a talleres de filigrana",
      "Puente de Occidente",
      "Guia profesional"
    ],
    excludes: ["Alimentacion", "Guia especializado"],
    duration: "8 horas",
    schedules: ["08:00"],
    basePrice: 400000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/HERO/images (2).jpg"),
    cardImage: localImage("/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/CARD/cb.jpg"),
    gallery: gallery(
      "/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/GALERIA/bd.jpg",
      "/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/GALERIA/images (3).jpg",
      "/images/MEDELLIN/TOURS/SANTA FE DE ANTIOQUIA/GALERIA/Santa-Fe-De-Antioquia-medellin.jpg"
    ),
    videoUrl: "https://www.youtube.com/watch?v=5t_uoaTkllk"
  },
  {
    id: "bog-city-tour",
    citySlug: "bogota",
    name: "City Tour Bogota",
    slug: "city-tour",
    description:
      "City Tour privado en Bogota para descubrir Plaza de Bolivar, La Candelaria, Museo del Oro, Chorro de Quevedo y el Eje Ambiental con comodidad, seguridad y tiempos flexibles.",
    includes: [
      "Cerro de Monserrate (ascenso y descenso sujeto a disponibilidad)",
      "Centro historico de Bogota - La Candelaria",
      "Plaza de Bolivar",
      "Teusaquillo (unico barrio Tudor en Latinoamerica)",
      "Visita a una tostadora de cafe en Bogota"
    ],
    excludes: ["Entradas", "Alimentacion"],
    duration: "5 horas",
    schedules: ["08:00", "13:00"],
    basePrice: 180000,
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
    videoUrl: "https://www.youtube.com/watch?v=egNjoNRLgOY",
    recommendations: ["Llevar chaqueta liviana", "Usar zapatos comodos", "Reservar con tiempo si deseas ingresar al Museo del Oro"],
    keywords: ["city tour Bogota", "tour privado Bogota", "La Candelaria", "Museo del Oro"],
    featured: true
  },
  {
    id: "bog-hacienda-napoles",
    citySlug: "bogota",
    name: "Hacienda Napoles",
    slug: "hacienda-napoles",
    description: haciendaNapolesDescription,
    includes: haciendaNapolesIncludes,
    excludes: haciendaNapolesExcludes,
    duration: "Dia completo",
    schedules: ["05:00", "06:00"],
    basePrice: 400000,
    pricingMode: "per-person",
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
    videoUrl: "https://www.youtube.com/watch?v=wkFDgtAvhCw",
    recommendations: ["Salida temprano", "Confirmar entradas con anticipacion"],
    keywords: ["Hacienda Napoles desde Bogota", "tour privado Hacienda Napoles"]
  },
  {
    id: "bog-miradores",
    citySlug: "bogota",
    name: "Miradores",
    slug: "miradores",
    description: "Ruta privada por miradores urbanos y zonas gastronomicas para disfrutar Bogota al atardecer o en la noche.",
    includes: ["Mirador La Cueva del Arco", "Mirador La Calera", "Mirador Monserrate"],
    excludes: ["No incluye entradas (solo cobran entrada en La Cueva del Arco)"],
    duration: "4 horas aproximadamente",
    schedules: ["16:00", "18:00", "20:00"],
    basePrice: 180000,
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
    videoUrl: "https://www.youtube.com/watch?v=uz49V652rVs",
    // TODO: agregar soporte para videos multiples y usar tambien https://www.youtube.com/shorts/dWdmvPG69os.
    recommendations: ["Llevar abrigo", "Ideal para grupos y parejas"],
    keywords: ["miradores Bogota", "tour nocturno Bogota"]
  },
  {
    id: "bog-monserrate",
    citySlug: "bogota",
    name: "Monserrate",
    slug: "monserrate",
    description:
      "El icono turistico mas representativo de Bogota, con una vista panoramica de toda la ciudad desde mas de 3.100 metros de altura. Recomendado de lunes a viernes y sabados despues de las 2:00 p.m.; ideal reservar de 8:00 a.m. a 3:00 p.m. o tomar el segundo tour de 4:30 p.m. a 6:30 p.m. Sabados y domingos puede reemplazarse por Cerro de Guadalupe por alta afluencia en Monserrate.",
    includes: [
      "Transporte ida y vuelta (hotel/casa - Monserrate - hotel/casa)",
      "Tiquetes de ascenso y descenso",
      "Guia turistico ingles-espanol"
    ],
    excludes: ["Alimentacion", "Gastos no especificados"],
    duration: "3 horas",
    schedules: ["08:00", "15:00"],
    basePrice: 110000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/MONSERRATE/HERO/1000_F_580460987_O8r0FPCDN8J0U0CXOnUbguQt4ahTkJDw.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/MONSERRATE/CARD/1000_F_784581854_gHHWOJXoWSx0U9EcGRoXMeHxZgyEu3Ee.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/MONSERRATE/GALERIA/1000_F_166395926_R7g0golcxzPdeHM36Z05MYMba5MEcobu.jpg",
      "/images/BOGOTA/TOURS/MONSERRATE/GALERIA/1000_F_529507674_UGuwbJ1aDybP9RLwGNF9wmXlRU7PSHpN.jpg",
      "/images/BOGOTA/TOURS/MONSERRATE/GALERIA/1000_F_567813429_Vu4QHkQTrbCbKPfkoP6ypjYDWdGZhZkW.jpg"
    ),
    videoUrl: "https://www.youtube.com/watch?v=qwuCdNtutCo",
    recommendations: ["Llevar abrigo", "Evitar subir si tienes sintomas de mal de altura", "Confirmar operacion de teleferico o funicular"],
    keywords: ["Monserrate", "tour Monserrate Bogota", "teleferico Monserrate"],
    featured: true
  },
  {
    id: "bog-centro-historico-candelaria",
    citySlug: "bogota",
    name: "Tour Centro Historico La Candelaria",
    slug: "centro-historico-candelaria",
    description:
      "Tour a pie por La Candelaria enfocado en historia, cultura, arquitectura y patrimonio, recorriendo la antigua Santa Fe de Bogota con su lado colonial, mistico y religioso.",
    includes: [
      "Avenida Jimenez",
      "Plazoleta el Rosario",
      "La Manzana Cultural",
      "Plaza de mercado La Concordia",
      "Plaza del Chorro de Quevedo",
      "Calle 10 y Calle 11",
      "Centro Cultural Gabriel Garcia Marquez",
      "Plaza de Bolivar (Capitolio Nacional, Palacio Lievano, Palacio de Justicia, monumento a Simon Bolivar)",
      "Entrada al Museo del Oro",
      "Iglesias representativas de la zona"
    ],
    excludes: ["Museos adicionales no especificados", "Alimentacion"],
    duration: "4 horas",
    schedules: ["09:00", "14:00"],
    basePrice: 130000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/LA CANDELARIA/HERO/michael-baron-YQSXw2YVqyU-unsplash.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/CARD/caption.jpg"),
    gallery: Array.from(
      new Set([
        ...gallery(
          "/images/BOGOTA/TOURS/LA CANDELARIA/HERO/michael-baron-YQSXw2YVqyU-unsplash.jpg",
          "/images/BOGOTA/TOURS/LA CANDELARIA/CARD/aniket-das-G0pfvtnmPvA-unsplash.jpg",
          "/images/BOGOTA/TOURS/LA CANDELARIA/GALERIA/disfruta-mejores-planes-candelaria.jpg",
          "/images/BOGOTA/TOURS/LA CANDELARIA/GALERIA/images (1).jpg",
          "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/HERO/portada.foto_.hanz_.rippe_.idpc_.plaza_.de_.bolivar_0.jpg",
          "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/CARD/caption.jpg",
          "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/GALERIA/images (2).jpg",
          "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/GALERIA/istockphoto-1944446888-612x612.jpg",
          "/images/BOGOTA/TOURS/PLAZA DE BOLIVAR/GALERIA/istockphoto-2160417598-612x612.jpg",
          "/images/BOGOTA/TOURS/MUSEO DEL ORO/HERO/images (1).jpg",
          "/images/BOGOTA/TOURS/MUSEO DEL ORO/CARD/images (2).jpg",
          "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/c6.jpg",
          "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/images (1).jpg",
          "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/images (3).jpg",
          "/images/BOGOTA/TOURS/MUSEO DEL ORO/GALERIA/museo-del-oro-mo-salas-exposicion-permanente-2022-640x400.jpg"
        )
      ])
    ),
    videoUrl: "https://www.youtube.com/watch?v=gdCWxdcsZoU",
    // TODO: agregar soporte para videos multiples y usar tambien https://www.youtube.com/watch?v=KQ2lEtGiv8M y https://www.youtube.com/watch?v=XeFXeN7t6Uk.
    recommendations: [
      "Otros museos disponibles bajo solicitud, sujetos a horario y disponibilidad: Museo Nacional, Museo Banco de la Republica, Museo de la Policia, Museo Botero, Planetario (no incluidos en el precio base)"
    ],
    keywords: ["Centro Historico Bogota", "La Candelaria", "Museo del Oro", "Plaza de Bolivar"]
  },
  {
    id: "bog-gran-san-victorino",
    citySlug: "bogota",
    name: "Tour Compras Gran San Victorino",
    slug: "gran-san-victorino",
    description:
      "Descubre el corazon comercial de Bogota con una experiencia disenada para quienes buscan las mejores oportunidades de compra. Recorre Gran San Victorino y sus principales zonas comerciales con transporte comodo y seguro, acceso a tiendas con precios de fabrica y mayoristas, y una amplia oferta de moda, calzado, accesorios, tecnologia y articulos para el hogar.",
    includes: [
      "Transporte comodo y seguro durante todo el recorrido",
      "Visita a Gran San Victorino y zonas comerciales aledanas (incluye Centro Comercial Lo Nuestro)",
      "Acceso a tiendas con precios de fabrica y mayoristas",
      "Tiempo libre para compras",
      "Coordinacion y acompanamiento"
    ],
    excludes: ["Compras personales", "Alimentacion"],
    duration: "3 horas",
    schedules: ["09:00", "13:00"],
    basePrice: 130000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    // TODO: reemplazar placeholder por fotos reales de Gran San Victorino.
    heroImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/CARD/33860894418_cbc353dd66_b.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/53189280960_f52f80db0e_z.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/el-museo-de-bogota-_0.jpg"
    ),
    videoUrl: "https://www.youtube.com/shorts/LeW1XJihASg",
    recommendations: ["Hora adicional tiene costo extra (informativo, consultar tarifa con el equipo antes de reservar)"],
    keywords: ["Gran San Victorino", "compras Bogota", "mayoristas Bogota"]
  },
  {
    id: "bog-zona-t",
    citySlug: "bogota",
    name: "Zona T",
    slug: "zona-t",
    description:
      "Descubre uno de los sectores mas exclusivos y vibrantes de Bogota. Recorre la reconocida Zona T, un destino que combina gastronomia, moda, entretenimiento y vida urbana en un ambiente moderno y sofisticado.",
    includes: [
      "Transporte comodo y seguro",
      "Visita a la Zona T y sus principales atractivos",
      "Recorrido comercial, gastronomico y de entretenimiento",
      "Tiempo libre"
    ],
    excludes: ["Consumos", "Reservas en restaurantes", "Entradas a bares o clubes"],
    duration: "4 horas",
    schedules: ["17:00", "19:00", "21:00"],
    basePrice: 90000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/ZONA T/HERO/zona-rosa.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/ZONA T/CARD/caption.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/ZONA T/GALERIA/c4.jpg",
      "/images/BOGOTA/TOURS/ZONA T/GALERIA/caption.jpg",
      "/images/BOGOTA/TOURS/ZONA T/GALERIA/images (2).jpg"
    ),
    videoUrl: "https://www.youtube.com/watch?v=hdSsGqh888A",
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
    includes: [
      "Transporte privado (hotel-tour-hotel)",
      "Guia turistico ingles-espanol",
      "Entradas a la Laguna de Guatavita y Casa Loca",
      "Visita opcional sin costo al centro historico de Guatavita",
      "Logistica y acompanamiento"
    ],
    excludes: ["Alimentacion", "Gastos no especificados"],
    duration: "8 horas",
    schedules: ["07:00"],
    basePrice: 290000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    heroImage: localImage("/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/HERO/ricardo-cifuentes-t-4xjoKWv3Vhs-unsplash.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/CARD/david-hertle-1D0IXPsn3BQ-unsplash.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/GALERIA/images (1).jpg",
      "/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/GALERIA/images (2).jpg",
      "/images/BOGOTA/TOURS/LAGUNA DE GUATAVITA/GALERIA/photo-1707073687016-7e500a79b5c3.avif"
    ),
    videoUrl: "https://www.youtube.com/watch?v=A79x92bGW_0",
    recommendations: ["Descuentos en restaurantes y tiendas de souvenirs aliados"],
    keywords: ["Laguna de Guatavita", "El Dorado", "tour Guatavita desde Bogota"]
  },
  {
    id: "bog-catedral-sal",
    citySlug: "bogota",
    name: "Catedral de Sal de Zipaquira",
    slug: "catedral-de-sal",
    description:
      "La Catedral de Sal de Zipaquira es considerada la primera maravilla de Colombia. Construida en el interior de una mina de sal, a 180 metros bajo tierra, combina arquitectura, espiritualidad y arte.",
    includes: [
      "Pasaporte basico de entrada",
      "Audioguia",
      "Salmuera 4DX",
      "Wifi",
      "Proyeccion de mapping",
      "Cortometraje 3D Nucuma",
      "Tren de salida",
      "Caminata Huellas de Sal",
      "Museo Arqueologico",
      "Museo Monumental 180",
      "Naves de la Catedral",
      "Sendero Ecologico",
      "Nartex",
      "Cupula",
      "Espejo de Agua"
    ],
    excludes: ["Almuerzo", "Gastos no especificados"],
    duration: "7 horas",
    schedules: ["08:00"],
    basePrice: 400000,
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
    videoUrl: "https://www.youtube.com/watch?v=jPzaTFiwkFE",
    recommendations: ["Comprar entradas con anticipacion", "Llevar abrigo", "Combinar con centro historico de Zipaquira"],
    keywords: ["Catedral de Sal de Zipaquira", "tour Zipaquira", "experiencia subterranea"]
  },
  {
    id: "bog-jaime-duque",
    citySlug: "bogota",
    name: "Tour Parque Jaime Duque",
    slug: "parque-jaime-duque",
    description:
      "Visita en recorrido guiado y todo incluido el parque tematico mas grande de Colombia, con escenarios historicos, arquitectonicos, tecnologicos y ambientalistas. Informacion educativa y divertida para todas las edades.",
    includes: [
      "Replica del Taj Mahal",
      "Bioparque Wakata (200+ especies)",
      "Tren panoramico",
      "Bicicletas aereas",
      "Castillo Medieval",
      "Troncos acuaticos",
      "Las 7 maravillas del Mundo Antiguo",
      "Aviario con el mapa de Colombia",
      "Transporte privado (hotel-tour-hotel)",
      "Guia ingles-espanol",
      "Logistica y acompanamiento"
    ],
    excludes: ["Tren de los Andes", "Bicicletas de Ecoparque Sabana"],
    duration: "1 hora y media aproximadamente desde Bogota",
    schedules: ["08:00"],
    basePrice: 260000,
    pricingMode: "per-person",
    minimumPassengers: 2,
    // TODO: reemplazar placeholder por fotos reales del Parque Jaime Duque.
    heroImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg"),
    cardImage: localImage("/images/BOGOTA/TOURS/CITY TOUR BOGOTA/CARD/33860894418_cbc353dd66_b.jpg"),
    gallery: gallery(
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/1.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/53189280960_f52f80db0e_z.jpg",
      "/images/BOGOTA/TOURS/CITY TOUR BOGOTA/GALERIA/el-museo-de-bogota-_0.jpg"
    ),
    videoUrl: "https://www.youtube.com/watch?v=qeg2CLqE03A",
    recommendations: ["Sin costo adicional se visita el municipio de Sopo, con opcion de conocer la Cabana de Alpina"],
    keywords: ["Parque Jaime Duque", "tour familiar Bogota", "Tocancipa"]
  }
];

export type TourRouteDestination = {
  label: string;
  placeId?: string;
};

export const tourRouteDestinations: Record<string, TourRouteDestination> = {
  "med-city-tour": { label: "Plaza Botero, Medellín, Colombia" },
  "med-comuna-13": { label: "Graffitour Comuna 13, Medellín, Colombia" },
  "med-guatape": { label: "Piedra del Peñol, Guatapé, Antioquia, Colombia" },
  "med-vuelta-oriente": { label: "El Retiro, Antioquia, Colombia" },
  "med-coffee-tour": { label: "Jardín, Antioquia, Colombia" },
  "med-hacienda-napoles": { label: "Hacienda Nápoles, Puerto Triunfo, Antioquia, Colombia" },
  "med-parapente": { label: "San Félix, Bello, Antioquia, Colombia" },
  "med-compras": { label: "El Tesoro Parque Comercial, Medellín, Colombia" },
  "med-pablo-escobar": { label: "Cementerio Jardines Montesacro, Itagüí, Colombia" },
  "med-miradores": { label: "Mirador Las Palmas, Medellín, Colombia" },
  "med-santa-fe": { label: "Santa Fe de Antioquia, Antioquia, Colombia" },
  "bog-city-tour": { label: "Plaza de Bolívar, Bogotá, Colombia" },
  "bog-hacienda-napoles": { label: "Hacienda Nápoles, Puerto Triunfo, Antioquia, Colombia" },
  "bog-miradores": { label: "Mirador La Calera, Bogotá, Colombia" },
  "bog-monserrate": { label: "Cerro de Monserrate, Bogotá, Colombia" },
  "bog-centro-historico-candelaria": { label: "La Candelaria, Bogotá, Colombia" },
  "bog-gran-san-victorino": { label: "Gran San Victorino, Bogotá, Colombia" },
  "bog-zona-t": { label: "Zona T, Bogotá, Colombia" },
  "bog-guatavita": { label: "Laguna de Guatavita, Sesquilé, Cundinamarca, Colombia" },
  "bog-catedral-sal": { label: "Catedral de Sal de Zipaquirá, Colombia" },
  "bog-jaime-duque": { label: "Parque Jaime Duque, Tocancipá, Cundinamarca, Colombia" }
};

export function getTourRouteDestination(tourId: string) {
  return tourRouteDestinations[tourId];
}

export const vehicles: Vehicle[] = [
  {
    id: "sedan-premium",
    type: "sedan",
    name: "Sedan Premium",
    capacity: 4,
    luggage: 2,
    image: localImage("/images/GLOBAL/VEHICULOS/SEDAN EJECUTIVO/87-sam-2546-still-virtus-23-cl-tsi-basico-5-8-frente-b4b4-cristal-estu-adv-sam.png"),
    description: "Ideal para aeropuerto, viajeros de negocio y parejas.",
    available: true
  },
  {
    id: "suv-premium",
    type: "suv",
    name: "SUV Premium",
    capacity: 4,
    luggage: 4,
    image: localImage("/images/GLOBAL/VEHICULOS/SUV PREMIUM/images (2).jpg"),
    description: "Mayor confort para familias, clientes VIP y equipaje.",
    available: true
  },
  {
    id: "six-passenger",
    type: "six-passenger",
    name: "Vehículo de 6 pasajeros",
    capacity: 6,
    luggage: null,
    image: localImage("/images/GLOBAL/VEHICULOS/SUV PREMIUM/images (3).jpg"),
    description: "Alternativa privada para grupos de hasta seis pasajeros.",
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
