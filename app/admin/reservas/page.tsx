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

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reservations")
      .select(
        "id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,customers(full_name,email,phone),payments(amount_cents,status)"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    rows = (data ?? []) as unknown as ReservationRow[];
  }

  return (
    <section className="section bg-muted/45">
      <div className="container">
        <div className="mb-8">
          <p className="eyebrow">Reservas</p>
          <h1 className="mt-3 text-4xl font-semibold">Calendario y solicitudes</h1>
          <p className="mt-3 text-muted-foreground">
            Vista inicial con busqueda/filtros pendientes para el siguiente incremento del panel.
          </p>
        </div>
        <ReservationsTable rows={rows} />
      </div>
    </section>
  );
}
