"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CalendarCheck, CheckCircle2, CreditCard, Loader2, MapPinned, Route, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PassengerSelector } from "@/components/booking/passenger-selector";
import { PlaceAutocompleteInput } from "@/components/booking/place-autocomplete-input";
import { RouteMiniMap } from "@/components/booking/route-mini-map";
import { VehicleSelector } from "@/components/booking/vehicle-selector";
import { Price, useLanguage } from "@/components/preferences/site-preferences";
import { cities, services, tours, vehicles } from "@/lib/data/catalog";
import { reservationSchema, type ReservationInput } from "@/lib/domain/schemas";
import { estimateReservationPricing } from "@/lib/services/pricing";

type RoutePricingResponse = {
  distanceKm: number;
  durationText?: string | null;
  originAddress?: string | null;
  destinationAddress?: string | null;
  amount: number;
  subtotal: number;
  gatewayFee: number;
  requiresAvailabilityCheck: boolean;
  breakdown: Array<{ label: string; amount: number }>;
};

const googleMapsBrowserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;

const stepMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.32, ease: "easeOut" }
};

const bookingCopy = {
  ES: {
    routeService: "Ruta y servicio",
    city: "Ciudad",
    service: "Servicio",
    tour: "Tour (opcional)",
    notApply: "No aplica",
    vehicle: "Tipo de vehiculo",
    hours: "Horas contratadas",
    pickup: "Lugar de recogida",
    pickupPlaceholder: "Hotel, clinica, aeropuerto...",
    dropoff: "Destino",
    dropoffPlaceholder: "Direccion o zona destino",
    routePricing: "Liquidacion por ruta",
    routeHelp: "El sistema calcula kilometros, tiempo estimado y trafico con Google Maps.",
    routeButton: "Recalcular ruta",
    routeReady: "Ruta validada",
    mapUnavailable: "Activa la llave publica de Google Maps para ver sugerencias y minimapa.",
    selectGoogleSuggestion: "Elige una sugerencia de Google para mejorar la precision.",
    perPerson: "Por persona, minimo 2",
    globalPrice: "Precio global",
    calculating: "Calculando...",
    route: "Ruta",
    routeFallback: "El backend recalcula la ruta antes del pago.",
    routeTimeHelp: "Selecciona fecha y hora para que Google Maps considere el horario de salida.",
    routeKeyHelp: "Si no aparece el calculo, revisa que `GOOGLE_MAPS_API_KEY` este configurada.",
    schedule: "Fecha, hora y pasajeros",
    date: "Fecha",
    time: "Hora",
    passengers: "Pasajeros",
    luggage: "Equipaje",
    notes: "Observaciones",
    notesPlaceholder: "Numero de vuelo, necesidades medicas, paradas, nombres de pasajeros...",
    contact: "Datos de contacto",
    name: "Nombre",
    fullName: "Nombre completo",
    email: "Correo",
    phone: "Telefono",
    summary: "Resumen",
    capacity: "Capacidad",
    total: "Total estimado",
    totalHelp: "El total final puede variar por disponibilidad, extras o condiciones de ruta.",
    availability: "Van y bus quedan sujetos a verificacion de disponibilidad.",
    creating: "Creando reserva...",
    pay: "Continuar a pago",
    success: "Reserva creada",
    successDescription: "Te enviaremos confirmacion por correo.",
    stepRoute: "Ruta",
    stepSchedule: "Agenda",
    stepContact: "Contacto"
  },
  EN: {
    routeService: "Route and service",
    city: "City",
    service: "Service",
    tour: "Tour (optional)",
    notApply: "Not applicable",
    vehicle: "Vehicle type",
    hours: "Booked hours",
    pickup: "Pickup location",
    pickupPlaceholder: "Hotel, clinic, airport...",
    dropoff: "Destination",
    dropoffPlaceholder: "Address or destination area",
    routePricing: "Route pricing",
    routeHelp: "The system calculates kilometers, estimated time and traffic with Google Maps.",
    routeButton: "Recalculate route",
    routeReady: "Route validated",
    mapUnavailable: "Enable the public Google Maps key to show suggestions and the mini map.",
    selectGoogleSuggestion: "Choose a Google suggestion for better accuracy.",
    perPerson: "Per person, min. 2",
    globalPrice: "Global price",
    calculating: "Calculating...",
    route: "Route",
    routeFallback: "The backend recalculates the route before payment.",
    routeTimeHelp: "Select date and time so Google Maps can consider departure time.",
    routeKeyHelp: "If the estimate does not appear, check that `GOOGLE_MAPS_API_KEY` is configured.",
    schedule: "Date, time and passengers",
    date: "Date",
    time: "Time",
    passengers: "Passengers",
    luggage: "Luggage",
    notes: "Notes",
    notesPlaceholder: "Flight number, medical needs, stops, passenger names...",
    contact: "Contact details",
    name: "Name",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    summary: "Summary",
    capacity: "Capacity",
    total: "Estimated total",
    totalHelp: "Final total may vary due to availability, extras or route conditions.",
    availability: "Vans and buses are subject to availability confirmation.",
    creating: "Creating booking...",
    pay: "Continue to payment",
    success: "Booking created",
    successDescription: "We will email you the confirmation.",
    stepRoute: "Route",
    stepSchedule: "Schedule",
    stepContact: "Contact"
  }
};

