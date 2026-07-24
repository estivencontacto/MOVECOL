import "server-only";
import { cities, services, tours } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import { company } from "@/lib/legal/company";

type ReservationNotification = {
  reservationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  service: string;
  tour?: string | null;
  date: string;
  time: string;
  passengers: number;
  pickup: string;
  dropoff: string;
  notes?: string | null;
  amountCents?: number | null;
};

export async function sendReservationEmail(
  input: ReservationInput,
  reservationId: string,
  amountCents?: number | null
) {
  const city = cities.find((item) => item.id === input.cityId);
  const service = services.find((item) => item.id === input.serviceId);
  const tour = input.tourId ? tours.find((item) => item.id === input.tourId) : null;

  await sendReservationNotifications({
    reservationId,
    customerName: input.customer.fullName,
    customerEmail: input.customer.email,
    customerPhone: input.customer.phone,
    city: city?.name ?? input.cityId,
    service: service?.title ?? input.serviceId,
    tour: tour?.name,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
    pickup: input.pickup,
    dropoff: input.dropoff,
    notes: input.notes,
    amountCents
  });
}

export async function sendReservationNotifications(details: ReservationNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const operationsEmail = process.env.OPERATIONS_EMAIL ?? company.generalEmail;

  if (!apiKey || !from) {
    console.info("Reservation email skipped: email delivery is not configured", details.reservationId);
    return;
  }

  const summary = reservationSummary(details);
  const whatsappUrl = `https://wa.me/573147278404?text=${encodeURIComponent(
    `Hola MOVE Colombia, necesito ayuda con la reserva ${details.reservationId}.`
  )}`;

  await Promise.allSettled([
    sendTransactionalEmail({
      apiKey,
      from,
      to: details.customerEmail,
      subject: `Recibimos tu reserva MOVE Colombia ${details.reservationId}`,
      idempotencyKey: `reservation-customer-${details.reservationId}`,
      html: emailLayout(`
        <h1 style="margin:0 0 16px;color:#16372c;font-size:28px">Reserva recibida</h1>
        <p>Hola ${escapeHtml(details.customerName)}, recibimos correctamente tu reserva. Actualmente está <strong>pendiente</strong> mientras procesamos el pago y la confirmación.</p>
        ${summary}
        <p style="margin-top:24px">Si necesitas agregar una observación o solicitar ayuda, puedes escribirnos directamente:</p>
        <p><a href="${escapeHtml(whatsappUrl)}" style="display:inline-block;background:#1f6f55;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">Contactar por WhatsApp</a></p>
        <p style="color:#5f6f68;font-size:13px">Conserva el número de reserva para cualquier consulta.</p>
      `)
    }),
    sendTransactionalEmail({
      apiKey,
      from,
      to: operationsEmail,
      replyTo: details.customerEmail,
      subject: `Nueva reserva ${details.reservationId} — ${details.customerName}`,
      idempotencyKey: `reservation-operations-${details.reservationId}`,
      html: emailLayout(`
        <h1 style="margin:0 0 16px;color:#16372c;font-size:28px">Nueva reserva creada</h1>
        <p><strong>Cliente:</strong> ${escapeHtml(details.customerName)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(details.customerEmail)}<br><strong>Teléfono:</strong> ${escapeHtml(details.customerPhone)}</p>
        ${summary}
      `)
    })
  ]);
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
      "Content-Type": "application/json",
      "Idempotency-Key": `payment-confirmed-${reservationId}`
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

async function sendTransactionalEmail({
  apiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  idempotencyKey
}: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  idempotencyKey: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Reservation email failed", { to, status: response.status, error });
  }
}

function reservationSummary(details: ReservationNotification) {
  return `
    <div style="margin:20px 0;padding:18px;border:1px solid #dce6e1;border-radius:10px;background:#f7faf8">
      <p style="margin:0 0 8px"><strong>Reserva:</strong> ${escapeHtml(details.reservationId)}</p>
      <p style="margin:0 0 8px"><strong>Ciudad:</strong> ${escapeHtml(details.city)}</p>
      <p style="margin:0 0 8px"><strong>Servicio:</strong> ${escapeHtml(details.service)}</p>
      ${details.tour ? `<p style="margin:0 0 8px"><strong>Tour:</strong> ${escapeHtml(details.tour)}</p>` : ""}
      <p style="margin:0 0 8px"><strong>Fecha y hora:</strong> ${escapeHtml(details.date)} — ${escapeHtml(details.time)}</p>
      <p style="margin:0 0 8px"><strong>Pasajeros:</strong> ${details.passengers}</p>
      <p style="margin:0 0 8px"><strong>Recogida:</strong> ${escapeHtml(details.pickup)}</p>
      <p style="margin:0 0 8px"><strong>Destino:</strong> ${escapeHtml(details.dropoff)}</p>
      ${details.notes ? `<p style="margin:0 0 8px"><strong>Observaciones:</strong> ${escapeHtml(details.notes)}</p>` : ""}
      ${typeof details.amountCents === "number" ? `<p style="margin:0"><strong>Total:</strong> ${formatCop(details.amountCents / 100)}</p>` : ""}
    </div>
  `;
}

function emailLayout(content: string) {
  return `
    <!doctype html>
    <html lang="es">
      <body style="margin:0;background:#edf3f0;font-family:Arial,sans-serif;color:#263b33">
        <div style="max-width:620px;margin:0 auto;padding:32px 16px">
          <div style="background:#fff;border-radius:14px;padding:28px;box-shadow:0 5px 18px rgba(22,55,44,.08)">
            <p style="margin:0 0 24px;color:#1f6f55;font-weight:800;letter-spacing:.04em">MOVE COLOMBIA</p>
            ${content}
          </div>
        </div>
      </body>
    </html>
  `;
}

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}
