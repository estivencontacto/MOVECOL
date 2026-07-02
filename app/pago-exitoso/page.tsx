import Link from "next/link";
import { CheckCircle2, Clock, Gift, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cities, services, tours } from "@/lib/data/catalog";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ reservation?: string }>;
};

type ReservationSuccess = {
  id: string;
  city_id: string;
  service_id: string;
  tour_id: string | null;
  status: string;
  reservation_date: string;
  reservation_time: string;
  passengers: number;
  pickup_address: string;
  dropoff_address: string;
  expected_amount_cents: number | null;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { reservation: reservationId } = await searchParams;
  const reservation = reservationId ? await getReservation(reservationId) : null;
  const city = reservation ? cities.find((item) => item.id === reservation.city_id) : null;
  const service = reservation ? services.find((item) => item.id === reservation.service_id) : null;
  const tour = reservation?.tour_id ? tours.find((item) => item.id === reservation.tour_id) : null;
  const upsell = reservation && city ? getUpsell(reservation, city.slug) : null;
  const isConfirmed = reservation?.status === "confirmed";

  return (
    <main className="min-h-screen bg-muted/35 py-16">
      <div className="container max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
          <Card className="overflow-hidden">
            <CardHeader className={isConfirmed ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}>
              <CardTitle className="flex items-center gap-3 text-3xl">
                {isConfirmed ? (
                  <CheckCircle2 className="size-7" aria-hidden />
                ) : (
                  <Clock className="size-7" aria-hidden />
                )}
                {isConfirmed ? "Pago exitoso" : "Pago en verificacion"}
              </CardTitle>
              <p className={isConfirmed ? "text-primary-foreground/75" : "text-background/75"}>
                {isConfirmed
                  ? "Tu reserva quedo confirmada. Tambien enviamos la confirmacion al correo registrado."
                  : "Recibimos el retorno de pago. La confirmacion final depende del webhook de Wompi."}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <SummaryItem label="Reserva" value={reservation?.id ?? "No disponible"} />
              <SummaryItem label="Estado" value={formatStatus(reservation?.status)} />
              <SummaryItem label="Ciudad" value={city?.name ?? reservation?.city_id ?? "-"} />
              <SummaryItem label="Servicio" value={service?.title ?? reservation?.service_id ?? "-"} />
              <SummaryItem label="Tour" value={tour?.name ?? "No aplica"} />
              <SummaryItem
                label="Fecha y hora"
                value={reservation ? `${reservation.reservation_date} · ${reservation.reservation_time}` : "-"}
              />
              <SummaryItem label="Pasajeros" value={reservation ? String(reservation.passengers) : "-"} />
              <SummaryItem
                label="Total"
                value={
                  typeof reservation?.expected_amount_cents === "number"
                    ? formatCop(reservation.expected_amount_cents / 100)
                    : "-"
                }
              />
              <div className="rounded-lg border bg-muted/45 p-4 md:col-span-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-primary" aria-hidden />
                  Recorrido
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {reservation ? `${reservation.pickup_address} -> ${reservation.dropoff_address}` : "No disponible"}
                </p>
              </div>
            </CardContent>
          </Card>

          {upsell ? (
            <Card className="h-fit border-secondary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="size-5 text-secondary" aria-hidden />
                  Beneficio por reservar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
                  5% de descuento en tu proxima reserva
                </p>
                <div>
                  <p className="text-lg font-semibold">{upsell.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{upsell.description}</p>
                </div>
                <Button asChild className="w-full">
                  <Link href={upsell.href}>Reservar con 5%</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </main>
  );
}

async function getReservation(reservationId: string) {
  if (!isSupabaseAdminConfigured()) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reservations")
    .select(
      "id, city_id, service_id, tour_id, status, reservation_date, reservation_time, passengers, pickup_address, dropoff_address, expected_amount_cents"
    )
    .eq("id", reservationId)
    .maybeSingle();

  if (error) {
    console.error("Payment success reservation lookup failed", {
      reservationId,
      message: error.message
    });
    return null;
  }

  return data as ReservationSuccess | null;
}

function getUpsell(reservation: ReservationSuccess, citySlug: string) {
  const city = cities.find((item) => item.slug === citySlug);
  if (!city) return null;

  if (reservation.service_id === "airport-transfer") {
    const tour = tours.find((item) => item.citySlug === city.slug && item.id !== reservation.tour_id);
    if (!tour) return null;

    return {
      title: tour.name,
      description: `Aprovecha tu llegada a ${city.name} y reserva una experiencia privada con descuento.`,
      href: `/reservar?city=${city.slug}&tour=${tour.id}&promo=upsell5`
    };
  }

  return {
    title: "Traslado Aeropuerto",
    description: `Agenda tu traslado desde o hacia ${city.airport} con conductor privado y tarifa preferencial.`,
    href: `/reservar?city=${city.slug}&service=airport-transfer&promo=upsell5`
  };
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function formatStatus(status?: string) {
  if (status === "confirmed") return "Confirmada";
  if (status === "pending_payment") return "Pendiente de pago";
  if (status === "cancelled") return "Cancelada";
  return status ?? "No disponible";
}

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}
