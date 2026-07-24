"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, MapPin, Navigation, Play, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [trips, setTrips] = useState(initialTrips);
  const [finishingId, setFinishingId] = useState<string | null>(null);
  const [observation, setObservation] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateTrip(id: string, status: "started" | "completed") {
    if (status === "completed" && observation.trim().length < 2) {
      toast.error("Escribe una observación final.");
      return;
    }

    setLoadingId(id);
    try {
      const response = await fetch("/api/conductor/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          ...(status === "completed" ? { observation: observation.trim() } : {})
        })
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "No fue posible actualizar el viaje");

      setTrips((current) => current.map((trip) => trip.id === id ? { ...trip, status } : trip));
      setFinishingId(null);
      setObservation("");
      toast.success(status === "started" ? "Viaje iniciado." : "Viaje terminado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No fue posible actualizar el viaje");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-4" aria-live="polite">
      {trips.map((trip) => (
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
            <span className="text-xs font-medium text-muted-foreground">Reserva asignada</span>
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
          {canStart(trip.status) ? (
            <div className="mt-5 border-t pt-5">
              <Button
                type="button"
                onClick={() => updateTrip(trip.id, "started")}
                disabled={loadingId === trip.id}
                className="w-full sm:w-auto"
              >
                {loadingId === trip.id ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Play className="size-4" aria-hidden />}
                Iniciar viaje
              </Button>
            </div>
          ) : null}
          {trip.status === "started" ? (
            <div className="mt-5 border-t pt-5">
              {finishingId === trip.id ? (
                <div className="grid gap-3">
                  <label htmlFor={`observation-${trip.id}`} className="text-sm font-semibold">
                    Observación final
                  </label>
                  <textarea
                    id={`observation-${trip.id}`}
                    value={observation}
                    onChange={(event) => setObservation(event.target.value)}
                    maxLength={1000}
                    rows={4}
                    required
                    className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Describe cómo terminó el servicio o cualquier novedad."
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      onClick={() => updateTrip(trip.id, "completed")}
                      disabled={loadingId === trip.id}
                    >
                      {loadingId === trip.id ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
                      Confirmar finalización
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFinishingId(null);
                        setObservation("");
                      }}
                      disabled={loadingId === trip.id}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button type="button" onClick={() => setFinishingId(trip.id)} className="w-full sm:w-auto">
                  <CheckCircle2 className="size-4" aria-hidden />
                  Terminar viaje
                </Button>
              )}
            </div>
          ) : null}
        </article>
      ))}
      {!trips.length ? (
        <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
          No tienes viajes asignados.
        </div>
      ) : null}
    </div>
  );
}

function canStart(status: string) {
  return ["pending", "confirmed", "accepted", "en_route"].includes(status);
}
