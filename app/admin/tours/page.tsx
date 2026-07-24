import { ToursManager, type AdminTour } from "@/components/admin/tours-manager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminToursPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("tours")
    .select("id,city_id,name,slug,description,duration,base_price_cents,active,featured,is_test")
    .order("city_id").order("name");
  return (
    <section className="section bg-muted/45">
      <div className="container">
        <p className="eyebrow">Administración</p>
        <h1 className="mt-3 text-4xl font-semibold">Tours</h1>
        <p className="mt-3 text-muted-foreground">Crea, consulta, edita y activa o desactiva tours persistidos en la base de datos.</p>
        <div className="mt-8"><ToursManager initialTours={(data ?? []) as AdminTour[]} /></div>
      </div>
    </section>
  );
}
