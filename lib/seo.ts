import type { Metadata } from "next";
import type { City, Service, Tour } from "@/lib/domain/types";

export const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://movecolombia.co";

export const defaultSeo: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MOVE Colombia | Transporte Privado y Experiencias en Colombia",
    template: "%s | MOVE Colombia"
  },
  description:
    "Transporte privado, traslados de aeropuerto y tours personalizados en Bogotá y Medellín con atención directa de MOVE Colombia.",
  keywords: [
    "transporte privado Colombia",
    "traslado aeropuerto Medellín",
    "traslado aeropuerto Bogotá",
    "tours privados Colombia",
    "transporte ejecutivo"
  ],
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/images/move-logo-original.png",
    shortcut: "/images/move-logo-original.png",
    apple: "/images/move-logo-original.png"
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "MOVE Colombia",
    title: "MOVE Colombia",
    description:
      "Movilidad premium y experiencias privadas en Colombia.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MOVE Colombia"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MOVE Colombia",
    description: "Transporte privado y experiencias premium en Colombia."
  }
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function cityMetadata(city: City): Metadata {
  const title = city.heroTitle ?? `Transporte privado en ${city.name}`;
  const description = `${city.headline} ${city.description}`;
  const image = city.heroImage ?? city.image;

  return {
    title,
    description,
    keywords: [
      `transporte privado ${city.name}`,
      `traslado aeropuerto ${city.name}`,
      `tours privados ${city.name}`,
      `conductor privado ${city.name}`,
      "MOVE Colombia"
    ],
    alternates: {
      canonical: `/destinos/${city.slug}`
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/destinos/${city.slug}`),
      images: [{ url: image, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export function tourMetadata(city: City, tour: Tour): Metadata {
  const title = `${tour.name} privado en ${city.name}`;
  const description = `${tour.description} Reserva con transporte privado, conductor profesional y coordinacion directa en ${city.name}.`;
  const images = tour.gallery.length ? tour.gallery : [tour.heroImage ?? tour.cardImage ?? city.image];

  return {
    title,
    description,
    keywords: [
      ...(tour.keywords ?? []),
      `${tour.name} ${city.name}`,
      `tour privado ${city.name}`,
      `transporte privado ${city.name}`
    ],
    alternates: {
      canonical: `/destinos/${city.slug}/${tour.slug}`
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteUrl(`/destinos/${city.slug}/${tour.slug}`),
      images: images.map((url) => ({ url, alt: title }))
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [images[0]]
    }
  };
}

export function serviceMetadata(service: Service, city?: City, image?: string): Metadata {
  const cityName = city?.name ?? "Colombia";
  const title = `${service.title} en ${cityName}`;
  const description = `${service.description} Operación privada con MOVE Colombia para viajeros, pacientes, familias y empresas.`;
  const metadataImage = image ?? service.heroImage ?? service.cardImage;

  return {
    title,
    description,
    keywords: [
      service.title,
      `${service.title} ${cityName}`,
      `transporte privado ${cityName}`,
      "movilidad premium Colombia"
    ],
    alternates: {
      canonical: `/servicios/${service.slug}`
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/servicios/${service.slug}`),
      images: metadataImage ? [{ url: metadataImage, alt: title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: metadataImage ? [metadataImage] : undefined
    }
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MOVE Colombia",
    url: siteUrl,
    areaServed: ["Medellín", "Bogotá", "Colombia"],
    email: "contactateconseda@gmail.com",
    telephone: "+57 314 727 8404",
    serviceType: [
      "Private transportation",
      "Airport transfers",
      "Private tours",
      "Executive transportation"
    ]
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}

export function citySchema(city: City, services: Service[], tours: Tour[]) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${city.name} con MOVE Colombia`,
    description: city.description,
    url: absoluteUrl(`/destinos/${city.slug}`),
    image: [city.heroImage ?? city.image, ...(city.heroGallery ?? [])].map((src) => absoluteUrl(src)),
    touristType: ["Viajeros privados", "Clientes corporativos", "Familias", "Pacientes internacionales"],
    includesAttraction: tours.slice(0, 8).map((tour) => ({
      "@type": "TouristAttraction",
      name: tour.name,
      url: absoluteUrl(`/destinos/${city.slug}/${tour.slug}`)
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Servicios privados en ${city.name}`,
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          serviceType: service.category,
          url: absoluteUrl(`/servicios/${service.slug}`)
        }
      }))
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: absoluteUrl(`/reservar?city=${city.slug}`)
    }
  };
}

export function tourSchema(city: City, tour: Tour) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${tour.name} en ${city.name}`,
    description: tour.description,
    image: tour.gallery.map((src) => absoluteUrl(src)),
    url: absoluteUrl(`/destinos/${city.slug}/${tour.slug}`),
    touristType: ["Viajeros privados", "Clientes corporativos", "Familias"],
    provider: {
      "@type": "LocalBusiness",
      name: "MOVE Colombia",
      url: siteUrl
    },
    offers: {
      "@type": "Offer",
      price: tour.basePrice,
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/destinos/${city.slug}/${tour.slug}`)
    },
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.includes.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item
      }))
    }
  };
}

export function serviceSchema(service: Service, city?: City, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: city ? `${service.title} en ${city.name}` : service.title,
    description: service.description,
    serviceType: service.category,
    url: absoluteUrl(`/servicios/${service.slug}`),
    image: image ? absoluteUrl(image) : undefined,
    areaServed: city?.name ?? "Colombia",
    provider: {
      "@type": "LocalBusiness",
      name: "MOVE Colombia",
      url: siteUrl
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Modalidades del servicio",
      itemListElement: service.benefits.map((benefit) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: benefit
        }
      }))
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: absoluteUrl(`/reservar?service=${service.slug}${city ? `&city=${city.slug}` : ""}`)
    }
  };
}

export function faqSchema(faqs: Service["faqs"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}
