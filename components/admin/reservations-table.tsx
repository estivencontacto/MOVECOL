"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ReservationRow = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
  passengers: number;
  pickup_address: string;
  dropoff_address: string;
  driver_id?: string | null;
  customers?: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  payments?: Array<{
    amount_cents: number | null;
    status: string | null;
  }>;
  reservation_observations?: Array<{
    id: number;
    action: string;
    observation: string;
    author_name: string;
    created_at: string;
  }>;
};

export function ReservationsTable({ rows: initialRows, drivers }: { rows: ReservationRow[]; drivers: Array<{ id: string; full_name: string }> }) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const visible = useMemo(() => rows.filter((row) =>
    (!status || row.status === status) &&
    (!query || `${row.customers?.full_name} ${row.pickup_address} ${row.dropoff_address}`.toLowerCase().includes(query.toLowerCase()))
  ), [query, rows, status]);
  async function update(id: string, changes: Record<string, unknown>) {
    const response = await fetch("/api/admin/reservations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...changes }) });
    if (!response.ok) return toast.error("No se pudo actualizar la reserva");
    setRows((items) => items.map((row) => row.id === id ? { ...row, ...(changes.driverId !== undefined ? { driver_id: changes.driverId as string } : {}), ...(changes.status ? { status: changes.status as string } : {}) } : row));
  }
  async function updateWithObservation(id: string, statusValue: string, action: "close" | "reopen") {
    const observation = window.prompt("Escribe la observación obligatoria");
    if (!observation?.trim()) return;
    await update(id, { status: statusValue, observation: observation.trim(), observationAction: action });
  }
  async function createReservation(formData: FormData) {
    const response = await fetch("/api/admin/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        customerEmail: formData.get("customerEmail"),
        customerPhone: formData.get("customerPhone"),
        cityId: formData.get("cityId"),
        serviceId: "private-tours",
        tourId: formData.get("tourId") || null,
        reservationDate: formData.get("reservationDate"),
        reservationTime: formData.get("reservationTime"),
        pickupAddress: formData.get("pickupAddress"),
        dropoffAddress: formData.get("dropoffAddress"),
        passengers: Number(formData.get("passengers")),
        observation: formData.get("observation")
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error ?? "No se pudo crear la reserva");
      return;
    }
    toast.success("Reserva creada");
    window.location.reload();
  }
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <details className="border-b p-4">
        <summary className="cursor-pointer font-semibold">Crear reserva administrativa</summary>
        <form action={createReservation} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input name="customerName" placeholder="Nombre del cliente" aria-label="Nombre del cliente" required />
          <Input name="customerEmail" type="email" placeholder="Correo" aria-label="Correo del cliente" required />
          <Input name="customerPhone" placeholder="Teléfono" aria-label="Teléfono del cliente" required />
          <select name="cityId" aria-label="Ciudad" className="h-10 rounded-md border bg-background px-3"><option value="bogota">Bogotá</option><option value="medellin">Medellín</option></select>
          <Input name="tourId" placeholder="ID del tour (opcional)" aria-label="ID del tour" />
          <Input name="reservationDate" type="date" aria-label="Fecha" required />
          <Input name="reservationTime" type="time" aria-label="Hora" required />
          <Input name="passengers" type="number" min="1" defaultValue="1" aria-label="Pasajeros" required />
          <Input name="pickupAddress" placeholder="Recogida" aria-label="Recogida" required />
          <Input name="dropoffAddress" placeholder="Destino" aria-label="Destino" required />
          <Input name="observation" placeholder="Observación de apertura" aria-label="Observación de apertura" required />
          <Button>Crear reserva</Button>
        </form>
      </details>
      <div className="flex flex-wrap gap-3 border-b p-4"><Input className="max-w-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente o ruta" /><select className="rounded-md border bg-background px-3" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option>{["pending","confirmed","accepted","en_route","started","completed","cancelled"].map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Ruta</th>
              <th className="px-4 py-3">Pasajeros</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Conductor y acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map((row) => {
              const payment = row.payments?.[0];
              return (
                <tr key={row.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium">{row.customers?.full_name ?? "Sin cliente"}</p>
                    <p className="text-xs text-muted-foreground">{row.customers?.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Input type="date" defaultValue={row.reservation_date} onBlur={(event) => event.target.value !== row.reservation_date && update(row.id, { reservationDate: event.target.value })} />
                    <Input className="mt-2" type="time" defaultValue={row.reservation_time.slice(0, 5)} onBlur={(event) => event.target.value !== row.reservation_time.slice(0, 5) && update(row.id, { reservationTime: event.target.value })} />
                  </td>
                  <td className="px-4 py-4">
                    <Input defaultValue={row.pickup_address} aria-label="Recogida" onBlur={(event) => event.target.value !== row.pickup_address && update(row.id, { pickupAddress: event.target.value })} />
                    <Input className="mt-2" defaultValue={row.dropoff_address} aria-label="Destino" onBlur={(event) => event.target.value !== row.dropoff_address && update(row.id, { dropoffAddress: event.target.value })} />
                  </td>
                  <td className="px-4 py-4">{row.passengers}</td>
                  <td className="px-4 py-4">
                    {payment?.status ?? "Pendiente"}
                  </td>
                  <td className="px-4 py-4">
                    <select value={row.status} onChange={(event) => update(row.id, { status: event.target.value })} className="rounded border bg-background p-2">{["pending","confirmed","accepted","en_route","started","completed","cancelled"].map((item) => <option key={item}>{item}</option>)}</select>
                  </td>
                  <td className="px-4 py-4">
                    <select aria-label="Conductor asignado" value={row.driver_id ?? ""} onChange={(event) => update(row.id, { driverId: event.target.value || null })} className="max-w-44 rounded border bg-background p-2"><option value="">Sin asignar</option>{drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.full_name}</option>)}</select>
                    {row.status !== "cancelled"
                      ? <Button className="ml-2" variant="ghost" size="sm" onClick={() => updateWithObservation(row.id, "cancelled", "close")}>Cerrar</Button>
                      : <Button className="ml-2" variant="ghost" size="sm" onClick={() => updateWithObservation(row.id, "pending", "reopen")}>Reabrir</Button>}
                    {row.reservation_observations?.length ? (
                      <details className="mt-3 max-w-xs">
                        <summary className="cursor-pointer text-xs font-medium">Observaciones ({row.reservation_observations.length})</summary>
                        <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                          {row.reservation_observations.map((item) => (
                            <li key={item.id}><span className="font-medium text-foreground">{item.author_name}</span> · {new Date(item.created_at).toLocaleString("es-CO")}<br />{item.observation}</li>
                          ))}
                        </ul>
                      </details>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No hay reservas registradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
