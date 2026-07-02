import type { ReservationInput } from "@/lib/domain/schemas";

export async function queueWhatsappConfirmation(input: ReservationInput, reservationId: string) {
  if (!process.env.WHATSAPP_BUSINESS_PHONE) {
    console.info("WhatsApp skipped: WHATSAPP_BUSINESS_PHONE is not configured", reservationId);
    return;
  }

  console.info("WhatsApp confirmation prepared", { reservationId });
}
