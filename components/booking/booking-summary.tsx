"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Route, Users } from "lucide-react";
import type {
  BookingLanguage,
  PublicPriceEstimate,
  RoutePricingResponse
} from "@/components/booking/booking-types";
import { Price } from "@/components/preferences/site-preferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cities, services, tours, vehicles } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";

type SummaryProps = {
  values: ReservationInput;
  estimate: PublicPriceEstimate;
  routeData?: RoutePricingResponse;
  routePending: boolean;
  language: BookingLanguage;
};

export function BookingSummary(props: SummaryProps & { className?: string }) {
  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>{props.language === "EN" ? "Booking summary" : "Resumen de reserva"}</CardTitle>
      </CardHeader>
      <CardContent>
        <BookingSummaryDetails {...props} />
      </CardContent>
    </Card>
  );
}

export function BookingSummaryDetails({
  values,
  estimate,
  routeData,
  routePending,
  language
}: SummaryProps) {
  const city = cities.find((item) => item.id === values.cityId);
  const service = services.find((item) => item.id === values.serviceId);
  const tour = tours.find((item) => item.id === values.tourId);
  const vehicle = vehicles.find((item) => item.type === values.vehicleType);
  const showsLuggage = ["airport-transfer", "transfers", "medical-tourism"].includes(values.serviceId);
  const needsRoutePrice = ["airport-transfer", "transfers"].includes(values.serviceId);

  return (
    <div className="space-y-5 text-sm">
      <div className="space-y-3">
        <SummaryRow label={language === "EN" ? "City" : "Ciudad"} value={city?.id === "bogota" ? "Bogotá" : "Medellín"} />
        <SummaryRow label={language === "EN" ? "Service" : "Servicio"} value={service?.title ?? "-"} />
        {tour ? <SummaryRow label="Tour" value={tour.name} /> : null}
        {values.date ? <SummaryRow label={language === "EN" ? "Date and time" : "Fecha y hora"} value={`${values.date} · ${values.time}`} /> : null}
        {values.pickup ? <SummaryRow label={language === "EN" ? "Pickup" : "Recogida"} value={values.pickup} /> : null}
        {!tour && values.dropoff ? <SummaryRow label={language === "EN" ? "Destination" : "Destino"} value={values.dropoff} /> : null}
        <SummaryRow label={language === "EN" ? "Passengers" : "Pasajeros"} value={String(values.passengers)} />
        {showsLuggage ? <SummaryRow label={language === "EN" ? "Luggage" : "Equipaje"} value={String(values.luggage)} /> : null}
        <SummaryRow label={language === "EN" ? "Vehicle" : "Vehículo"} value={vehicle?.name ?? "-"} />
      </div>

      {routeData ? (
        <div className="grid grid-cols-2 gap-3 border-y py-4 text-xs">
          <span className="flex items-center gap-2"><Route className="size-4 text-primary" aria-hidden /> {routeData.distanceKm.toFixed(1)} km</span>
          <span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" aria-hidden /> {routeData.durationText ?? "-"}</span>
        </div>
      ) : null}

      {routePending ? (
        <p className="flex gap-2 bg-secondary/15 p-3 text-xs font-semibold">
          <AlertTriangle className="size-4 shrink-0 text-primary" aria-hidden />
          {language === "EN" ? "Route estimate pending" : "Estimado pendiente de ruta"}
        </p>
      ) : null}

      {estimate.quoteOnly ? (
        <p className="flex gap-2 bg-muted p-3 text-xs font-semibold">
          <Users className="size-4 shrink-0 text-primary" aria-hidden />
          {language === "EN" ? "Price and availability to confirm" : "Precio y disponibilidad por confirmar"}
        </p>
      ) : null}

      {!estimate.quoteOnly && estimate.total > 0 && (!needsRoutePrice || routeData) ? (
        <div className="border-t pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={estimate.total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="flex items-end justify-between gap-4"
              aria-live="polite"
            >
              <span className="font-bold">Total</span>
              <Price value={estimate.total} className="text-2xl font-black" />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[58%] text-right font-medium">{value}</span>
    </div>
  );
}
