"use client";

import { MapPinned, Route } from "lucide-react";
import { RouteMiniMap } from "@/components/booking/route-mini-map";
import type { TourRoutePreview } from "@/lib/data/tour-route-previews";

const googleMapsBrowserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;

export function TourRoutePreviewMap({
  citySlug,
  route
}: {
  citySlug: string;
  route: TourRoutePreview;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)]">
      <div className="border-b bg-muted/45 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="eyebrow">Mapa del tour</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{route.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{route.note}</p>
          </div>
          <div className="rounded-lg border bg-background p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Route className="size-4 text-primary" aria-hidden />
              Ruta referencial
            </p>
            <p className="mt-2 text-muted-foreground">{route.origin}</p>
            <p className="mt-1 font-medium">{route.destination}</p>
          </div>
        </div>
      </div>
      {googleMapsBrowserKey ? (
        <RouteMiniMap
          apiKey={googleMapsBrowserKey}
          cityId={citySlug}
          destination={route.destination}
          enabled
          language="ES"
          origin={route.origin}
        />
      ) : (
        <div className="grid min-h-[260px] place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(7,18,128,0.12),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.08),rgba(15,23,42,0.02))] p-6 text-center">
          <div className="max-w-md rounded-xl border bg-background/90 p-5 shadow-soft backdrop-blur">
            <MapPinned className="mx-auto size-8 text-primary" aria-hidden />
            <p className="mt-3 font-semibold">Minimapa listo para Google Maps</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Configura `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` en Vercel para mostrar el mapa interactivo con la ruta.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
