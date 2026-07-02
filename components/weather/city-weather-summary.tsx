"use client";

import { useEffect, useState } from "react";
import { CloudSun, Clock3, Mountain, ThermometerSun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type WeatherResponse = {
  cityName: string;
  altitudeMeters: number;
  localTimeLabel: string;
  temperatureC: number | null;
  conditionEs: string;
  conditionEn: string;
};

type WeatherLabels = {
  weather: string;
  localTime: string;
  altitude: string;
  loading: string;
  unavailable: string;
};

export function CityWeatherSummary({
  citySlug,
  language,
  labels,
  variant = "light"
}: {
  citySlug: string;
  language: "ES" | "EN";
  labels: WeatherLabels;
  variant?: "light" | "dark";
}) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    fetch(`/api/city-weather?city=${encodeURIComponent(citySlug)}`, {
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error("Weather unavailable");
        return response.json() as Promise<WeatherResponse>;
      })
      .then((data) => {
        setWeather(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [citySlug]);

  const mutedText = variant === "dark" ? "text-white/62" : "text-muted-foreground";
  const tileClass =
    variant === "dark"
      ? "rounded-md border border-white/12 bg-white/10 p-3 text-white backdrop-blur"
      : "rounded-md border bg-muted/50 p-3 text-foreground";

  if (status === "error") {
    return (
      <div className={tileClass}>
        <p className={`text-xs font-semibold uppercase ${mutedText}`}>{labels.weather}</p>
        <p className="mt-1 text-sm font-semibold">{labels.unavailable}</p>
      </div>
    );
  }

  const condition = language === "EN" ? weather?.conditionEn : weather?.conditionEs;
  const temperature = typeof weather?.temperatureC === "number" ? `${Math.round(weather.temperatureC)} °C` : "--";

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      <WeatherMetric
        icon={ThermometerSun}
        label={labels.weather}
        value={status === "loading" ? labels.loading : temperature}
        detail={status === "loading" ? "" : condition}
        className={tileClass}
        mutedClassName={mutedText}
      />
      <WeatherMetric
        icon={CloudSun}
        label={language === "EN" ? "Sky" : "Estado"}
        value={status === "loading" ? labels.loading : condition ?? labels.unavailable}
        className={tileClass}
        mutedClassName={mutedText}
      />
      <WeatherMetric
        icon={Clock3}
        label={labels.localTime}
        value={status === "loading" ? "--" : weather?.localTimeLabel ?? "--"}
        className={tileClass}
        mutedClassName={mutedText}
      />
      <WeatherMetric
        icon={Mountain}
        label={labels.altitude}
        value={status === "loading" ? "--" : `${weather?.altitudeMeters.toLocaleString("es-CO")} msnm`}
        className={tileClass}
        mutedClassName={mutedText}
      />
    </div>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
  detail,
  className,
  mutedClassName
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  className: string;
  mutedClassName: string;
}) {
  return (
    <div className={className}>
      <div className={`flex items-center gap-1.5 text-[0.66rem] font-bold uppercase ${mutedClassName}`}>
        <Icon className="size-3.5" aria-hidden />
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      {detail ? <p className={`mt-0.5 truncate text-xs ${mutedClassName}`}>{detail}</p> : null}
    </div>
  );
}