export function BookingForm() {
  const [language] = useLanguage();
  const b = bookingCopy[language];
  const form = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      cityId: "medellin",
      serviceId: "airport-transfer",
      tourId: "",
      date: "",
      time: "09:00",
      passengers: 2,
      luggage: 1,
      hours: 1,
      distanceKm: 0,
      pickup: "",
      dropoff: "",
      originPlaceId: "",
      destinationPlaceId: "",
      promoCode: "",
      notes: "",
      vehicleType: "suv",
      customer: {
        fullName: "",
        email: "",
        phone: ""
      }
    }
  });

  const cityId = form.watch("cityId");
  const serviceId = form.watch("serviceId");
  const vehicleType = form.watch("vehicleType");
  const hours = form.watch("hours");
  const distanceKm = form.watch("distanceKm");
  const passengers = form.watch("passengers");
  const pickup = form.watch("pickup");
  const dropoff = form.watch("dropoff");
  const originPlaceId = form.watch("originPlaceId");
  const destinationPlaceId = form.watch("destinationPlaceId");
  const promoCode = form.watch("promoCode");
  const date = form.watch("date");
  const time = form.watch("time");
  const isDistanceService = serviceId === "airport-transfer" || serviceId === "transfers";
  const selectedTours = tours.filter((tour) => tour.citySlug === cityId);
  const selectedTour = tours.find((tour) => tour.id === form.watch("tourId"));
  const selectedVehicle = vehicles.find((vehicle) => vehicle.type === vehicleType);
  const departureAt = date && time ? `${date}T${time}:00-05:00` : undefined;
  const canCalculateRoute = Boolean(
    isDistanceService &&
      !selectedTour &&
      (originPlaceId || pickup.length >= 4) &&
      (destinationPlaceId || dropoff.length >= 4)
  );
  const canShowMiniMap = Boolean(
    googleMapsBrowserKey &&
      (originPlaceId || pickup.length >= 4) &&
      (destinationPlaceId || dropoff.length >= 4)
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    const tourParam = params.get("tour");
    const serviceParam = params.get("service");
    const dateParam = params.get("date");
    const timeParam = params.get("time");
    const passengersParam = params.get("passengers");
    const promoParam = params.get("promo");
    const city = cities.find((item) => item.slug === cityParam || item.id === cityParam);
    const tour = tours.find((item) => item.id === tourParam || item.slug === tourParam);
    const service = services.find((item) => item.id === serviceParam || item.slug === serviceParam);

    if (city) {
      form.setValue("cityId", city.id);
    }

    if (tour) {
      form.setValue("cityId", tour.citySlug);
      form.setValue("tourId", tour.id);
      form.setValue("serviceId", "private-tours");
      form.setValue("dropoff", tour.name);
    }

    if (service && !tour) {
      form.setValue("serviceId", service.id);
    }

    if (dateParam) {
      form.setValue("date", dateParam);
    }

    if (timeParam) {
      form.setValue("time", timeParam);
    }

    if (passengersParam) {
      const passengers = Number(passengersParam);
      if (Number.isFinite(passengers)) {
        form.setValue("passengers", Math.max(2, passengers));
      }
    }

    if (promoParam === "upsell5") {
      form.setValue("promoCode", promoParam);
    }
  }, [form]);

  const estimatedTotal = useMemo(() => {
    return estimateReservationPricing({
      cityId,
      serviceId,
      tourId: selectedTour?.id,
      vehicleType,
      passengers,
      hours,
      distanceKm,
      promoCode
    });
  }, [cityId, selectedTour?.id, serviceId, vehicleType, passengers, hours, distanceKm, promoCode]);

  const mutation = useMutation({
    mutationFn: async (payload: ReservationInput) => {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible crear la reserva");
      }
      return data as { id: string; checkoutUrl?: string };
    },
    onSuccess: (data) => {
      toast.success(b.success, {
        description: b.successDescription
      });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error("Revisa la reserva", {
        description: error.message
      });
    }
  });

  const routeMutation = useMutation({
    mutationFn: async () => {
      const values = form.getValues();
      const response = await fetch("/api/pricing/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: values.cityId,
          serviceId: values.serviceId,
          origin: values.pickup,
          destination: values.dropoff,
          originPlaceId: values.originPlaceId,
          destinationPlaceId: values.destinationPlaceId,
          vehicleType: values.vehicleType,
          passengers: values.passengers,
          departureAt
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible calcular la ruta");
      }
      return data as RoutePricingResponse;
    },
    onSuccess: (data) => {
      form.setValue("distanceKm", Number(data.distanceKm.toFixed(1)), {
        shouldDirty: true,
        shouldValidate: true
      });
      toast.success("Ruta calculada", {
        description: `${data.distanceKm.toFixed(1)} km${data.durationText ? ` - ${data.durationText}` : ""}`
      });
    },
    onError: (error) => {
      toast.error("No se pudo calcular la ruta", {
        description: error.message
      });
    }
  });

  useEffect(() => {
    if (
      !isDistanceService ||
      selectedTour ||
      (!originPlaceId && pickup.length < 4) ||
      (!destinationPlaceId && dropoff.length < 4)
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      routeMutation.mutate();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [cityId, date, destinationPlaceId, dropoff, isDistanceService, originPlaceId, pickup, selectedTour, serviceId, time, vehicleType]);

  return (
    <motion.form
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <input type="hidden" {...form.register("originPlaceId")} />
      <input type="hidden" {...form.register("destinationPlaceId")} />
      <input type="hidden" {...form.register("promoCode")} />
      <input type="hidden" {...form.register("passengers", { valueAsNumber: true })} />
      <input type="hidden" {...form.register("vehicleType")} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: b.stepRoute, icon: Route, active: true },
              { label: b.stepSchedule, icon: CalendarCheck, active: Boolean(date && time) },
              { label: b.stepContact, icon: UserRound, active: form.formState.isSubmitted || Boolean(form.watch("customer.fullName")) }
            ].map((step, index) => (
              <div
                key={step.label}
                className={step.active ? "rounded-lg border border-primary/30 bg-primary/[0.08] p-3" : "rounded-lg border bg-card p-3"}
              >
                <div className="flex items-center gap-3">
                  <span className={step.active ? "grid size-8 place-items-center rounded-md bg-primary text-primary-foreground" : "grid size-8 place-items-center rounded-md bg-muted text-muted-foreground"}>
                    <step.icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                    <p className="text-sm font-semibold">{step.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
          <motion.div key={`route-${cityId}-${serviceId}-${selectedTour?.id ?? "none"}`} {...stepMotion}>
          <Card className="overflow-hidden border-primary/12 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="size-5" aria-hidden />
                {b.routeService}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field label={b.city} error={form.formState.errors.cityId?.message}>
                <Select {...form.register("cityId")}>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={b.service} error={form.formState.errors.serviceId?.message}>
                <Select {...form.register("serviceId")}>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={b.tour}>
                <Select {...form.register("tourId")}>
                  <option value="">{b.notApply}</option>
                  {selectedTours.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.name}
                    </option>
                  ))}
                </Select>
              </Field>
              {serviceId === "hourly" ? (
                <Field label={b.hours} error={form.formState.errors.hours?.message}>
                  <Input type="number" min={1} max={24} step={1} {...form.register("hours", { valueAsNumber: true })} />
                </Field>
              ) : null}
              <Field label={b.pickup} error={form.formState.errors.pickup?.message}>
                {googleMapsBrowserKey ? (
                  <PlaceAutocompleteInput
                    apiKey={googleMapsBrowserKey}
                    value={pickup}
                    placeholder={b.pickupPlaceholder}
                    onValueChange={(value) => {
                      form.setValue("pickup", value, { shouldDirty: true, shouldValidate: true });
                      form.setValue("originPlaceId", "");
                      form.setValue("distanceKm", 0);
                      routeMutation.reset();
                    }}
                    onPlaceSelect={(place) => {
                      form.setValue("pickup", place.label, { shouldDirty: true, shouldValidate: true });
                      form.setValue("originPlaceId", place.placeId ?? "");
                    }}
                  />
                ) : (
                  <Input placeholder={b.pickupPlaceholder} {...form.register("pickup")} />
                )}
              </Field>
              <Field label={b.dropoff} error={form.formState.errors.dropoff?.message}>
                {googleMapsBrowserKey && !selectedTour ? (
                  <PlaceAutocompleteInput
                    apiKey={googleMapsBrowserKey}
                    value={dropoff}
                    placeholder={b.dropoffPlaceholder}
                    onValueChange={(value) => {
                      form.setValue("dropoff", value, { shouldDirty: true, shouldValidate: true });
                      form.setValue("destinationPlaceId", "");
                      form.setValue("distanceKm", 0);
                      routeMutation.reset();
                    }}
                    onPlaceSelect={(place) => {
                      form.setValue("dropoff", place.label, { shouldDirty: true, shouldValidate: true });
                      form.setValue("destinationPlaceId", place.placeId ?? "");
                    }}
                  />
                ) : (
                  <Input placeholder={b.dropoffPlaceholder} {...form.register("dropoff")} />
                )}
              </Field>
              {isDistanceService && !selectedTour ? (
                <div className="rounded-lg border bg-background p-4 md:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{routeMutation.data ? b.routeReady : b.routePricing}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {googleMapsBrowserKey ? b.routeHelp : b.mapUnavailable}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => routeMutation.mutate()}
                      disabled={routeMutation.isPending || !canCalculateRoute}
                    >
                      {routeMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          {b.calculating}
                        </>
                      ) : (
                        b.routeButton
                      )}
                    </Button>
                  </div>
                  <div className="mt-4">
                    <RouteMiniMap
                      apiKey={googleMapsBrowserKey}
                      cityId={cityId}
                      departureAt={departureAt}
                      destination={dropoff}
                      destinationPlaceId={destinationPlaceId}
                      enabled={isDistanceService && !selectedTour}
                      language={language}
                      origin={pickup}
                      originPlaceId={originPlaceId}
                    />
                  </div>
                  {routeMutation.data ? (
                    <div className="mt-4 grid gap-2 rounded-lg bg-muted/55 p-3 text-sm sm:grid-cols-3">
                      <span className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="size-4 text-primary" aria-hidden />
                        {routeMutation.data.distanceKm.toFixed(1)} km
                      </span>
                      <span className="text-muted-foreground">{routeMutation.data.durationText ?? b.route}</span>
                      <span className="font-semibold"><Price value={routeMutation.data.amount} /></span>
                    </div>
                  ) : distanceKm && distanceKm > 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {b.route}: {Number(distanceKm).toFixed(1)} km. {b.routeFallback}
                    </p>
                  ) : null}
                  {!date || !time ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {b.routeTimeHelp}
                    </p>
                  ) : null}
                  {pickup.length >= 4 && dropoff.length >= 4 && !routeMutation.data && !routeMutation.isPending ? (
                    <p className="mt-2 flex gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {googleMapsBrowserKey ? b.selectGoogleSuggestion : b.routeKeyHelp}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {canShowMiniMap && (!isDistanceService || selectedTour) ? (
                <div className="rounded-lg border bg-background p-4 md:col-span-2">
                  <div className="mb-3">
                    <p className="font-medium">{b.route}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedTour
                        ? "Mapa referencial del recorrido. El precio del tour se mantiene fijo."
                        : "Mapa referencial del servicio. El precio se confirma segun disponibilidad."}
                    </p>
                  </div>
                  <RouteMiniMap
                    apiKey={googleMapsBrowserKey}
                    cityId={cityId}
                    departureAt={departureAt}
                    destination={dropoff}
                    destinationPlaceId={destinationPlaceId}
                    enabled={canShowMiniMap}
                    language={language}
                    origin={pickup}
                    originPlaceId={originPlaceId}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
          </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
          <motion.div key="schedule-step" {...stepMotion}>
          <Card className="border-primary/12 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="size-5" aria-hidden />
                {b.schedule}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field label={b.date} error={form.formState.errors.date?.message}>
                <Input type="date" {...form.register("date")} />
              </Field>
              <Field label={b.time} error={form.formState.errors.time?.message}>
                <Input type="time" {...form.register("time")} />
              </Field>
              <Field label={b.passengers} error={form.formState.errors.passengers?.message}>
                <PassengerSelector
                  value={Number(passengers) || 2}
                  min={2}
                  max={50}
                  onChange={(value) => form.setValue("passengers", value, { shouldDirty: true, shouldValidate: true })}
                />
              </Field>
              <Field label={b.luggage} error={form.formState.errors.luggage?.message}>
                <Input type="number" min={0} max={80} {...form.register("luggage")} />
              </Field>
              <div className="md:col-span-2">
                <Field label={b.notes}>
                  <Textarea
                    placeholder={b.notesPlaceholder}
                    {...form.register("notes")}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
          </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
          <motion.div key="contact-step" {...stepMotion}>
          <Card className="border-primary/12 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-5" aria-hidden />
                {b.contact}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-3">
              <Field label={b.name} error={form.formState.errors.customer?.fullName?.message}>
                <Input placeholder={b.fullName} {...form.register("customer.fullName")} />
              </Field>
              <Field label={b.email} error={form.formState.errors.customer?.email?.message}>
                <Input type="email" placeholder="correo@dominio.com" {...form.register("customer.email")} />
              </Field>
              <Field label={b.phone} error={form.formState.errors.customer?.phone?.message}>
                <Input placeholder="+57..." {...form.register("customer.phone")} />
              </Field>
            </CardContent>
          </Card>
          </motion.div>
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden border-primary/12 shadow-[0_28px_90px_-50px_rgba(15,23,42,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="size-5 text-primary" aria-hidden />
                {b.summary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <SummaryRow label={b.city} value={cities.find((city) => city.id === cityId)?.name ?? "-"} />
              <SummaryRow label={b.service} value={services.find((service) => service.id === serviceId)?.title ?? "-"} />
              <SummaryRow label="Tour" value={selectedTour?.name ?? b.notApply} />
              {selectedTour ? (
                <SummaryRow
                  label={language === "EN" ? "Tour price" : "Precio tour"}
                  value={selectedTour.pricingMode === "global" ? b.globalPrice : b.perPerson}
                />
              ) : null}
              <SummaryRow label={b.vehicle} value={selectedVehicle?.name ?? "-"} />
              <SummaryRow label={b.capacity} value={`${selectedVehicle?.capacity ?? 0} ${language === "EN" ? "passengers" : "pasajeros"}`} />
              {promoCode === "upsell5" ? (
                <p className="rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground">
                  {language === "EN" ? "Upsell discount applied: 5%" : "Descuento upsell aplicado: 5%"}
                </p>
              ) : null}
              <VehicleSelector
                value={vehicleType}
                onChange={(value) => {
                  form.setValue("vehicleType", value, { shouldDirty: true, shouldValidate: true });
                  routeMutation.reset();
                }}
              />
              {selectedTour ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border">
                  <Image
                    src={selectedTour.cardImage ?? selectedTour.heroImage ?? selectedTour.gallery[0]}
                    alt={selectedTour.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : selectedVehicle ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border">
                  <Image src={selectedVehicle.image} alt={selectedVehicle.name} fill className="object-cover" />
                </div>
              ) : null}
              <div className="border-t pt-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={estimatedTotal.amount}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <p className="text-muted-foreground">{b.total}</p>
                    <Price value={estimatedTotal.amount} className="mt-1 block text-3xl font-semibold" />
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {b.totalHelp}
                    </p>
                    {estimatedTotal.requiresAvailabilityCheck ? (
                      <p className="mt-2 rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground">
                        {b.availability}
                      </p>
                    ) : null}
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      {estimatedTotal.breakdown.map((item) => (
                        <div key={item.label} className="flex justify-between gap-3">
                          <span>{formatBreakdownLabel(item.label, language)}</span>
                          <Price value={item.amount} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                <CreditCard className="size-4" aria-hidden />
                {mutation.isPending ? b.creating : b.pay}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function formatBreakdownLabel(label: string, language: "ES" | "EN") {
  if (language === "ES") return label;

  const labels: Record<string, string> = {
    "Precio del servicio": "Service price",
    "Descuento upsell (5%)": "Upsell discount (5%)",
    "Uso pasarela de pago (5%)": "Payment gateway fee (5%)"
  };

  return labels[label] ?? label;
}
