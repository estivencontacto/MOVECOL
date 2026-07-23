import { redirect } from "next/navigation";
import { TripsList } from "@/components/conductor/trips-list";
import { DriverLogoutButton } from "@/components/conductor/logout-button";
import { getActiveDriverSession } from "@/lib/auth/driver-session";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DriverPortalPage() {
  const session = await getActiveDriverSession();
  if (!session) redirect("/conductor/login");
  const { data } = await createAdminClient().from("reservations")
    .select("id,reservation_date,reservation_time,status,passengers,pickup_address,dropoff_address,notes")
    .eq("driver_id", session.driverId)
    .order("reservation_date").order("reservation_time");
  return (
    <section className="section bg-muted/45"><div className="container max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Portal de conductor</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Mis viajes</h1></div><DriverLogoutButton /></div>
      <div className="mt-8"><TripsList initialTrips={(data ?? []) as never[]} /></div>
    </div></section>
  );
}
