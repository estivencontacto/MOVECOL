"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Currency = "COP" | "USD";
type Language = "ES" | "EN";

const currencyKey = "move_currency";
const languageKey = "move_language";
const eventName = "move-preferences";
let usdCopRateCache = 4000;
let usdCopRatePromise: Promise<number> | null = null;

export function PreferenceSwitcher() {
  const [currency, setCurrency] = useCurrency();
  const [language, setLanguage] = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-1 text-xs text-foreground">
      {(["ES", "EN"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLanguage(value)}
          className={language === value ? "rounded bg-primary px-2 py-1 text-primary-foreground" : "px-2 py-1"}
        >
          {value}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-border" />
      {(["COP", "USD"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setCurrency(value)}
          className={currency === value ? "rounded bg-primary px-2 py-1 text-primary-foreground" : "px-2 py-1"}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

export function Price({ value, className }: { value: number; className?: string }) {
  const [currency] = useCurrency();
  const [usdCopRate, setUsdCopRate] = useState(usdCopRateCache);

  useEffect(() => {
    if (currency !== "USD") return;

    getUsdCopRate().then(setUsdCopRate);
  }, [currency]);

  const displayValue = currency === "USD" ? value / usdCopRate : value;

  return <span className={className}>{formatCurrency(displayValue, currency)}</span>;
}

export function useCurrency() {
  return usePreference<Currency>(currencyKey, "COP");
}

export function useLanguage() {
  return usePreference<Language>(languageKey, "ES");
}

export function copy<T extends Record<Language, string>>(value: T, language: Language) {
  return value[language];
}

async function getUsdCopRate() {
  if (!usdCopRatePromise) {
    usdCopRatePromise = fetch("/api/exchange-rate")
      .then((response) => response.json())
      .then((data: { usdCopRate?: number }) => {
        if (data.usdCopRate && Number.isFinite(data.usdCopRate)) {
          usdCopRateCache = data.usdCopRate;
        }
        return usdCopRateCache;
      })
      .catch(() => usdCopRateCache);
  }

  return usdCopRatePromise;
}

function usePreference<T extends string>(key: string, fallback: T) {
  const [value, setValueState] = useState<T>(fallback);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(key) as T | null;
    if (storedValue) setValueState(storedValue);

    const sync = () => {
      const nextValue = window.localStorage.getItem(key) as T | null;
      setValueState(nextValue ?? fallback);
    };

    window.addEventListener("storage", sync);
    window.addEventListener(eventName, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(eventName, sync);
    };
  }, [fallback, key]);

  const setValue = (nextValue: T) => {
    window.localStorage.setItem(key, nextValue);
    setValueState(nextValue);
    window.dispatchEvent(new Event(eventName));
  };

  return [value, setValue] as const;
}
