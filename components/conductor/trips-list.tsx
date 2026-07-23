"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Navigation, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Trip = {
  id: string; reservation_date: string; reservation_time: string; status: string;
  passengers: number; pickup_address: string; dropoff_address: string; notes?: string | null;
};

const nextStatus: Record<string, { value: string; label: string }> = {
  pending: { value: "accepted", label: "Aceptar viaje" },
  confirmed: { value: "accepted", label: "Aceptar viaje" },
  accepted: { value: "en_route", label: "Marcar en camino" },
  en_route: { value: "started", label: "Iniciar viaje" },
  started: { value: "completed", label: "Completar viaje" }
};
const statusLabel: Record<string, string> = {
  pending: "Pendiente", confirmed: "Confirmado", accepted: "Aceptado",
  en_route: "En camino", started: "Iniciado", completed: "Completado", cancelled: "Cancelado"
};

export function TripsList({ initialTrips }: { initialTrips: Trip[] }) {
  const [trips, setTrips] = useState(initialTrips);
  const [updating, setUpdating] = useState<string>();
  async function advance(trip: Trip) {
    const next = nextStatus[trip.status];
    if (!next) return;
    setUpdating(trip.id);
    const response = await fetch("/api/conductor/trips", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: trip.id, status: next.value })
    });
    setUpdating(undefined);
    if (!response.ok) {
      toast.error("No se pudo actualizar el estado");
      return;
    }
    setTrips((items) => items.map((item) => item.id === trip.id ? { ...item, status: next.value } : item));
    toast.success(`Estado actualizado: ${statusLabel[next.value]}`);
  }
  return (
    <div className="grid gap-4" aria-live="polite">
      {trips.map((trip) => (
        <article key={trip.id} className="rounded-xl border border-primary/10 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-primary" aria-hidden />{trip.reservation_date} · {trip.reservation_time.slice(0, 5)}</p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="size-4" aria-hidden />{trip.passengers} pasajeros</p>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{statusLabel[trip.status] ?? trip.status}</span>
            </div>
            {nextStatus[trip.status] ? <Button className="w-full sm:w-auto" disabled={updating === trip.id} onClick={() => advance(trip)}>{updating === trip.id ? "Actualizando..." : nextStatus[trip.status].label}</Button> : null}
          </div>
          <div className="mt-5 grid gap-3 border-t pt-5 text-sm">
            <p className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /><span><span className="block text-xs text-muted-foreground">Recogida</span>{trip.pickup_address}</span></p>
            <p className="flex gap-3"><Navigation className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /><span><span className="block text-xs text-muted-foreground">Destino</span>{trip.dropoff_address}</span></p>
          </div>
          {trip.notes ? <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm"><span className="font-medium">Notas: </span>{trip.notes}</p> : null}
        </article>
      ))}
      {!trips.length ? <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">No tienes viajes asignados.</div> : null}
    </div>
  );
}
