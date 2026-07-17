import type { MetadataRoute } from "next";
import { cities, services, tours } from "@/lib/data/catalog";
import { absoluteUrl } from "@/lib/seo";
import { legalDocumentSlugs } from "@/lib/legal/documents";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/reservar"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...legalDocumentSlugs.map((slug) => ({
      url: absoluteUrl(`/legal/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.35
    })),
    ...cities.map((city) => ({
      url: absoluteUrl(`/destinos/${city.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.86
    })),
    ...tours.map((tour) => ({
      url: absoluteUrl(`/destinos/${tour.citySlug}/${tour.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.78
    })),
    ...services.map((service) => ({
      url: absoluteUrl(`/servicios/${service.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82
    }))
  ];
}
