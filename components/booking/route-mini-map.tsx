"use client";

import { Loader2, MapPinned } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  type GoogleDirectionsRenderer,
  type GoogleDirectionsService,
  type GoogleMap,
  useGoogleMaps
} from "./google-maps";

type RouteMiniMapProps = {
  apiKey?: string;
  cityId: string;
  departureAt?: string;
  destination: string;
  destinationPlaceId?: string;
  enabled: boolean;
  language: "ES" | "EN";
  origin: string;
  originPlaceId?: string;
};

const cityCenters: Record<string, { lat: number; lng: number }> = {
  bogota: { lat: 4.711, lng: -74.0721 },
  medellin: { lat: 6.2442, lng: -75.5812 }
};

const routeCopy = {
  ES: {
    pending: "Ruta pendiente",
    loading: "Trazando ruta...",
    error: "Mapa no disponible",
    ready: "Ruta Google Maps"
  },
  EN: {
    pending: "Route pending",
    loading: "Drawing route...",
    error: "Map unavailable",
    ready: "Google Maps route"
  }
};

export function RouteMiniMap({
  apiKey,
  cityId,
  departureAt,
  destination,
  destinationPlaceId,
  enabled,
  language,
  origin,
  originPlaceId
}: RouteMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const directionsRendererRef = useRef<GoogleDirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<GoogleDirectionsService | null>(null);
  const [routeStatus, setRouteStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const { maps, status } = useGoogleMaps(apiKey);
  const copy = routeCopy[language];
  const hasRouteInput = Boolean(
    (originPlaceId || origin.trim().length >= 4) && (destinationPlaceId || destination.trim().length >= 4)
  );

  const center = useMemo(() => cityCenters[cityId] ?? cityCenters.medellin, [cityId]);

  useEffect(() => {
    if (!maps || !containerRef.current || mapRef.current) return;

    const map = new maps.maps.Map(containerRef.current, {
      center,
      disableDefaultUI: true,
      gestureHandling: "cooperative",
      mapTypeControl: false,
      streetViewControl: false,
      zoom: 11,
      zoomControl: true
    });

    const directionsRenderer = new maps.maps.DirectionsRenderer({
      preserveViewport: false,
      suppressMarkers: false
    });

    directionsRenderer.setMap(map);
    mapRef.current = map;
    directionsRendererRef.current = directionsRenderer;
    directionsServiceRef.current = new maps.maps.DirectionsService();

    return () => {
      directionsRenderer.setMap(null);
      mapRef.current = null;
      directionsRendererRef.current = null;
      directionsServiceRef.current = null;
    };
  }, [center, maps]);

  useEffect(() => {
    if (!enabled || !hasRouteInput || !maps || !directionsServiceRef.current || !directionsRendererRef.current) {
      setRouteStatus("idle");
      return;
    }

    let cancelled = false;
    setRouteStatus("loading");

    directionsServiceRef.current.route(
      {
        destination: destinationPlaceId ? { placeId: destinationPlaceId } : destination,
        drivingOptions: getDrivingOptions(departureAt),
        origin: originPlaceId ? { placeId: originPlaceId } : origin,
        region: "co",
        travelMode: maps.maps.TravelMode.DRIVING
      },
      (result, directionStatus) => {
        if (cancelled) return;

        if (directionStatus === maps.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current?.setDirections(result);
          setRouteStatus("ready");
          return;
        }

        setRouteStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [departureAt, destination, destinationPlaceId, enabled, hasRouteInput, maps, origin, originPlaceId]);

  if (!apiKey || !enabled) {
    return null;
  }

  const visibleStatus = status === "loading" ? "loading" : routeStatus;

  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-lg border bg-muted">
      <div ref={containerRef} className="absolute inset-0" />
      {visibleStatus !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/82 px-6 text-center backdrop-blur-sm">
          <div className="space-y-2">
            {visibleStatus === "loading" ? (
              <Loader2 className="mx-auto size-5 animate-spin text-primary" aria-hidden />
            ) : (
              <MapPinned className="mx-auto size-5 text-primary" aria-hidden />
            )}
            <p className="text-sm font-semibold text-foreground">
              {visibleStatus === "loading" ? copy.loading : visibleStatus === "error" ? copy.error : copy.pending}
            </p>
          </div>
        </div>
      ) : null}
      {visibleStatus === "ready" ? (
        <div className="absolute left-3 top-3 rounded-md bg-background/90 px-3 py-2 text-xs font-semibold shadow-soft backdrop-blur">
          {copy.ready}
        </div>
      ) : null}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/90 to-transparent",
          visibleStatus === "ready" ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

function getDrivingOptions(departureAt?: string) {
  if (!departureAt) return undefined;

  const departureTime = new Date(departureAt);
  if (!Number.isFinite(departureTime.getTime())) return undefined;

  const fallbackTime = new Date(Date.now() + 60_000);
  return {
    departureTime: departureTime > fallbackTime ? departureTime : fallbackTime,
    trafficModel: "bestguess"
  };
}
