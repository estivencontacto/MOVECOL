"use client";

import { useEffect, useState } from "react";
import { Activity, CloudSun, Clock, Sparkles } from "lucide-react";

type WeatherResponse = {
  temperatureC: number | null;
  conditionEs: string;
  conditionEn: string;
};

export function TourConditionBanner({
  citySlug,
  duration,
  recommendation,
  physicalDemand
}: {
  citySlug: string;
  duration: string;
  recommendation: string;
  physicalDemand: string;
}) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/city-weather?city=${encodeURIComponent(citySlug)}`, {
      signal: controller.signal
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: WeatherResponse | null) => setWeather(data))
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setWeather(null);
      });

    return () => controller.abort();
  }, [citySlug]);

  const weatherLabel =
    typeof weather?.temperatureC === "number"
      ? `${Math.round(weather.temperatureC)} °C · ${weather.conditionEs}`
      : "Consultando clima actual";

  const items = [
    { icon: Clock, label: "Duracion", value: duration },
    { icon: CloudSun, label: "Clima", value: weatherLabel },
    { icon: Sparkles, label: "Recomendaciones", value: recommendation },
    { icon: Activity, label: "Exigencia fisica", value: physicalDemand }
  ];

  return (
    <section className="relative z-10 -mt-10">
      <div className="container">
        <div className="grid gap-3 rounded-lg border bg-white p-3 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.65)] md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-md bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <item.icon className="size-4 text-primary" aria-hidden />
                {item.label}
              </div>
              <p className="mt-2 text-sm font-semibold leading-5 text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
