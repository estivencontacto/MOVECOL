import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Car,
  ClipboardList,
  CreditCard,
  Globe2,
  Landmark,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Star,
  UsersRound,
  UserRound
} from "lucide-react";
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
          <StatCard icon={ClipboardList} title="Reservas" value={String(reservationCount)} helper="Solicitudes registradas" />
          <StatCard icon={UsersRound} title="Clientes" value={String(customerCount)} helper="Contactos unificados" />
          <StatCard icon={Landmark} title="Tours" value={String(tours.length)} helper="Administrables por ciudad" />
          <StatCard icon={Car} title="Vehiculos" value={String(vehicles.length)} helper="Tipos activos iniciales" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPinned, title: "Ciudades", value: `${cities.length} activas` },
            { icon: CalendarDays, title: "Servicios", value: `${services.length} configurados` },
            { icon: Car, title: "Flota", value: "Sedan, SUV, Van, Bus" },
            { icon: UsersRound, title: "Roles", value: "Admin, Operador, Cliente" }
          ].map((item) => (
            <Card key={item.title} className="premium-card overflow-hidden">
              <CardHeader>
                <span className="premium-icon">
                  <item.icon className="size-5" aria-hidden />
                </span>
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
              { label: "Ciudades", href: "/admin/ciudades", icon: Globe2 },
              { label: "Tours", href: "/admin/tours", icon: Landmark },
              { label: "Servicios", href: "/admin/servicios", icon: BriefcaseBusiness },
              { label: "Vehiculos", href: "/admin/vehiculos", icon: Car },
              { label: "Conductores", href: "/admin/conductores", icon: ShieldCheck },
              { label: "Clientes", href: "/admin/clientes", icon: UserRound },
              { label: "Pagos", href: "/admin/pagos", icon: CreditCard },
              { label: "Opiniones", href: "/admin/opiniones", icon: Star },
              { label: "FAQ", href: "/admin/faq", icon: MessageSquareText },
              { label: "Disponibilidad", href: "/admin/disponibilidad", icon: CalendarDays }
            ].map((item) => (
              <Button key={item.href} asChild variant="outline" className="justify-start gap-2 rounded-lg bg-card/70">
                <Link href={item.href}>
                  <item.icon className="size-4 text-primary" aria-hidden />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
