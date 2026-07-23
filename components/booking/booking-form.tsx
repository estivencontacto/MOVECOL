"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BookingStepper } from "@/components/booking/booking-stepper";
import type {
  AirportDirection,
  BookingStep,
  PublicPriceEstimate,
  RoutePricingResponse
} from "@/components/booking/booking-types";
import { BookingSummary } from "@/components/booking/booking-summary";
import { MobileBookingSummary } from "@/components/booking/mobile-booking-summary";
import { ContactStep } from "@/components/booking/steps/contact-step";
import { ExperienceStep } from "@/components/booking/steps/experience-step";
import { TripStep, type TripStepValues } from "@/components/booking/steps/trip-step";
import { useLanguage } from "@/components/preferences/site-preferences";
import { cities, getTourRouteDestination, services, tours, vehicles } from "@/lib/data/catalog";
import { reservationSchema, type ReservationInput } from "@/lib/domain/schemas";
import { getVehicleCompatibility } from "@/lib/domain/vehicle-rules";
import { company } from "@/lib/legal/company";

const googleMapsBrowserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
const BOOKING_SELECTIONS_KEY = "move:booking-selections:v1";
const EMPTY_ESTIMATE: PublicPriceEstimate = {
  total: 0,
  requiresAvailabilityCheck: false,
  quoteOnly: false
};
const routeKeys: Array<keyof TripStepValues> = [
  "cityId",
  "serviceId",
  "date",
  "time",
  "pickup",
  "dropoff",
  "originPlaceId",
  "destinationPlaceId",
  "vehicleType"
];

