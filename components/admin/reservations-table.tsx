import { formatCurrency } from "@/lib/utils";

export type ReservationRow = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
  passengers: number;
  pickup_address: string;
  dropoff_address: string;
  customers?: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  payments?: Array<{
    amount_cents: number | null;
    status: string | null;
  }>;
};

export function ReservationsTable({ rows }: { rows: ReservationRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
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
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => {
              const payment = row.payments?.[0];
              return (
                <tr key={row.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium">{row.customers?.full_name ?? "Sin cliente"}</p>
                    <p className="text-xs text-muted-foreground">{row.customers?.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    {row.reservation_date} | {row.reservation_time}
                  </td>
                  <td className="px-4 py-4">
                    <p>{row.pickup_address}</p>
                    <p className="text-xs text-muted-foreground">{row.dropoff_address}</p>
                  </td>
                  <td className="px-4 py-4">{row.passengers}</td>
                  <td className="px-4 py-4">
                    {payment?.amount_cents ? formatCurrency(payment.amount_cents / 100) : "Pendiente"}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      {payment?.status ?? row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
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
