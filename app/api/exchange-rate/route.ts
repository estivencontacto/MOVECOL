import { NextResponse } from "next/server";

export async function GET() {
  const fallbackRate = Number(process.env.USD_COP_FALLBACK_RATE ?? 4000);

  const openRate = await getOpenExchangeRate();
  if (openRate) {
    return NextResponse.json({
      usdCopRate: openRate,
      source: "open-er-api"
    });
  }

  const keyedRate = await getKeyedExchangeRate();
  if (keyedRate) {
    return NextResponse.json({
      usdCopRate: keyedRate,
      source: "exchange-rate-api"
    });
  }

  return NextResponse.json({
    usdCopRate: fallbackRate,
    source: "fallback"
  });
}

async function getOpenExchangeRate() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 60 * 60 * 12 }
    });
    const data = (await response.json()) as { result?: string; rates?: { COP?: number } };
    const usdCopRate = data.rates?.COP;

    return data.result === "success" && usdCopRate && Number.isFinite(usdCopRate) ? usdCopRate : null;
  } catch {
    return null;
  }
}

async function getKeyedExchangeRate() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      next: { revalidate: 60 * 60 * 12 }
    });
    const data = (await response.json()) as { conversion_rates?: { COP?: number } };
    const usdCopRate = data.conversion_rates?.COP;

    return usdCopRate && Number.isFinite(usdCopRate) ? usdCopRate : null;
  } catch {
    return null;
  }
}
