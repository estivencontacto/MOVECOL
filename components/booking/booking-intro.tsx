"use client";

import { useLanguage } from "@/components/preferences/site-preferences";

export function BookingIntro() {
  const [language] = useLanguage();

  return (
    <div className="mb-6 flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{language === "EN" ? "Booking" : "Reserva"}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
          {language === "EN" ? "Plan your MOVE journey" : "Planea tu recorrido MOVE"}
        </h1>
      </div>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
        {language === "EN"
          ? "Choose the city and service, review the route in Google Maps and confirm every detail before payment or consultation."
          : "Elige ciudad y servicio, revisa la ruta en Google Maps y confirma cada detalle antes del pago o la consulta."}
      </p>
    </div>
  );
}
