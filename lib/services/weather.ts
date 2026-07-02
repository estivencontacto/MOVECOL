export type WeatherCitySlug = "bogota" | "medellin";

export type CityWeatherData = {
  citySlug: WeatherCitySlug;
  cityName: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  timezone: string;
  localTime: string;
  localTimeLabel: string;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  weatherCode: number | null;
  conditionEs: string;
  conditionEn: string;
  cloudCover: number | null;
  windSpeedKmh: number | null;
  isDay: boolean | null;
  source: "open-meteo";
};

export const cityWeatherProfiles: Record<WeatherCitySlug, {
  name: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  timezone: string;
}> = {
  bogota: {
    name: "Bogota",
    latitude: 4.711,
    longitude: -74.0721,
    altitudeMeters: 2640,
    timezone: "America/Bogota"
  },
  medellin: {
    name: "Medellin",
    latitude: 6.2442,
    longitude: -75.5812,
    altitudeMeters: 1495,
    timezone: "America/Bogota"
  }
};

type OpenMeteoResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    cloud_cover?: number;
    wind_speed_10m?: number;
    is_day?: number;
  };
};

const weatherCodeMap: Record<number, { es: string; en: string }> = {
  0: { es: "Cielo despejado", en: "Clear sky" },
  1: { es: "Mayormente despejado", en: "Mostly clear" },
  2: { es: "Parcialmente nublado", en: "Partly cloudy" },
  3: { es: "Nublado", en: "Overcast" },
  45: { es: "Niebla", en: "Fog" },
  48: { es: "Niebla con escarcha", en: "Depositing rime fog" },
  51: { es: "Llovizna ligera", en: "Light drizzle" },
  53: { es: "Llovizna moderada", en: "Moderate drizzle" },
  55: { es: "Llovizna intensa", en: "Dense drizzle" },
  61: { es: "Lluvia ligera", en: "Light rain" },
  63: { es: "Lluvia moderada", en: "Moderate rain" },
  65: { es: "Lluvia fuerte", en: "Heavy rain" },
  80: { es: "Chubascos ligeros", en: "Light showers" },
  81: { es: "Chubascos moderados", en: "Moderate showers" },
  82: { es: "Chubascos fuertes", en: "Violent showers" },
  95: { es: "Tormenta", en: "Thunderstorm" },
  96: { es: "Tormenta con granizo", en: "Thunderstorm with hail" },
  99: { es: "Tormenta fuerte con granizo", en: "Heavy thunderstorm with hail" }
};

function formatLocalTimeLabel(localTime: string) {
  const timePart = localTime.split("T")[1]?.slice(0, 5);

  if (!timePart) {
    return "Hora no disponible";
  }

  const [hourValue, minuteValue] = timePart.split(":").map(Number);

  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
    return "Hora no disponible";
  }

  const period = hourValue >= 12 ? "p. m." : "a. m.";
  const hour12 = hourValue % 12 || 12;

  return `${hour12}:${String(minuteValue).padStart(2, "0")} ${period}`;
}

export function isWeatherCitySlug(value: string | null | undefined): value is WeatherCitySlug {
  return value === "bogota" || value === "medellin";
}

export function getWeatherCondition(code: number | null | undefined) {
  if (typeof code !== "number") {
    return { es: "Clima no disponible", en: "Weather unavailable" };
  }

  return weatherCodeMap[code] ?? { es: "Condicion variable", en: "Variable conditions" };
}

export async function getCityWeather(citySlug: WeatherCitySlug): Promise<CityWeatherData> {
  const profile = cityWeatherProfiles[citySlug];
  const params = new URLSearchParams({
    latitude: String(profile.latitude),
    longitude: String(profile.longitude),
    current: "temperature_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,is_day",
    timezone: profile.timezone,
    forecast_days: "1"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo weather request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as OpenMeteoResponse;
  const current = payload.current ?? {};
  const weatherCode = typeof current.weather_code === "number" ? current.weather_code : null;
  const condition = getWeatherCondition(weatherCode);
  const localTime = current.time ?? new Date().toISOString();

  return {
    citySlug,
    cityName: profile.name,
    latitude: profile.latitude,
    longitude: profile.longitude,
    altitudeMeters: profile.altitudeMeters,
    timezone: profile.timezone,
    localTime,
    localTimeLabel: formatLocalTimeLabel(localTime),
    temperatureC: typeof current.temperature_2m === "number" ? current.temperature_2m : null,
    apparentTemperatureC:
      typeof current.apparent_temperature === "number" ? current.apparent_temperature : null,
    weatherCode,
    conditionEs: condition.es,
    conditionEn: condition.en,
    cloudCover: typeof current.cloud_cover === "number" ? current.cloud_cover : null,
    windSpeedKmh: typeof current.wind_speed_10m === "number" ? current.wind_speed_10m : null,
    isDay: typeof current.is_day === "number" ? current.is_day === 1 : null,
    source: "open-meteo"
  };
}
