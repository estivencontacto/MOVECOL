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

const MAX_BUCKETS = 10_000;
let requestsSinceCleanup = 0;

const globalRateLimit = globalThis as typeof globalThis & {
  __moveRateLimitStore?: Map<string, Bucket>;
};

const store = globalRateLimit.__moveRateLimitStore ?? new Map<string, Bucket>();
globalRateLimit.__moveRateLimitStore = store;

export function enforceRateLimit(request: Request, options: RateLimitOptions) {
  const now = Date.now();
  cleanupExpiredBuckets(now);

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
        "Cache-Control": "no-store",
        "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)),
        "X-RateLimit-Limit": String(options.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(current.resetAt / 1000))
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

function cleanupExpiredBuckets(now: number) {
  requestsSinceCleanup += 1;

  if (requestsSinceCleanup < 100 && store.size < MAX_BUCKETS) return;

  requestsSinceCleanup = 0;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }

  if (store.size < MAX_BUCKETS) return;

  const oldestKeys = [...store.entries()]
    .sort(([, left], [, right]) => left.resetAt - right.resetAt)
    .slice(0, Math.ceil(MAX_BUCKETS * 0.1))
    .map(([key]) => key);

  oldestKeys.forEach((key) => store.delete(key));
}
