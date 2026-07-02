import { NextResponse } from "next/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  __moveRateLimitStore?: Map<string, Bucket>;
};

const store = globalRateLimit.__moveRateLimitStore ?? new Map<string, Bucket>();
globalRateLimit.__moveRateLimitStore = store;

export function enforceRateLimit(request: Request, options: RateLimitOptions) {
  const now = Date.now();
  const clientKey = getClientKey(request);
  const key = `${options.key}:${clientKey}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  current.count += 1;

  if (current.count <= options.limit) {
    return null;
  }

  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((current.resetAt - now) / 1000))
      }
    }
  );
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
