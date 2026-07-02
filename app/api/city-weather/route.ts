import { NextResponse } from "next/server";
import { getCityWeather, isWeatherCitySlug } from "@/lib/services/weather";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!isWeatherCitySlug(city)) {
    return NextResponse.json(
      { error: "Ciudad no soportada. Usa bogota o medellin." },
      { status: 400 }
    );
  }

  try {
    const weather = await getCityWeather(city);
    return NextResponse.json(weather);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No fue posible consultar el clima."
      },
      { status: 502 }
    );
  }
}
