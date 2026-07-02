import { z } from "zod";

export const reservationSchema = z.object({
  cityId: z.string().min(1, "Selecciona una ciudad"),
  serviceId: z.string().min(1, "Selecciona un servicio"),
  tourId: z.string().optional(),
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora"),
  passengers: z.coerce.number().int().min(2, "Minimo 2 pasajeros").max(50),
  luggage: z.coerce.number().int().min(0).max(80),
  hours: z.coerce.number().min(1).max(24).optional(),
  distanceKm: z.coerce.number().min(0).max(2000).optional(),
  pickup: z.string().min(4, "Indica el lugar de recogida"),
  dropoff: z.string().min(4, "Indica el destino"),
  originPlaceId: z.string().trim().optional(),
  destinationPlaceId: z.string().trim().optional(),
  notes: z.string().max(800).optional(),
  vehicleType: z.enum(["sedan", "suv", "van", "bus"]),
  customer: z.object({
    fullName: z.string().min(3, "Indica tu nombre"),
    email: z.string().email("Correo invalido"),
    phone: z.string().min(7, "Telefono invalido")
  })
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const contactSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(10).max(1200)
});

export type ContactInput = z.infer<typeof contactSchema>;

export const checkoutSchema = z.object({
  reservationId: z.string().uuid(),
  amountInCents: z.number().int().positive(),
  currency: z.literal("COP").default("COP")
});
