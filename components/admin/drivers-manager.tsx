"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Driver = { id: string; full_name: string; document_id: string; phone: string | null; status: string };

export function DriversManager({ initialDrivers }: { initialDrivers: Driver[] }) {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function request(method: "POST" | "PATCH", body: Record<string, unknown>) {
    const response = await fetch("/api/admin/drivers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "No se pudo guardar");
    return payload.driver as Driver;
  }

  async function create(formData: FormData) {
    try {
      const driver = await request("POST", {
        fullName: formData.get("fullName"),
        documentId: formData.get("documentId"),
        phone: formData.get("phone")
      });
      setDrivers((items) => [...items, driver].sort((a, b) => a.full_name.localeCompare(b.full_name)));
      toast.success("Conductor registrado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar");
    }
  }

  async function save(driver: Driver, formData: FormData) {
    try {
      const updated = await request("PATCH", {
        id: driver.id,
        fullName: formData.get("fullName"),
        documentId: formData.get("documentId"),
        phone: formData.get("phone"),
        status: formData.get("status")
      });
      setDrivers((items) => items.map((item) => item.id === driver.id ? updated : item));
      setEditingId(null);
      toast.success("Conductor actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar");
    }
  }

  async function setActive(driver: Driver, active: boolean) {
    try {
      const updated = await request("PATCH", {
        id: driver.id,
        fullName: driver.full_name,
        documentId: driver.document_id,
        phone: driver.phone ?? "",
        status: active ? "active" : "inactive"
      });
      setDrivers((items) => items.map((item) => item.id === driver.id ? updated : item));
      toast.success(active ? "Conductor activado" : "Conductor desactivado");
    } catch {
      toast.error("No se pudo cambiar el estado");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <form action={create} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Registrar conductor</h2>
        <div><Label htmlFor="fullName">Nombre</Label><Input id="fullName" name="fullName" required minLength={3} /></div>
        <div><Label htmlFor="documentId">Cédula</Label><Input id="documentId" name="documentId" inputMode="numeric" pattern="[0-9]{5,20}" required /></div>
        <div><Label htmlFor="phone">Teléfono (opcional)</Label><Input id="phone" name="phone" inputMode="tel" /></div>
        <Button className="w-full">Registrar</Button>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-muted/60">
            <tr><th className="p-4">Nombre</th><th>Cédula</th><th>Teléfono</th><th>Estado</th><th className="pr-4 text-right">Acciones</th></tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr className="border-t" key={driver.id}>
                {editingId === driver.id ? (
                  <td colSpan={5} className="p-4">
                    <form action={(data) => save(driver, data)} className="grid gap-3 sm:grid-cols-4">
                      <Input name="fullName" defaultValue={driver.full_name} aria-label="Nombre" required />
                      <Input name="documentId" defaultValue={driver.document_id} aria-label="Cédula" required />
                      <Input name="phone" defaultValue={driver.phone ?? ""} aria-label="Teléfono" />
                      <div className="flex gap-2">
                        <input type="hidden" name="status" value={driver.status} />
                        <Button size="sm">Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-medium">{driver.full_name}</td>
                    <td>{driver.document_id}</td>
                    <td>{driver.phone || "—"}</td>
                    <td>{driver.status === "active" ? "Activo" : "Inactivo"}</td>
                    <td className="space-x-2 pr-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(driver.id)}>Editar</Button>
                      <Button variant="outline" size="sm" onClick={() => setActive(driver, driver.status !== "active")}>
                        {driver.status === "active" ? "Desactivar" : "Activar"}
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
