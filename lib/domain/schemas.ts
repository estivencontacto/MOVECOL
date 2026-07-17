import { z } from "zod";
import { getVehicleCompatibility, vehicleTypes } from "@/lib/domain/vehicle-rules";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const HTML_DELIMITERS = /[<>]/;
const SAFE_ID = /^[a-z0-9][a-z0-9_-]*$/i;
const GOOGLE_PLACE_ID = /^[a-z0-9_-]+$/i;

function safeText(min: number, max: number, message: string) {
  return z
    .string()
    .trim()
    .min(min, message)
    .max(max, `Máximo ${max} caracteres`)
    .refine((value) => !CONTROL_CHARACTERS.test(value), "El texto contiene caracteres no permitidos")
    .refine((value) => !HTML_DELIMITERS.test(value), "No se permite código HTML");
}

const idSchema = z.string().trim().min(1).max(80).regex(SAFE_ID, "Identificador inválido");
const optionalIdSchema = z
  .string()
  .trim()
  .max(80)
  .refine((value) => value.length === 0 || SAFE_ID.test(value), "Identificador inválido")
  .optional();
const optionalPlaceIdSchema = z
  .string()
  .trim()
  .max(255)
  .refine(
    (value) => value.length === 0 || GOOGLE_PLACE_ID.test(value),
    "Identificador de Google Maps inválido"
  )
  .optional();
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Teléfono inválido")
  .max(24, "Teléfono inválido")
  .regex(/^[+\d\s().-]+$/, "Teléfono inválido");

const reservationBaseSchema = z.object({
  cityId: idSchema,
  serviceId: idSchema,
  tourId: optionalIdSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida"),
  passengers: z.coerce.number().int().min(2, "Mínimo 2 pasajeros").max(50),
  luggage: z.coerce.number().int().min(0).max(80),
  hours: z.coerce.number().min(1).max(24).optional(),
  distanceKm: z.coerce.number().min(0).max(2000).optional(),
  pickup: safeText(4, 300, "Indica el lugar de recogida"),
  dropoff: safeText(4, 300, "Indica el destino"),
  originPlaceId: optionalPlaceIdSchema,
  destinationPlaceId: optionalPlaceIdSchema,
  promoCode: z
    .string()
    .trim()
    .max(40)
    .refine((value) => value.length === 0 || /^[a-z0-9_-]+$/i.test(value), "Código inválido")
    .optional(),
  notes: safeText(0, 800, "").optional(),
  vehicleType: z.enum(vehicleTypes),
  termsAccepted: z
    .boolean()
    .refine((value) => value, "Debes aceptar los términos y la política de privacidad"),
  termsVersion: z.string().trim().min(1).max(64),
  customer: z.object({
    fullName: safeText(3, 120, "Indica tu nombre"),
    email: z
      .string()
      .trim()
      .email("Correo inválido")
      .max(254)
      .transform((value) => value.toLowerCase()),
    phone: phoneSchema
  })
});

export const reservationSchema = reservationBaseSchema.superRefine((value, context) => {
  if (value.serviceId === "private-tours" && !value.tourId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tourId"],
      message: "Selecciona un tour"
    });
  }

  const compatibility = getVehicleCompatibility({
    vehicleType: value.vehicleType,
    serviceId: value.serviceId,
    passengers: value.passengers,
    luggage: value.luggage
  });

  if (!compatibility.compatible) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["vehicleType"],
      message: "El vehículo seleccionado no tiene capacidad suficiente"
    });
  }
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const contactSchema = z.object({
  fullName: safeText(3, 120, "Indica tu nombre"),
  email: z
    .string()
    .trim()
    .email("Correo inválido")
    .max(254)
    .transform((value) => value.toLowerCase()),
  phone: phoneSchema,
  message: safeText(10, 1200, "Escribe un mensaje más detallado")
});

export type ContactInput = z.infer<typeof contactSchema>;

export const checkoutSchema = z.object({
  reservationId: z.string().uuid(),
  amountInCents: z.number().int().positive().optional(),
  currency: z.literal("COP").default("COP")
});

export const wompiTransactionSchema = z.object({
  id: z.string().trim().min(1).max(160),
  reference: z
    .string()
    .trim()
    .max(80)
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(\.[a-f0-9]{16})?$/i
    ),
  status: z.enum(["PENDING", "APPROVED", "DECLINED", "VOIDED", "ERROR"]),
  amount_in_cents: z.number().int().positive(),
  currency: z.literal("COP")
});

export const wompiEventSchema = z.object({
  event: z.literal("transaction.updated"),
  data: z.object({
    transaction: wompiTransactionSchema
  }),
  signature: z.object({
    checksum: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
    properties: z.array(z.string().min(1).max(120)).min(1).max(32)
  }),
  timestamp: z.number().int().positive()
});
