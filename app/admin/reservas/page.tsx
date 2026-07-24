import type { Metadata } from "next";
import { ReservationsTable, type ReservationRow } from "@/components/admin/reservations-table";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reservas Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminReservationsPage() {
  let rows: ReservationRow[] = [];
  let drivers: Array<{ id: string; full_name: string }> = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ data }, { data: driverData }] = await Promise.all([supabase
      .from("reservations")
      .select(
        "id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,driver_id,customers(full_name,email,phone),payments(amount_cents,status),reservation_observations(id,action,observation,author_name,created_at)"
      )
      .order("created_at", { ascending: false })
      .limit(200), supabase.from("drivers").select("id,full_name").eq("status", "active").order("full_name")]);

    rows = (data ?? []) as unknown as ReservationRow[];
    drivers = driverData ?? [];
  }

  return (
    <section className="section bg-muted/45">
      <div className="container">
        <div className="mb-8">
          <p className="eyebrow">Reservas</p>
          <h1 className="mt-3 text-4xl font-semibold">Calendario y solicitudes</h1>
          <p className="mt-3 text-muted-foreground">
            Consulta, filtra, asigna, reasigna y cancela viajes.
          </p>
        </div>
        <ReservationsTable rows={rows} drivers={drivers} />
      </div>
    </section>
  );
}
