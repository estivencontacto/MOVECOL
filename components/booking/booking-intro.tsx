"use client";

import { useLanguage } from "@/components/preferences/site-preferences";

export function BookingIntro() {
  const [language] = useLanguage();

  return (
    <div className="mb-6 flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-4xl">
          {language === "EN" ? "Book your MOVE journey" : "Reserva tu recorrido MOVE"}
        </h1>
      </div>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
        {language === "EN"
          ? "Choose, complete your trip, review the price and pay."
          : "Selecciona, completa tu recorrido, revisa el precio y paga."}
      </p>
    </div>
  );
}
