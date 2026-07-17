import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const resources = {
  ciudades: {
    title: "Ciudades",
    description: "Administra ciudades, aeropuertos, estado de operacion y contenido SEO.",
    columns: ["Nombre", "Slug", "Estado"],
    sample: [["Medellin", "medellin", "Activa"], ["Bogota", "bogota", "Activa"]]
  },
  tours: {
    title: "Tours",
    description: "Administra galerias, inclusiones, duracion, horarios y precios base.",
    columns: ["Tour", "Ciudad", "Precio base"],
    sample: [["Guatape", "Medellin", "$850.000"], ["Monserrate", "Bogota", "$310.000"]]
  },
  servicios: {
    title: "Servicios",
    description: "Gestiona descripcion, beneficios, proceso, preguntas frecuentes y reserva.",
    columns: ["Servicio", "Categoria", "Estado"],
    sample: [["Traslado Aeropuerto", "airport-transfer", "Activo"], ["Eventos", "events", "Activo"]]
  },
  vehiculos: {
    title: "Vehiculos",
    description: "Gestiona capacidad, equipaje, fotografias y disponibilidad.",
    columns: ["Nombre", "Tipo", "Capacidad"],
    sample: [["SUV Executive", "SUV", "4"], ["Van Privada", "Van", "10"]]
  },
  conductores: {
    title: "Conductores",
    description: "Administra perfiles, documentos, contacto y estado operativo.",
    columns: ["Nombre", "Telefono", "Estado"],
    sample: [["Pendiente", "-", "Sin asignar"]]
  },
  clientes: {
    title: "Clientes",
    description: "Consulta historial, datos de contacto y notas operativas.",
    columns: ["Cliente", "Correo", "Telefono"],
    sample: [["Pendiente", "-", "-"]]
  },
  pagos: {
    title: "Pagos",
    description: "Revisa transacciones Wompi, estados y relacion con reservas.",
    columns: ["Reserva", "Proveedor", "Estado"],
    sample: [["Pendiente", "Wompi", "Pendiente"]]
  },
  opiniones: {
    title: "Opiniones",
    description: "Publica testimonios por ciudad, servicio o experiencia.",
    columns: ["Autor", "Rating", "Publicado"],
    sample: [["Laura M.", "5", "Si"]]
  },
  faq: {
    title: "Preguntas frecuentes",
    description: "Ordena preguntas por servicio y controla su publicacion.",
    columns: ["Pregunta", "Servicio", "Estado"],
    sample: [["Que pasa si mi vuelo se retrasa?", "Aeropuerto", "Publicada"]]
  },
  disponibilidad: {
    title: "Disponibilidad",
    description: "Controla capacidad por ciudad, tipo de vehiculo y fecha.",
    columns: ["Ciudad", "Vehiculo", "Capacidad"],
    sample: [["Medellin", "SUV", "4"], ["Bogota", "Van", "2"]]
  }
};

type ResourceKey = keyof typeof resources;
type Props = {
  params: Promise<{ resource: string }>;
};

export function generateStaticParams() {
  return Object.keys(resources).map((resource) => ({ resource }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  const config = resources[resource as ResourceKey];
  return {
    title: config ? `${config.title} Admin` : "Admin",
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function AdminResourcePage({ params }: Props) {
  const { resource } = await params;
  const config = resources[resource as ResourceKey];

  if (!config) notFound();

  return (
    <section className="section bg-muted/45">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: config.title }
          ]}
        />
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">CRUD</p>
            <h1 className="mt-3 text-4xl font-semibold">{config.title}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{config.description}</p>
          </div>
          <Button>
            <Plus className="size-4" aria-hidden />
            Nuevo
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Registros</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input className="pl-9" placeholder="Buscar" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    {config.columns.map((column) => (
                      <th key={column} className="border-b px-3 py-3">
                        {column}
                      </th>
                    ))}
                    <th className="border-b px-3 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {config.sample.map((row) => (
                    <tr key={row.join("-")}>
                      {row.map((cell) => (
                        <td key={cell} className="border-b px-3 py-4">
                          {cell}
                        </td>
                      ))}
                      <td className="border-b px-3 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Esta pantalla queda lista para conectar formularios de crear, editar y eliminar contra
              Supabase usando los contratos de `supabase/migrations/001_initial_schema.sql`.
            </p>
          </CardContent>
        </Card>

        <Button asChild variant="ghost" className="mt-6 px-0">
          <Link href="/admin">Volver al dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
