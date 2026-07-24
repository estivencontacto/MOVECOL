"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminTour = {
  id: string; city_id: string; name: string; slug: string; description: string;
  duration: string; base_price_cents: number; active: boolean; featured: boolean; is_test: boolean;
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ToursManager({ initialTours }: { initialTours: AdminTour[] }) {
  const [tours, setTours] = useState(initialTours);
  const [editing, setEditing] = useState<AdminTour | null>(null);

  async function save(formData: FormData) {
    const name = String(formData.get("name"));
    const id = editing?.id ?? `${formData.get("cityId")}-${slugify(name)}`;
    const body = {
      id,
      cityId: formData.get("cityId"),
      name,
      slug: String(formData.get("slug") || slugify(name)),
      description: formData.get("description"),
      duration: formData.get("duration"),
      priceCop: Number(formData.get("priceCop")),
      active: formData.get("active") === "on",
      featured: formData.get("featured") === "on",
      isTest: formData.get("isTest") === "on"
    };
    const response = await fetch("/api/admin/tours", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error ?? "No se pudo guardar");
      return;
    }
    setTours((items) => editing ? items.map((item) => item.id === id ? payload.tour : item) : [...items, payload.tour]);
    setEditing(null);
    toast.success(editing ? "Tour actualizado" : "Tour creado");
  }

  async function toggle(tour: AdminTour) {
    const response = await fetch("/api/admin/tours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: tour.id, cityId: tour.city_id, name: tour.name, slug: tour.slug,
        description: tour.description, duration: tour.duration,
        priceCop: tour.base_price_cents / 100, active: !tour.active,
        featured: tour.featured, isTest: tour.is_test
      })
    });
    const payload = await response.json();
    if (!response.ok) return toast.error("No se pudo cambiar el estado");
    setTours((items) => items.map((item) => item.id === tour.id ? payload.tour : item));
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <form key={editing?.id ?? "new"} action={save} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-xl font-semibold">{editing ? "Editar tour" : "Crear tour"}</h2>
        <div><Label htmlFor="tour-name">Nombre</Label><Input id="tour-name" name="name" defaultValue={editing?.name} required /></div>
        <div><Label htmlFor="tour-slug">Slug</Label><Input id="tour-slug" name="slug" defaultValue={editing?.slug} placeholder="Se genera automáticamente" /></div>
        <div><Label htmlFor="tour-city">Ciudad</Label><select id="tour-city" name="cityId" defaultValue={editing?.city_id ?? "bogota"} className="h-10 w-full rounded-md border bg-background px-3"><option value="bogota">Bogotá</option><option value="medellin">Medellín</option></select></div>
        <div><Label htmlFor="tour-description">Descripción</Label><Input id="tour-description" name="description" defaultValue={editing?.description} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label htmlFor="tour-duration">Duración</Label><Input id="tour-duration" name="duration" defaultValue={editing?.duration ?? "1 hora"} required /></div>
          <div><Label htmlFor="tour-price">Valor COP</Label><Input id="tour-price" name="priceCop" type="number" min="1" defaultValue={editing ? editing.base_price_cents / 100 : 1000} required /></div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label><input className="mr-2" name="active" type="checkbox" defaultChecked={editing?.active ?? true} />Activo</label>
          <label><input className="mr-2" name="featured" type="checkbox" defaultChecked={editing?.featured} />Destacado</label>
          <label><input className="mr-2" name="isTest" type="checkbox" defaultChecked={editing?.is_test} />Prueba</label>
        </div>
        <div className="flex gap-2"><Button>{editing ? "Guardar" : "Crear"}</Button>{editing ? <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancelar</Button> : null}</div>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/60"><tr><th className="p-4">Tour</th><th>Ciudad</th><th>Valor</th><th>Tipo</th><th>Estado</th><th className="pr-4 text-right">Acciones</th></tr></thead>
          <tbody>{tours.map((tour) => <tr className="border-t" key={tour.id}>
            <td className="p-4 font-medium">{tour.name}</td><td>{tour.city_id}</td>
            <td>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(tour.base_price_cents / 100)}</td>
            <td>{tour.is_test ? "Prueba" : tour.featured ? "Destacado" : "Normal"}</td>
            <td>{tour.active ? "Activo" : "Inactivo"}</td>
            <td className="space-x-2 pr-4 text-right"><Button size="sm" variant="ghost" onClick={() => setEditing(tour)}>Editar</Button><Button size="sm" variant="outline" onClick={() => toggle(tour)}>{tour.active ? "Desactivar" : "Activar"}</Button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
