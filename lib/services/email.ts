import type { ReservationInput } from "@/lib/domain/schemas";

export async function sendReservationEmail(input: ReservationInput, reservationId: string) {
  if (!process.env.RESEND_API_KEY) {
    console.info("Email skipped: RESEND_API_KEY is not configured", reservationId);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [input.customer.email, process.env.OPERATIONS_EMAIL].filter(Boolean),
      subject: `Reserva MOVE Colombia ${reservationId}`,
      html: `
        <h1>Reserva recibida</h1>
        <p>Hola ${input.customer.fullName}, recibimos tu solicitud para ${input.date} a las ${input.time}.</p>
        <p>Ruta: ${input.pickup} -> ${input.dropoff}</p>
      `
    })
  });

  if (!response.ok) {
    console.error("Reservation email failed", await response.text());
  }
}