export function BookingForm() {
  const [language] = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [initialized, setInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [completedSteps, setCompletedSteps] = useState<BookingStep[]>([]);
  const [errorStep, setErrorStep] = useState<BookingStep>();
  const [airportDirection, setAirportDirection] = useState<AirportDirection>("from-airport");
  const [countryCode, setCountryCode] = useState("+57");
  const [flightNumber, setFlightNumber] = useState("");
  const [mobilityNeeds, setMobilityNeeds] = useState("");
  const [finalNotes, setFinalNotes] = useState("");

  const defaultCity = cities.find((city) => city.id === "medellin") ?? cities[0];
  const form = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      cityId: defaultCity.id,
      serviceId: "",
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
      vehicleType: "sedan",
      termsAccepted: false,
      termsVersion: company.termsVersion,
      customer: {
        fullName: "",
        email: "",
        phone: ""
      }
    }
  });

  const values = form.watch();
  const selectedCity = cities.find((city) => city.id === values.cityId) ?? cities[0];
  const selectedTour = tours.find((tour) => tour.id === values.tourId);
  const minimumPassengers = selectedTour?.minimumPassengers ?? 2;
  const departureAt = values.date && values.time ? `${values.date}T${values.time}:00-05:00` : undefined;

  const routeMutation = useMutation({
    mutationFn: async () => {
      const current = form.getValues();
      const response = await fetch("/api/pricing/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: current.cityId,
          serviceId: current.serviceId,
          origin: current.pickup,
          destination: current.dropoff,
          originPlaceId: current.originPlaceId,
          destinationPlaceId: current.destinationPlaceId,
          vehicleType: current.vehicleType,
          passengers: current.passengers,
          tourId: current.tourId,
          hours: current.hours,
          promoCode: current.promoCode,
          departureAt
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No fue posible calcular la ruta");
      return data as RoutePricingResponse;
    },
    onSuccess: (data) => {
      form.setValue("distanceKm", Number(data.distanceKm.toFixed(1)), {
        shouldDirty: true,
        shouldValidate: true
      });
    },
    onError: (error) => {
      form.setValue("distanceKm", 0);
      toast.error(language === "EN" ? "Route unavailable" : "No se pudo calcular la ruta", {
        description: error.message
      });
    }
  });
  const estimate = routeMutation.data ?? EMPTY_ESTIMATE;

  const reservationMutation = useMutation({
    mutationFn: async (payload: ReservationInput) => {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No fue posible crear la reserva");
      return data as { id?: string; checkoutUrl?: string; quoteUrl?: string };
    },
    onSuccess: (data) => {
      toast.success(
        data.quoteUrl
          ? language === "EN" ? "Opening WhatsApp consultation" : "Abriendo consulta en WhatsApp"
          : language === "EN" ? "Booking created" : "Reserva creada"
      );
      if (data.quoteUrl) window.location.href = data.quoteUrl;
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      toast.error(language === "EN" ? "Review your booking" : "Revisa la reserva", {
        description: error.message
      });
    }
  });
  const calculateRoute = routeMutation.mutate;

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const stored = readStoredSelections();
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    const tourParam = params.get("tour");
    const serviceParam = params.get("service");
    const queryCity = cities.find((item) => item.slug === cityParam || item.id === cityParam);
    const storedCity = cities.find((item) => item.id === stored?.cityId);
    const queryTour = tours.find((item) => item.id === tourParam || item.slug === tourParam);
    const storedTour = cityParam || serviceParam || tourParam
      ? undefined
      : tours.find((item) => item.id === stored?.tourId);
    const tour = queryTour ?? storedTour;
    const city = tour
      ? cities.find((item) => item.id === tour.citySlug) ?? defaultCity
      : queryCity ?? storedCity ?? defaultCity;
    const queryService = services.find((item) => item.id === serviceParam || item.slug === serviceParam);
    const storedService = services.find((item) => item.id === stored?.serviceId);
    const requestedService = tour
      ? services.find((item) => item.id === "private-tours")
      : serviceParam
        ? queryService
        : storedService;
    const service = requestedService && isServiceAvailable(city.id, requestedService.id)
      ? requestedService
      : undefined;
    const initialAirportDirection: AirportDirection =
      stored?.airportDirection === "to-airport" ? "to-airport" : "from-airport";

    form.setValue("cityId", city.id);
    if (tour) {
      const destination = getTourRouteDestination(tour.id);
      form.setValue("serviceId", "private-tours");
      form.setValue("tourId", tour.id);
      form.setValue("dropoff", destination?.label ?? `${tour.name}, Colombia`);
      form.setValue("destinationPlaceId", destination?.placeId ?? "");
      form.setValue("passengers", Math.max(stored?.passengers ?? 2, tour.minimumPassengers ?? 2));
      setCompletedSteps([1]);
      setCurrentStep(2);
    } else if (service) {
      form.setValue("serviceId", service.id);
      if (service.id !== "private-tours") {
        setCompletedSteps([1]);
        setCurrentStep(2);
      }
      if (service.id === "airport-transfer") {
        const airport = formatAirport(city.id, city.airport);
        form.setValue("pickup", initialAirportDirection === "from-airport" ? airport : "");
        form.setValue("dropoff", initialAirportDirection === "to-airport" ? airport : "");
      }
    }

    if (isValidCount(stored?.passengers, 2, 50) && !tour) {
      form.setValue("passengers", stored.passengers);
    }
    if (isLuggageRelevant(service?.id ?? (tour ? "private-tours" : "")) && isValidCount(stored?.luggage, 0, 80)) {
      form.setValue("luggage", stored.luggage);
    } else {
      form.setValue("luggage", 0);
    }
    if (isValidCount(stored?.hours, 1, 24)) form.setValue("hours", stored.hours);
    if (vehicles.some((vehicle) => vehicle.type === stored?.vehicleType)) {
      form.setValue("vehicleType", stored?.vehicleType ?? "sedan");
    }
    if (isValidFutureDate(stored?.date)) form.setValue("date", stored.date);
    if (typeof stored?.time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(stored.time)) {
      form.setValue("time", stored.time);
    }
    setAirportDirection(initialAirportDirection);
    if (isCountryCode(stored?.countryCode)) {
      setCountryCode(stored.countryCode);
    }

    setInitialized(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ block: "start" }));
    });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [defaultCity, form]);

  useEffect(() => {
    if (!initialized) return;
    const selections: StoredBookingSelections = {
      cityId: values.cityId,
      serviceId: values.serviceId,
      tourId: values.tourId,
      date: values.date,
      time: values.time,
      passengers: values.passengers,
      luggage: values.luggage,
      hours: values.hours,
      vehicleType: values.vehicleType,
      airportDirection,
      countryCode
    };
    storeSelections(selections);
  }, [
    airportDirection,
    countryCode,
    initialized,
    values.cityId,
    values.date,
    values.hours,
    values.luggage,
    values.passengers,
    values.serviceId,
    values.time,
    values.tourId,
    values.vehicleType
  ]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("move:booking-context", {
        detail: {
          city: values.cityId === "bogota" ? "Bogotá" : "Medellín",
          item: selectedTour?.name ?? services.find((service) => service.id === values.serviceId)?.title
        }
      })
    );
  }, [selectedTour?.name, values.cityId, values.serviceId]);

  useEffect(() => {
    if (
      values.pickup.trim().length < 4 ||
      values.dropoff.trim().length < 4
    ) {
      return;
    }
    const timer = window.setTimeout(() => calculateRoute(), 900);
    return () => window.clearTimeout(timer);
  }, [
    calculateRoute,
    departureAt,
    values.destinationPlaceId,
    values.dropoff,
    values.originPlaceId,
    values.pickup,
    values.hours,
    values.passengers,
    values.promoCode,
    values.tourId,
    values.vehicleType
  ]);

  const routePending =
    values.pickup.trim().length >= 4 &&
    values.dropoff.trim().length >= 4 &&
    !routeMutation.data &&
    !routeMutation.isError;

  useEffect(() => {
    const compatibility = getVehicleCompatibility({
      vehicleType: values.vehicleType,
      serviceId: values.serviceId,
      passengers: values.passengers,
      luggage: values.luggage
    });

    if (!compatibility.compatible) {
      form.setError("vehicleType", {
        message: language === "EN" ? "Choose a vehicle with enough capacity" : "Elige un vehículo con capacidad suficiente"
      });
    } else {
      form.clearErrors("vehicleType");
    }
  }, [form, language, values.luggage, values.passengers, values.serviceId, values.vehicleType]);

  function setTripValue<K extends keyof TripStepValues>(key: K, value: TripStepValues[K]) {
    form.setValue(key, value as never, { shouldDirty: true, shouldValidate: false });
    if (routeKeys.includes(key)) {
      form.setValue("distanceKm", 0);
      routeMutation.reset();
    }
  }

  function setAirportEndpoints(direction: AirportDirection, city = selectedCity) {
    setAirportDirection(direction);
    routeMutation.reset();
    form.setValue("distanceKm", 0);
    form.setValue("originPlaceId", "");
    form.setValue("destinationPlaceId", "");
    if (direction === "from-airport") {
      form.setValue("pickup", formatAirport(city.id, city.airport));
      form.setValue("dropoff", "");
    } else {
      form.setValue("pickup", "");
      form.setValue("dropoff", formatAirport(city.id, city.airport));
    }
  }

  async function continueFromExperience() {
    const fields: Array<"cityId" | "serviceId" | "tourId"> = ["cityId", "serviceId"];
    if (values.serviceId === "private-tours") fields.push("tourId");
    const valid = await form.trigger(fields, { shouldFocus: true });
    if (!valid || (values.serviceId === "private-tours" && !values.tourId)) {
      if (!values.tourId && values.serviceId === "private-tours") {
        form.setError("tourId", { message: language === "EN" ? "Choose a tour" : "Selecciona un tour" });
      }
      setErrorStep(1);
      return;
    }
    if (values.serviceId === "airport-transfer" && !values.pickup && !values.dropoff) {
      setAirportEndpoints(airportDirection);
    }
    setCompletedSteps((steps) => Array.from(new Set([...steps, 1])) as BookingStep[]);
    setErrorStep(undefined);
    setCurrentStep(2);
    focusHeading("trip-title");
  }

  async function continueFromTrip() {
    const fields: Array<keyof ReservationInput> = [
      "date",
      "time",
      "passengers",
      "luggage",
      "pickup",
      "dropoff",
      "vehicleType"
    ];
    if (values.serviceId === "hourly") fields.push("hours");
    const valid = await form.trigger(fields, { shouldFocus: true });
    const vehicleFits = getVehicleCompatibility({
      vehicleType: values.vehicleType,
      serviceId: values.serviceId,
      passengers: values.passengers,
      luggage: values.luggage
    }).compatible;

    if (!vehicleFits) {
      form.setError("vehicleType", {
        message: language === "EN" ? "Choose a vehicle with enough capacity" : "Elige un vehículo con capacidad suficiente"
      });
    }
    if (!valid || !vehicleFits) {
      setErrorStep(2);
      return;
    }
    if (["airport-transfer", "transfers"].includes(values.serviceId) && !routeMutation.data) {
      try {
        await routeMutation.mutateAsync();
      } catch {
        setErrorStep(2);
        return;
      }
    }
    setCompletedSteps((steps) => Array.from(new Set([...steps, 1, 2])) as BookingStep[]);
    setErrorStep(undefined);
    setCurrentStep(3);
    focusHeading("contact-title");
  }

  function handleStepChange(step: BookingStep) {
    setCurrentStep(step);
    focusHeading(step === 1 ? "experience-title" : step === 2 ? "trip-title" : "contact-title");
  }

  function handleCityChange(cityId: string) {
    const city = cities.find((item) => item.id === cityId) ?? cities[0];
    form.setValue("cityId", cityId, { shouldDirty: true });
    form.setValue("tourId", "");
    form.setValue("distanceKm", 0);
    routeMutation.reset();
    if (values.serviceId === "airport-transfer") setAirportEndpoints(airportDirection, city);
  }

  function handleServiceChange(serviceId: string) {
    form.setValue("serviceId", serviceId, { shouldDirty: true });
    form.clearErrors("tourId");
    form.setValue("tourId", "");
    form.setValue("distanceKm", 0);
    form.setValue("hours", serviceId === "hourly" ? Math.max(values.hours ?? 1, 1) : 1);
    form.setValue("luggage", isLuggageRelevant(serviceId) ? values.luggage : 0);
    if (serviceId !== "airport-transfer") setFlightNumber("");
    if (serviceId !== "medical-tourism") setMobilityNeeds("");
    routeMutation.reset();
    if (serviceId === "airport-transfer") {
      setAirportEndpoints(airportDirection);
    } else {
      form.setValue("pickup", "");
      form.setValue("dropoff", "");
      form.setValue("originPlaceId", "");
      form.setValue("destinationPlaceId", "");
    }
  }

  function handleTourChange(tour: (typeof tours)[number]) {
    const destination = getTourRouteDestination(tour.id);
    form.setValue("tourId", tour.id, { shouldDirty: true, shouldValidate: true });
    form.setValue("dropoff", destination?.label ?? `${tour.name}, Colombia`);
    form.setValue("destinationPlaceId", destination?.placeId ?? "");
    if (values.passengers < (tour.minimumPassengers ?? 2)) {
      form.setValue("passengers", tour.minimumPassengers ?? 2);
    }
  }

  function submitReservation(data: ReservationInput) {
    const operationalNotes = [
      flightNumber ? `Vuelo: ${flightNumber}` : "",
      mobilityNeeds ? `Necesidades de movilidad: ${mobilityNeeds}` : "",
      finalNotes
    ].filter(Boolean).join("\n");
    reservationMutation.mutate({
      ...data,
      distanceKm: routeMutation.data?.distanceKm ?? data.distanceKm,
      notes: operationalNotes,
      customer: {
        ...data.customer,
        phone: `${countryCode} ${data.customer.phone}`.trim()
      }
    });
  }

  function handleInvalid() {
    const errors = form.formState.errors;
    const step: BookingStep =
      errors.cityId || errors.serviceId || errors.tourId
        ? 1
        : errors.date || errors.time || errors.pickup || errors.dropoff || errors.vehicleType
          ? 2
          : 3;
    setCurrentStep(step);
    setErrorStep(step);
  }

  return (
    <form
      ref={formRef}
      id="booking-form"
      onSubmit={form.handleSubmit(submitReservation, handleInvalid)}
      className="scroll-mt-24 pb-28 lg:pb-0"
      noValidate
    >
      <input type="hidden" {...form.register("termsVersion")} />
      <div className="mb-8 max-w-3xl">
        <BookingStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          errorStep={errorStep}
          language={language}
          onStepChange={handleStepChange}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 border bg-card p-5 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              {currentStep === 1 ? (
                <ExperienceStep
                  cityId={values.cityId}
                  serviceId={values.serviceId}
                  tourId={values.tourId}
                  language={language}
                  errors={form.formState.errors}
                  onCityChange={handleCityChange}
                  onServiceChange={handleServiceChange}
                  onTourChange={handleTourChange}
                  onContinue={continueFromExperience}
                />
              ) : null}
              {currentStep === 2 ? (
                <TripStep
                  values={values}
                  language={language}
                  errors={form.formState.errors}
                  apiKey={googleMapsBrowserKey}
                  airport={formatAirport(selectedCity.id, selectedCity.airport)}
                  airportDirection={airportDirection}
                  flightNumber={flightNumber}
                  mobilityNeeds={mobilityNeeds}
                  minimumPassengers={minimumPassengers}
                  routeData={routeMutation.data}
                  routeCalculating={routeMutation.isPending}
                  departureAt={departureAt}
                  onValueChange={setTripValue}
                  onAirportDirectionChange={setAirportEndpoints}
                  onFlightNumberChange={setFlightNumber}
                  onMobilityNeedsChange={setMobilityNeeds}
                  onBack={() => handleStepChange(1)}
                  onContinue={continueFromTrip}
                />
              ) : null}
              {currentStep === 3 ? (
                <ContactStep
                  customer={values.customer}
                  countryCode={countryCode}
                  notes={finalNotes}
                  termsAccepted={values.termsAccepted}
                  language={language}
                  errors={form.formState.errors}
                  pending={reservationMutation.isPending}
                  quoteOnly={estimate.quoteOnly}
                  onCustomerChange={(field, value) => form.setValue(`customer.${field}`, value, { shouldDirty: true })}
                  onCountryCodeChange={setCountryCode}
                  onNotesChange={setFinalNotes}
                  onTermsChange={(value) => form.setValue("termsAccepted", value, { shouldDirty: true, shouldValidate: true })}
                  onBack={() => handleStepChange(2)}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {values.serviceId ? <aside className="hidden lg:block">
          <BookingSummary
            values={values}
            estimate={estimate}
            routeData={routeMutation.data}
            routePending={routePending}
            language={language}
            className="sticky top-24 border-primary/15"
          />
        </aside> : null}
      </div>

      <MobileBookingSummary
        values={values}
        estimate={estimate}
        routeData={routeMutation.data}
        routePending={routePending}
        language={language}
        currentStep={currentStep}
        pending={reservationMutation.isPending || routeMutation.isPending}
        onContinue={currentStep === 1 ? continueFromExperience : continueFromTrip}
      />
    </form>
  );
}

function focusHeading(id: string) {
  window.setTimeout(() => {
    const element = document.getElementById(id);
    element?.setAttribute("tabindex", "-1");
    element?.focus();
  }, 50);
}

function formatAirport(cityId: string, fallback: string) {
  if (cityId === "bogota") return "Aeropuerto Internacional El Dorado";
  if (cityId === "medellin") return "Aeropuerto Internacional José María Córdova";
  return fallback;
}

type StoredBookingSelections = {
  cityId: string;
  serviceId: string;
  tourId?: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  hours?: number;
  vehicleType: ReservationInput["vehicleType"];
  airportDirection: AirportDirection;
  countryCode: string;
};

function readStoredSelections(): Partial<StoredBookingSelections> | null {
  try {
    const value = window.sessionStorage.getItem(BOOKING_SELECTIONS_KEY);
    if (!value) return null;
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object"
      ? parsed as Partial<StoredBookingSelections>
      : null;
  } catch {
    window.sessionStorage.removeItem(BOOKING_SELECTIONS_KEY);
    return null;
  }
}

function storeSelections(selections: StoredBookingSelections) {
  try {
    window.sessionStorage.setItem(BOOKING_SELECTIONS_KEY, JSON.stringify(selections));
  } catch {
    // The booking remains usable when browser storage is unavailable.
  }
}

function isServiceAvailable(cityId: string, serviceId: string) {
  const city = cities.find((item) => item.id === cityId);
  return Boolean(city?.serviceIds?.includes(serviceId) || serviceId === "events");
}

function isValidCount(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

function isValidFutureDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  return value >= today;
}

function isCountryCode(value: unknown): value is string {
  return typeof value === "string" && ["+57", "+1", "+34", "+52", "+51", "+56"].includes(value);
}

function isLuggageRelevant(serviceId: string) {
  return ["airport-transfer", "transfers", "medical-tourism"].includes(serviceId);
}
