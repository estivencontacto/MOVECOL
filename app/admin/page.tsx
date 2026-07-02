import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Car, MapPinned, UsersRound } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cities, services, tours, vehicles } from "@/lib/data/catalog";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  let reservationCount = 0;
  let customerCount = 0;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ count: reservations }, { count: customers }] = await Promise.all([
      supabase.from("reservations").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true })
    ]);
    reservationCount = reservations ?? 0;
    customerCount = customers ?? 0;
  }

  return (
    <section className="section bg-muted/45">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Panel administrativo</p>
            <h1 className="mt-3 text-4xl font-semibold">Operacion MOVE Colombia</h1>
            <p className="mt-3 text-muted-foreground">
              Dashboard inicial para reservas, catalogo operativo y crecimiento nacional.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/reservas">Ver reservas</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Reservas" value={String(reservationCount)} helper="Solicitudes registradas" />
          <StatCard title="Clientes" value={String(customerCount)} helper="Contactos unificados" />
          <StatCard title="Tours" value={String(tours.length)} helper="Administrables por ciudad" />
          <StatCard title="Vehiculos" value={String(vehicles.length)} helper="Tipos activos iniciales" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPinned, title: "Ciudades", value: `${cities.length} activas` },
            { icon: CalendarDays, title: "Servicios", value: `${services.length} configurados` },
            { icon: Car, title: "Flota", value: "Sedan, SUV, Van, Bus" },
            { icon: UsersRound, title: "Roles", value: "Admin, Operador, Cliente" }
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-5 text-primary" aria-hidden />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.value}</CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Modulos operativos</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {[
              ["Ciudades", "/admin/ciudades"],
              ["Tours", "/admin/tours"],
              ["Servicios", "/admin/servicios"],
              ["Vehiculos", "/admin/vehiculos"],
              ["Conductores", "/admin/conductores"],
              ["Clientes", "/admin/clientes"],
              ["Pagos", "/admin/pagos"],
              ["Opiniones", "/admin/opiniones"],
              ["FAQ", "/admin/faq"],
              ["Disponibilidad", "/admin/disponibilidad"]
            ].map(([label, href]) => (
              <Button key={href} asChild variant="outline" className="justify-start">
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
