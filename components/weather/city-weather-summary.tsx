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
  altitudeMeters,
  timeZone,
  variant = "light"
}: {
  citySlug: string;
  language: "ES" | "EN";
  labels: WeatherLabels;
  altitudeMeters?: number;
  timeZone?: string;
  variant?: "light" | "dark";
}) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [fallbackTime, setFallbackTime] = useState(() => formatLocalTime(timeZone, language));

  useEffect(() => {
    const updateTime = () => setFallbackTime(formatLocalTime(timeZone, language));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, [language, timeZone]);

  useEffect(() => {
    const controller = new AbortController();
    setWeather(null);
    setStatus("loading");

    fetch(`/api/city-weather?city=${encodeURIComponent(citySlug)}`, { signal: controller.signal })
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

  const mutedText = variant === "dark" ? "text-white/65" : "text-muted-foreground";
  const tileClass = variant === "dark"
    ? "rounded-md border border-white/12 bg-white/10 p-3 text-white backdrop-blur"
    : "rounded-md border bg-muted/50 p-3 text-foreground";
  const condition = language === "EN" ? weather?.conditionEn : weather?.conditionEs;
  const temperature = typeof weather?.temperatureC === "number"
    ? `${Math.round(weather.temperatureC)} °C`
    : status === "error" ? labels.unavailable : "--";
  const localTime = weather?.localTimeLabel ?? fallbackTime;
  const altitude = weather?.altitudeMeters ?? altitudeMeters;

  return (
    <div>
      {status === "loading" ? (
        <p className={`mb-2 text-xs font-semibold ${mutedText}`} role="status">
          {labels.loading}
        </p>
      ) : status === "error" ? (
        <p className={`mb-2 text-xs font-semibold ${mutedText}`} role="status">
          {labels.unavailable}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WeatherMetric icon={ThermometerSun} label={labels.weather} value={temperature} detail={condition} loading={status === "loading"} className={tileClass} mutedClassName={mutedText} />
        <WeatherMetric icon={CloudSun} label={language === "EN" ? "Sky" : "Estado"} value={condition ?? (status === "error" ? labels.unavailable : "--")} loading={status === "loading"} className={tileClass} mutedClassName={mutedText} />
        <WeatherMetric icon={Clock3} label={labels.localTime} value={localTime} loading={status === "loading"} className={tileClass} mutedClassName={mutedText} />
        <WeatherMetric icon={Mountain} label={labels.altitude} value={typeof altitude === "number" ? `${altitude.toLocaleString("es-CO")} msnm` : "--"} loading={status === "loading"} className={tileClass} mutedClassName={mutedText} />
      </div>
    </div>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
  detail,
  loading,
  className,
  mutedClassName
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  loading: boolean;
  className: string;
  mutedClassName: string;
}) {
  return (
    <div className={className}>
      <div className={`flex items-center gap-1.5 text-[0.66rem] font-bold uppercase ${mutedClassName}`}>
        <Icon className="size-3.5" aria-hidden /> {label}
      </div>
      {loading ? (
        <div className="mt-2 h-4 w-16 animate-pulse rounded bg-current/10 motion-reduce:animate-none" aria-hidden />
      ) : (
        <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      )}
      {!loading && detail ? <p className={`mt-0.5 truncate text-xs ${mutedClassName}`}>{detail}</p> : null}
    </div>
  );
}

function formatLocalTime(timeZone: string | undefined, language: "ES" | "EN") {
  if (!timeZone) return "--";
  return new Intl.DateTimeFormat(language === "EN" ? "en-US" : "es-CO", {
    timeZone,
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}
