import { NextResponse } from "next/server";

const DEFAULT_MAX_JSON_BYTES = 32 * 1024;

type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; response: NextResponse };

export async function readJsonBody(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BYTES
): Promise<JsonBodyResult> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "El contenido debe enviarse como JSON." },
        { status: 415 }
      )
    };
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "La solicitud excede el tamaño permitido." },
        { status: 413 }
      )
    };
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "No se pudo leer la solicitud." }, { status: 400 })
    };
  }

  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "La solicitud excede el tamaño permitido." },
        { status: 413 }
      )
    };
  }

  try {
    return { ok: true, data: JSON.parse(rawBody) };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "El JSON enviado no es válido." }, { status: 400 })
    };
  }
}

export function enforceTrustedOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    return forbiddenOriginResponse();
  }

  const origin = request.headers.get("origin");
  if (!origin) return null;

  const allowedOrigins = getAllowedOrigins(request);
  if (!allowedOrigins.has(normalizeOrigin(origin))) {
    return forbiddenOriginResponse();
  }

  return null;
}

export async function readLimitedTextBody(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return null;
  }

  try {
    const body = await request.text();
    return new TextEncoder().encode(body).byteLength <= maxBytes ? body : null;
  } catch {
    return null;
  }
}

function getAllowedOrigins(request: Request) {
  const origins = new Set<string>();

  try {
    origins.add(new URL(request.url).origin);
  } catch {
    // The forwarded host below remains the authoritative deployment fallback.
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || (host?.startsWith("localhost") ? "http" : "https");
  if (host) origins.add(`${protocol}://${host}`);

  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredAppUrl) {
    try {
      origins.add(new URL(configuredAppUrl).origin);
    } catch {
      // Invalid configuration is handled by the deployment readiness check.
    }
  }

  return new Set([...origins].map(normalizeOrigin));
}

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/, "").toLowerCase();
}

function forbiddenOriginResponse() {
  return NextResponse.json(
    { error: "Origen de solicitud no autorizado." },
    {
      status: 403,
      headers: { "Cache-Control": "no-store" }
    }
  );
}
