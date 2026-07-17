"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Luggage,
  MapPinned,
  Plane,
  Users
} from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import type {
  AirportDirection,
  BookingLanguage,
  RoutePricingResponse
} from "@/components/booking/booking-types";
import { PlaceAutocompleteInput } from "@/components/booking/place-autocomplete-input";
import { QuantitySelector } from "@/components/booking/quantity-selector";
import { RouteMiniMap } from "@/components/booking/route-mini-map";
import { VehicleSelector } from "@/components/booking/vehicle-selector";
import { Price } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ReservationInput } from "@/lib/domain/schemas";
import { COP_PER_KM } from "@/lib/services/pricing";
import { cn } from "@/lib/utils";

export type TripStepValues = Pick<
  ReservationInput,
  | "cityId"
  | "serviceId"
  | "date"
  | "time"
  | "passengers"
  | "luggage"
  | "hours"
  | "distanceKm"
  | "pickup"
  | "dropoff"
  | "originPlaceId"
  | "destinationPlaceId"
  | "vehicleType"
>;

export function TripStep({
  values,
  language,
  errors,
  apiKey,
  airport,
  airportDirection,
  flightNumber,
  mobilityNeeds,
  minimumPassengers,
  routeData,
  routeCalculating,
  departureAt,
  onValueChange,
  onAirportDirectionChange,
  onFlightNumberChange,
  onMobilityNeedsChange,
  onBack,
  onContinue
}: {
  values: TripStepValues;
  language: BookingLanguage;
  errors: FieldErrors<ReservationInput>;
  apiKey?: string;
  airport: string;
  airportDirection: AirportDirection;
  flightNumber: string;
  mobilityNeeds: string;
  minimumPassengers: number;
  routeData?: RoutePricingResponse;
  routeCalculating: boolean;
  departureAt?: string;
  onValueChange: <K extends keyof TripStepValues>(key: K, value: TripStepValues[K]) => void;
  onAirportDirectionChange: (value: AirportDirection) => void;
  onFlightNumberChange: (value: string) => void;
  onMobilityNeedsChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const isAirport = values.serviceId === "airport-transfer";
  const isTour = values.serviceId === "private-tours";
  const isHourly = values.serviceId === "hourly";
  const isMedical = values.serviceId === "medical-tourism";
  const isTransfer = values.serviceId === "transfers";
  const showsLuggage = isAirport || isTransfer || isMedical;
  const hasMapRoute = values.pickup.trim().length >= 4 && values.dropoff.trim().length >= 4;
  const transferBaseAmount = routeData && isTransfer
    ? Math.round(routeData.distanceKm * COP_PER_KM)
    : 0;

  return (
    <section aria-labelledby="trip-title">
      <h2 id="trip-title" className="text-2xl font-bold sm:text-3xl">
        {language === "EN" ? "Complete your trip" : "Completa tu recorrido"}
      </h2>

      {isAirport ? (
        <fieldset className="mt-8">
          <legend className="text-sm font-bold">{language === "EN" ? "Airport direction" : "Sentido del traslado"}</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {([
              ["from-airport", language === "EN" ? "From the airport" : "Desde el aeropuerto"],
              ["to-airport", language === "EN" ? "To the airport" : "Hacia el aeropuerto"]
            ] as const).map(([direction, label]) => (
              <button
                key={direction}
                type="button"
                aria-pressed={airportDirection === direction}
                onClick={() => onAirportDirectionChange(direction)}
                className={cn(
                  "focus-ring flex min-h-12 items-center gap-3 border bg-card px-4 text-left text-sm font-semibold",
                  airportDirection === direction && "border-primary bg-primary/[0.06]"
                )}
              >
                <Plane className="size-4 text-primary" aria-hidden /> {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{airport}</p>
        </fieldset>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {isHourly ? (
          <Field label={language === "EN" ? "Booked hours" : "Horas contratadas"} id="hours" error={errors.hours?.message}>
            <Input id="hours" type="number" min={1} max={24} value={values.hours ?? 1} onChange={(event) => onValueChange("hours", Number(event.target.value))} aria-invalid={Boolean(errors.hours)} />
          </Field>
        ) : null}

        <Field label={getPickupLabel(values.serviceId, language)} id="pickup" error={errors.pickup?.message}>
          {isAirport && airportDirection === "from-airport" ? (
            <Input id="pickup" value={airport} readOnly />
          ) : (
            <PlaceAutocompleteInput
              id="pickup"
              apiKey={apiKey}
              value={values.pickup}
              placeholder={language === "EN" ? "Search a place in Google Maps" : "Busca un lugar en Google Maps"}
              aria-invalid={Boolean(errors.pickup)}
              onValueChange={(value) => {
                onValueChange("pickup", value);
                onValueChange("originPlaceId", "");
              }}
              onPlaceSelect={(place) => {
                onValueChange("pickup", place.label);
                onValueChange("originPlaceId", place.placeId ?? "");
              }}
            />
          )}
        </Field>

        {!isTour ? <Field label={getDropoffLabel(values.serviceId, language)} id="dropoff" error={errors.dropoff?.message}>
          {isAirport && airportDirection === "to-airport" ? (
            <Input id="dropoff" value={airport} readOnly />
          ) : (
            <PlaceAutocompleteInput
              id="dropoff"
              apiKey={apiKey}
              value={values.dropoff}
              placeholder={isHourly ? (language === "EN" ? "Planned areas or stops" : "Zonas o paradas previstas") : (language === "EN" ? "Search a destination in Google Maps" : "Busca un destino en Google Maps")}
              aria-invalid={Boolean(errors.dropoff)}
              onValueChange={(value) => {
                onValueChange("dropoff", value);
                onValueChange("destinationPlaceId", "");
              }}
              onPlaceSelect={(place) => {
                onValueChange("dropoff", place.label);
                onValueChange("destinationPlaceId", place.placeId ?? "");
              }}
            />
          )}
        </Field> : null}

        {isAirport ? (
          <Field label={language === "EN" ? "Flight number (optional)" : "Número de vuelo (opcional)"} id="flight-number">
            <Input id="flight-number" value={flightNumber} onChange={(event) => onFlightNumberChange(event.target.value)} placeholder="AV123" />
          </Field>
        ) : null}

        <Field label={language === "EN" ? "Date" : "Fecha"} id="date" error={errors.date?.message}>
          <Input id="date" type="date" value={values.date} onChange={(event) => onValueChange("date", event.target.value)} aria-invalid={Boolean(errors.date)} />
        </Field>
        <Field label={language === "EN" ? "Time" : "Hora"} id="time" error={errors.time?.message}>
          <Input id="time" type="time" value={values.time} onChange={(event) => onValueChange("time", event.target.value)} aria-invalid={Boolean(errors.time)} />
        </Field>
      </div>

      {isMedical ? (
        <div className="mt-5">
          <Field label={language === "EN" ? "Mobility needs (optional)" : "Necesidades de movilidad (opcional)"} id="mobility-needs">
            <Textarea id="mobility-needs" value={mobilityNeeds} onChange={(event) => onMobilityNeedsChange(event.target.value)} placeholder={language === "EN" ? "Only share information needed for safe transport." : "Comparte solo la información necesaria para una movilidad segura."} />
          </Field>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {language === "EN" ? "Do not include diagnoses or full medical records." : "No incluyas diagnósticos ni historias clínicas completas."}
          </p>
        </div>
      ) : null}

      <div className={cn("mt-8 grid gap-5", showsLuggage && "sm:grid-cols-2")}>
        <QuantitySelector id="passengers" label={language === "EN" ? "Passengers" : "Pasajeros"} value={values.passengers} min={minimumPassengers} max={50} icon={Users} onChange={(value) => onValueChange("passengers", value)} />
        {showsLuggage ? <QuantitySelector id="luggage" label={language === "EN" ? "Luggage" : "Equipaje"} value={values.luggage} min={0} max={80} icon={Luggage} onChange={(value) => onValueChange("luggage", value)} /> : null}
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-bold">{language === "EN" ? "Vehicle" : "Vehículo"}</legend>
        <div className="mt-3">
          <VehicleSelector
            value={values.vehicleType}
            passengers={values.passengers}
            luggage={values.luggage}
            serviceId={values.serviceId}
            language={language}
            onChange={(value) => onValueChange("vehicleType", value)}
          />
        </div>
        {errors.vehicleType?.message ? <p className="mt-2 text-sm text-destructive">{errors.vehicleType.message}</p> : null}
      </fieldset>

      <div className="mt-8">
          <div className="mb-3">
            <p className="flex items-center gap-2 font-bold"><MapPinned className="size-4 text-primary" aria-hidden /> {language === "EN" ? "Route and price" : "Recorrido y precio"}</p>
            <p className="mt-1 text-sm text-muted-foreground" role="status">
              {routeCalculating
                ? (language === "EN" ? "Calculating with Google Maps..." : "Calculando con Google Maps...")
                : hasMapRoute
                  ? (language === "EN" ? "The route updates automatically." : "La ruta se actualiza automáticamente.")
                  : (language === "EN" ? "Enter origin and destination to see the route." : "Completa origen y destino para ver la ruta.")}
            </p>
          </div>
          {hasMapRoute ? (
          <RouteMiniMap
            apiKey={apiKey}
            cityId={values.cityId}
            departureAt={departureAt}
            destination={values.dropoff}
            destinationPlaceId={values.destinationPlaceId}
            enabled
            language={language}
            origin={values.pickup}
            originPlaceId={values.originPlaceId}
          />
          ) : null}
          {routeData ? (
            <div className={cn("mt-3 grid gap-3 border bg-muted/45 p-4 text-sm", isTransfer ? "sm:grid-cols-3" : "sm:grid-cols-2")} aria-live="polite">
              <span>
                <strong>{routeData.distanceKm.toFixed(1)} km</strong>
                <span className="block text-xs text-muted-foreground">{language === "EN" ? "Distance" : "Distancia"}</span>
              </span>
              {isTransfer ? (
                <span>
                  <strong>{routeData.distanceKm.toFixed(1)} km × COP $4.500</strong>
                  <span className="block text-xs text-muted-foreground">
                    {language === "EN" ? "Base price: " : "Precio base: "}<Price value={transferBaseAmount} />
                  </span>
                </span>
              ) : null}
              <span>
                <strong>{routeData.durationText ?? "-"}</strong>
                <span className="block text-xs text-muted-foreground">{language === "EN" ? "Estimated duration" : "Duración estimada"}</span>
              </span>
            </div>
          ) : null}
          {isTour ? (
            <p className="mt-3 rounded-md bg-primary/[0.06] p-3 text-sm text-muted-foreground">
              {language === "EN"
                ? "Reference route. The tour price remains as published."
                : "Ruta referencial. El precio del tour se mantiene según la tarifa publicada."}
            </p>
          ) : null}
        </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" size="lg" variant="outline" onClick={onBack}><ArrowLeft className="size-4" aria-hidden /> {language === "EN" ? "Back" : "Volver"}</Button>
        <Button type="button" size="lg" onClick={onContinue} disabled={routeCalculating}><CalendarDays className="size-4" aria-hidden /> {language === "EN" ? "Review and continue" : "Revisar y continuar"} <ArrowRight className="size-4" aria-hidden /></Button>
      </div>
    </section>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  const errorId = `${id}-error`;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p id={errorId} className="mt-2 text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}

function getPickupLabel(serviceId: string, language: BookingLanguage) {
  if (serviceId === "hourly") return language === "EN" ? "Starting point" : "Lugar de inicio";
  if (serviceId === "medical-tourism") return language === "EN" ? "Pickup: clinic, hotel or airport" : "Recogida: clínica, hotel o aeropuerto";
  return language === "EN" ? "Pickup" : "Recogida";
}

function getDropoffLabel(serviceId: string, language: BookingLanguage) {
  if (serviceId === "private-tours") return language === "EN" ? "Selected tour" : "Tour seleccionado";
  if (serviceId === "hourly") return language === "EN" ? "Planned areas or stops" : "Zonas o paradas previstas";
  return language === "EN" ? "Destination" : "Destino";
}
