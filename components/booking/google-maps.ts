"use client";

import { useEffect, useState } from "react";

type GoogleMapsListener = {
  remove: () => void;
};

export type GooglePlaceResult = {
  formatted_address?: string;
  name?: string;
  place_id?: string;
};

export type GoogleAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => GoogleMapsListener;
  getPlace: () => GooglePlaceResult;
};

export type GoogleAutocompleteOptions = {
  componentRestrictions?: { country: string | string[] };
  fields?: string[];
  strictBounds?: boolean;
  types?: string[];
};

export type GoogleMapOptions = {
  center: { lat: number; lng: number };
  disableDefaultUI?: boolean;
  gestureHandling?: string;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  zoom: number;
  zoomControl?: boolean;
};

export type GoogleMap = unknown;

export type GoogleDirectionsRequest = {
  origin: string | { placeId: string };
  destination: string | { placeId: string };
  travelMode: string;
  drivingOptions?: {
    departureTime: Date;
    trafficModel?: string;
  };
  region?: string;
};

export type GoogleDirectionsRenderer = {
  setMap: (map: GoogleMap | null) => void;
  setDirections: (directions: unknown) => void;
};

export type GoogleDirectionsService = {
  route: (
    request: GoogleDirectionsRequest,
    callback: (result: unknown, status: string) => void
  ) => void;
};

export type GoogleMapsNamespace = {
  maps: {
    DirectionsRenderer: new (options?: Record<string, unknown>) => GoogleDirectionsRenderer;
    DirectionsService: new () => GoogleDirectionsService;
    DirectionsStatus: { OK: string };
    Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMap;
    TravelMode: { DRIVING: string };
    event: {
      clearInstanceListeners: (instance: unknown) => void;
    };
    places: {
      Autocomplete: new (input: HTMLInputElement, options?: GoogleAutocompleteOptions) => GoogleAutocomplete;
    };
  };
};

type GoogleMapsState = {
  maps: GoogleMapsNamespace | null;
  status: "idle" | "loading" | "ready" | "error";
};

declare global {
  interface Window {
    google?: GoogleMapsNamespace;
    __moveGoogleMapsInit?: () => void;
  }
}

let googleMapsPromise: Promise<GoogleMapsNamespace> | null = null;

export function useGoogleMaps(apiKey?: string): GoogleMapsState {
  const normalizedKey = apiKey?.trim();
  const [state, setState] = useState<GoogleMapsState>({
    maps: null,
    status: normalizedKey ? "loading" : "idle"
  });

  useEffect(() => {
    if (!normalizedKey) {
      setState({ maps: null, status: "idle" });
      return;
    }

    let cancelled = false;
    setState((current) => ({ maps: current.maps, status: current.maps ? "ready" : "loading" }));

    loadGoogleMaps(normalizedKey)
      .then((maps) => {
        if (!cancelled) {
          setState({ maps, status: "ready" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ maps: null, status: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedKey]);

  return state;
}

function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps solo puede cargar en el navegador."));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise<GoogleMapsNamespace>((resolve, reject) => {
    window.__moveGoogleMapsInit = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
        return;
      }

      googleMapsPromise = null;
      reject(new Error("Google Maps cargo sin la libreria de Places."));
    };

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-move-google-maps='true']");

    if (existingScript) {
      existingScript.addEventListener("load", () => window.__moveGoogleMapsInit?.(), { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          googleMapsPromise = null;
          reject(new Error("No fue posible cargar Google Maps."));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.dataset.moveGoogleMaps = "true";
    script.src = buildGoogleMapsUrl(apiKey);
    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error("No fue posible cargar Google Maps."));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function buildGoogleMapsUrl(apiKey: string) {
  const params = new URLSearchParams({
    callback: "__moveGoogleMapsInit",
    key: apiKey,
    language: "es",
    libraries: "places",
    loading: "async",
    region: "CO",
    v: "weekly"
  });

  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
}
