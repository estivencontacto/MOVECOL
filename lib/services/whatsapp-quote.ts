import { cities, services, tours, vehicles } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import type { RouteEstimate } from "@/lib/services/routes";
import { company } from "@/lib/legal/company";

export function buildSpecialVehicleWhatsappUrl(
  input: ReservationInput,
  route?: RouteEstimate | null
) {
  const city = cities.find((item) => item.id === input.cityId);
  const service = services.find((item) => item.id === input.serviceId);
  const tour = input.tourId ? tours.find((item) => item.id === input.tourId) : undefined;
  const vehicle = vehicles.find((item) => item.type === input.vehicleType);
  const phone = company.phoneHref.replace(/\D/g, "");
  const message = [
    "Hola MOVE Colombia, quiero consultar disponibilidad para este recorrido:",
    `Ciudad: ${city?.name ?? input.cityId}`,
    `Servicio: ${service?.title ?? input.serviceId}`,
    ...(tour ? [`Tour: ${tour.name}`] : []),
    `Fecha y hora: ${input.date} ${input.time}`,
    `Pasajeros: ${input.passengers}`,
    `Equipaje: ${input.luggage}`,
    `Origen: ${input.pickup}`,
    `Destino: ${input.dropoff}`,
    `Distancia: ${route ? `${route.distanceKm.toFixed(1)} km` : "Por confirmar"}`,
    `Duración estimada: ${route?.durationText ?? "Por confirmar"}`,
    `Vehículo: ${vehicle?.name ?? input.vehicleType}`,
    `Observaciones: ${input.notes?.trim() || "Sin observaciones"}`
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
