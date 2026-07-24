import { CalendarDays, MapPin, Navigation, Users } from "lucide-react";

type Trip = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
  passengers: number;
  pickup_address: string;
  dropoff_address: string;
  notes?: string | null;
};

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  accepted: "Aceptado",
  en_route: "En camino",
  started: "Iniciado",
  completed: "Completado",
  cancelled: "Cancelado"
};

export function TripsList({ initialTrips }: { initialTrips: Trip[] }) {
  return (
    <div className="grid gap-4" aria-live="polite">
      {initialTrips.map((trip) => (
        <article key={trip.id} className="rounded-xl border border-primary/10 bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-semibold">
                <CalendarDays className="size-4 text-primary" aria-hidden />
                {trip.reservation_date} · {trip.reservation_time.slice(0, 5)}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" aria-hidden />
                {trip.passengers} pasajeros
              </p>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {statusLabel[trip.status] ?? trip.status}
              </span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Solo lectura</span>
          </div>
          <div className="mt-5 grid gap-3 border-t pt-5 text-sm">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span><span className="block text-xs text-muted-foreground">Recogida</span>{trip.pickup_address}</span>
            </p>
            <p className="flex gap-3">
              <Navigation className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span><span className="block text-xs text-muted-foreground">Destino</span>{trip.dropoff_address}</span>
            </p>
          </div>
          {trip.notes ? <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm"><span className="font-medium">Notas: </span>{trip.notes}</p> : null}
        </article>
      ))}
      {!initialTrips.length ? (
        <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
          No tienes viajes asignados.
        </div>
      ) : null}
    </div>
  );
}
