export type RouteEstimate = {
  distanceKm: number;
  durationText: string | null;
  originAddress?: string | null;
  destinationAddress?: string | null;
};

export type RouteEstimateErrorCode =
  | "missing-api-key"
  | "request-failed"
  | "google-error"
  | "route-not-found"
  | "invalid-route";

export type RouteEstimateError = {
  code: RouteEstimateErrorCode;
  message: string;
  googleStatus?: string;
};

export type RouteEstimateResult =
  | { ok: true; route: RouteEstimate }
  | { ok: false; error: RouteEstimateError };

export function buildDepartureAt(date?: string, time?: string) {
  if (!date || !time) return undefined;
  return `${date}T${time}:00-05:00`;
}

export async function getRouteEstimate(params: {
  origin: string;
  destination: string;
  originPlaceId?: string;
  destinationPlaceId?: string;
  departureAt?: string;
}): Promise<RouteEstimate | null> {
  const result = await getRouteEstimateResult(params);
  return result.ok ? result.route : null;
}

export async function getRouteEstimateResult({
  origin,
  destination,
  originPlaceId,
  destinationPlaceId,
  departureAt
}: {
  origin: string;
  destination: string;
  originPlaceId?: string;
  destinationPlaceId?: string;
  departureAt?: string;
}): Promise<RouteEstimateResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: {
        code: "missing-api-key",
        message: "El calculo de ruta no esta disponible porque falta GOOGLE_MAPS_API_KEY."
      }
    };
  }

  const params = new URLSearchParams({
    origins: formatDistanceMatrixLocation(origin, originPlaceId),
    destinations: formatDistanceMatrixLocation(destination, destinationPlaceId),
    key: apiKey,
    units: "metric",
    language: "es",
    mode: "driving",
    region: "co"
  });

  const departureTime = getDepartureTimestamp(departureAt);
  if (departureTime) {
    params.set("departure_time", String(departureTime));
    params.set("traffic_model", "best_guess");
  }

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          code: "request-failed",
          message: "Google Maps no respondio correctamente. Intenta recalcular la ruta.",
          googleStatus: String(response.status)
        }
      };
    }

    const data = (await response.json()) as {
      status?: string;
      error_message?: string;
      origin_addresses?: string[];
      destination_addresses?: string[];
      rows?: Array<{
        elements?: Array<{
          status?: string;
          distance?: { value?: number };
          duration_in_traffic?: { text?: string };
          duration?: { text?: string };
        }>;
      }>;
    };

    if (data.status && data.status !== "OK") {
      return {
        ok: false,
        error: {
          code: "google-error",
          message: data.error_message ?? "Google Maps rechazo el calculo de ruta.",
          googleStatus: data.status
        }
      };
    }

    const element = data.rows?.[0]?.elements?.[0];

    if (element?.status !== "OK" || !element.distance?.value) {
      return {
        ok: false,
        error: {
          code: element?.status === "ZERO_RESULTS" || element?.status === "NOT_FOUND" ? "route-not-found" : "invalid-route",
          message: getElementErrorMessage(element?.status),
          googleStatus: element?.status
        }
      };
    }

    return {
      ok: true,
      route: {
        distanceKm: element.distance.value / 1000,
        durationText: element.duration_in_traffic?.text ?? element.duration?.text ?? null,
        originAddress: data.origin_addresses?.[0] ?? null,
        destinationAddress: data.destination_addresses?.[0] ?? null
      }
    };
  } catch {
    return {
      ok: false,
      error: {
        code: "request-failed",
        message: "No fue posible conectar con Google Maps para calcular la ruta."
      }
    };
  }
}

function getDepartureTimestamp(departureAt?: string) {
  if (!departureAt) return undefined;

  const timestamp = Math.floor(new Date(departureAt).getTime() / 1000);
  if (!Number.isFinite(timestamp)) return undefined;

  const now = Math.floor(Date.now() / 1000);
  return timestamp > now ? timestamp : now + 60;
}

function formatDistanceMatrixLocation(address: string, placeId?: string) {
  const normalizedPlaceId = placeId?.trim();
  return normalizedPlaceId ? `place_id:${normalizedPlaceId}` : address.trim();
}

function getElementErrorMessage(status?: string) {
  if (status === "NOT_FOUND") {
    return "No encontramos una de las direcciones. Selecciona una sugerencia de Google o escribe una direccion mas precisa.";
  }

  if (status === "ZERO_RESULTS") {
    return "Google Maps no encontro una ruta manejable entre origen y destino.";
  }

  if (status === "MAX_ROUTE_LENGTH_EXCEEDED") {
    return "La ruta es demasiado larga para calcularla automaticamente.";
  }

  return "No fue posible calcular la ruta. Verifica origen y destino.";
}
