import { DriversManager } from "@/components/admin/drivers-manager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDriversPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("drivers").select("id,full_name,document_id,phone,status").order("full_name");
  return <section className="section bg-muted/45"><div className="container"><p className="eyebrow">Administración</p><h1 className="mt-3 text-4xl font-semibold">Conductores</h1><div className="mt-8"><DriversManager initialDrivers={(data ?? []) as never[]} /></div></div></section>;
}
