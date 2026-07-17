"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BookingStepper } from "@/components/booking/booking-stepper";
import type {
  AirportDirection,
  BookingStep,
  RoutePricingResponse
} from "@/components/booking/booking-types";
import { BookingSummary } from "@/components/booking/booking-summary";
import { MobileBookingSummary } from "@/components/booking/mobile-booking-summary";
import { ContactStep } from "@/components/booking/steps/contact-step";
import { ExperienceStep } from "@/components/booking/steps/experience-step";
import { TripStep, type TripStepValues } from "@/components/booking/steps/trip-step";
import { useLanguage } from "@/components/preferences/site-preferences";
import { cities, getTourRouteDestination, services, tours } from "@/lib/data/catalog";
import { reservationSchema, type ReservationInput } from "@/lib/domain/schemas";
import { getVehicleCompatibility } from "@/lib/domain/vehicle-rules";
import { company } from "@/lib/legal/company";
import { estimateReservationPricing } from "@/lib/services/pricing";

const googleMapsBrowserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
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
      serviceId: "airport-transfer",
      tourId: "",
      date: "",
      time: "09:00",
      passengers: 2,
      luggage: 1,
      hours: 1,
      distanceKm: 0,
      pickup: formatAirport(defaultCity.id, defaultCity.airport),
      dropoff: "",
      originPlaceId: "",
      destinationPlaceId: "",
      promoCode: "",
      notes: "",
      vehicleType: "suv",
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

  const estimate = useMemo(
    () =>
      estimateReservationPricing({
        cityId: values.cityId,
        serviceId: values.serviceId,
        tourId: values.tourId,
        vehicleType: values.vehicleType,
        passengers: values.passengers,
        hours: values.hours,
        distanceKm: values.distanceKm,
        promoCode: values.promoCode
      }),
    [
      values.cityId,
      values.distanceKm,
      values.hours,
      values.passengers,
      values.promoCode,
      values.serviceId,
      values.tourId,
      values.vehicleType
    ]
  );

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
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    const tourParam = params.get("tour");
    const serviceParam = params.get("service");
    const city = cities.find((item) => item.slug === cityParam || item.id === cityParam);
    const tour = tours.find((item) => item.id === tourParam || item.slug === tourParam);
    const service = services.find((item) => item.id === serviceParam || item.slug === serviceParam);

    if (city) form.setValue("cityId", city.id);
    if (tour) {
      const destination = getTourRouteDestination(tour.id);
      form.setValue("cityId", tour.citySlug);
      form.setValue("serviceId", "private-tours");
      form.setValue("tourId", tour.id);
      form.setValue("dropoff", destination?.label ?? `${tour.name}, Colombia`);
      form.setValue("destinationPlaceId", destination?.placeId ?? "");
      form.setValue("passengers", Math.max(2, tour.minimumPassengers ?? 2));
    } else if (service) {
      form.setValue("serviceId", service.id);
    }
  }, [form]);

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
      onSubmit={form.handleSubmit(submitReservation, handleInvalid)}
      className="pb-28 lg:pb-0"
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
                  tourDestination={values.dropoff}
                  minimumPassengers={minimumPassengers}
                  routeData={routeMutation.data}
                  routePending={routePending}
                  routeCalculating={routeMutation.isPending}
                  departureAt={departureAt}
                  onValueChange={setTripValue}
                  onAirportDirectionChange={setAirportEndpoints}
                  onFlightNumberChange={setFlightNumber}
                  onMobilityNeedsChange={setMobilityNeeds}
                  onCalculateRoute={() => routeMutation.mutate()}
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

        <aside className="hidden lg:block">
          <BookingSummary
            values={values}
            estimate={estimate}
            routeData={routeMutation.data}
            routePending={routePending}
            language={language}
            className="sticky top-24 border-primary/15"
          />
        </aside>
      </div>

      <MobileBookingSummary
        values={values}
        estimate={estimate}
        routeData={routeMutation.data}
        routePending={routePending}
        language={language}
        currentStep={currentStep}
        pending={reservationMutation.isPending}
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
