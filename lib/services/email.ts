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
        <p>Hola ${escapeHtml(input.customer.fullName)}, recibimos tu solicitud para ${escapeHtml(input.date)} a las ${escapeHtml(input.time)}.</p>
        <p>Ruta: ${escapeHtml(input.pickup)} -> ${escapeHtml(input.dropoff)}</p>
      `
    })
  });

  if (!response.ok) {
    console.error("Reservation email failed", {
      reservationId,
      status: response.status
    });
  }
}

export async function sendPaymentConfirmedEmail({
  reservationId,
  to,
  fullName,
  city,
  service,
  tour,
  date,
  time,
  passengers,
  pickup,
  dropoff,
  amountCents
}: {
  reservationId: string;
  to?: string | null;
  fullName?: string | null;
  city: string;
  service: string;
  tour?: string | null;
  date: string;
  time: string;
  passengers: number;
  pickup: string;
  dropoff: string;
  amountCents?: number | null;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.info("Payment confirmation email skipped: RESEND_API_KEY is not configured", reservationId);
    return;
  }

  if (!to) {
    console.error("Payment confirmation email skipped: missing customer email", { reservationId });
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
      to: [to],
      bcc: [process.env.OPERATIONS_EMAIL].filter(Boolean),
      subject: `Pago confirmado MOVE Colombia ${reservationId}`,
      html: `
        <h1>Pago confirmado</h1>
        <p>Hola ${escapeHtml(fullName ?? "viajero")}, tu reserva ya quedo confirmada.</p>
        <ul>
          <li><strong>Reserva:</strong> ${escapeHtml(reservationId)}</li>
          <li><strong>Ciudad:</strong> ${escapeHtml(city)}</li>
          <li><strong>Servicio:</strong> ${escapeHtml(service)}</li>
          ${tour ? `<li><strong>Tour:</strong> ${escapeHtml(tour)}</li>` : ""}
          <li><strong>Fecha:</strong> ${escapeHtml(date)} ${escapeHtml(time)}</li>
          <li><strong>Pasajeros:</strong> ${passengers}</li>
          <li><strong>Recogida:</strong> ${escapeHtml(pickup)}</li>
          <li><strong>Destino:</strong> ${escapeHtml(dropoff)}</li>
          ${typeof amountCents === "number" ? `<li><strong>Total pagado:</strong> ${formatCop(amountCents / 100)}</li>` : ""}
        </ul>
        <p>Gracias por reservar con MOVE Colombia.</p>
      `
    })
  });

  if (!response.ok) {
    console.error("Payment confirmation email failed", {
      reservationId,
      status: response.status
    });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}
