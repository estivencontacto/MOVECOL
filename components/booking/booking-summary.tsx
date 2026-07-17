"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Route, Users } from "lucide-react";
import type { BookingLanguage, RoutePricingResponse } from "@/components/booking/booking-types";
import { Price } from "@/components/preferences/site-preferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cities, services, tours, vehicles } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import type { PriceEstimate } from "@/lib/services/pricing";

export function BookingSummary({
  values,
  estimate,
  routeData,
  routePending,
  language,
  className
}: {
  values: ReservationInput;
  estimate: PriceEstimate;
  routeData?: RoutePricingResponse;
  routePending: boolean;
  language: BookingLanguage;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{language === "EN" ? "Booking summary" : "Resumen de reserva"}</CardTitle>
      </CardHeader>
      <CardContent>
        <BookingSummaryDetails
          values={values}
          estimate={estimate}
          routeData={routeData}
          routePending={routePending}
          language={language}
        />
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
}: {
  values: ReservationInput;
  estimate: PriceEstimate;
  routeData?: RoutePricingResponse;
  routePending: boolean;
  language: BookingLanguage;
}) {
  const city = cities.find((item) => item.id === values.cityId);
  const service = services.find((item) => item.id === values.serviceId);
  const tour = tours.find((item) => item.id === values.tourId);
  const vehicle = vehicles.find((item) => item.type === values.vehicleType);

  return (
    <div className="space-y-5 text-sm">
      <div className="space-y-3">
        <SummaryRow label={language === "EN" ? "City" : "Ciudad"} value={city?.id === "bogota" ? "Bogotá" : "Medellín"} />
        <SummaryRow label={language === "EN" ? "Service" : "Servicio"} value={formatService(service?.id, service?.title, language)} />
        {tour ? <SummaryRow label="Tour" value={tour.name} /> : null}
        <SummaryRow label={language === "EN" ? "Date and time" : "Fecha y hora"} value={values.date ? `${values.date} · ${values.time}` : "-"} />
        <SummaryRow label={language === "EN" ? "Pickup" : "Recogida"} value={values.pickup || "-"} />
        <SummaryRow label={language === "EN" ? "Destination" : "Destino"} value={values.dropoff || "-"} />
        <SummaryRow label={language === "EN" ? "Passengers" : "Pasajeros"} value={String(values.passengers)} />
        <SummaryRow label={language === "EN" ? "Luggage" : "Equipaje"} value={String(values.luggage)} />
        <SummaryRow label={language === "EN" ? "Vehicle" : "Vehículo"} value={vehicle?.name ?? "-"} />
        <SummaryRow
          label={language === "EN" ? "Price mode" : "Modalidad"}
          value={tour ? (tour.pricingMode === "global" ? (language === "EN" ? "Global price" : "Precio global") : (language === "EN" ? "Per person" : "Por persona")) : (language === "EN" ? "Service estimate" : "Estimado del servicio")}
        />
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

      {!estimate.quoteOnly ? <div className="border-t pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={estimate.amount}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            aria-live="polite"
          >
            <div className="space-y-2">
              {estimate.breakdown.map((item) => (
                <SummaryRow key={item.label} label={translateBreakdown(item.label, language)} valueNode={<Price value={item.amount} />} />
              ))}
              <SummaryRow label={language === "EN" ? "Subtotal" : "Subtotal"} valueNode={<Price value={estimate.subtotal} />} strong />
            </div>
            <div className="mt-4 flex items-end justify-between gap-4 border-t pt-4">
              <span className="font-bold">{language === "EN" ? "Total" : "Total"}</span>
              <Price value={estimate.amount} className="text-2xl font-black" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div> : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueNode,
  strong = false
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={`max-w-[58%] text-right ${strong ? "font-bold" : "font-medium"}`}>
        {valueNode ?? value}
      </span>
    </div>
  );
}

function translateBreakdown(label: string, language: BookingLanguage) {
  if (language === "ES") return label;
  const labels: Record<string, string> = {
    "Precio del servicio": "Service price",
    "Descuento upsell (5%)": "Upsell discount (5%)",
    "Uso pasarela de pago (5%)": "Payment gateway fee (5%)"
  };
  return labels[label] ?? label;
}

function formatService(id: string | undefined, fallback: string | undefined, language: BookingLanguage) {
  const labels: Record<string, { ES: string; EN: string }> = {
    "airport-transfer": { ES: "Traslado aeropuerto", EN: "Airport transfer" },
    transfers: { ES: "Traslados", EN: "Transfers" },
    "private-tours": { ES: "Tours privados", EN: "Private tours" },
    hourly: { ES: "Servicio por horas", EN: "Hourly service" },
    "medical-tourism": { ES: "Turismo médico", EN: "Medical travel" },
    corporate: { ES: "Transporte corporativo", EN: "Corporate transport" },
    events: { ES: "Eventos", EN: "Events" }
  };
  return id ? labels[id]?.[language] ?? fallback ?? "-" : "-";
}
