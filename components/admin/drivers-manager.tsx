"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Driver = { id: string; full_name: string; document_id: string; phone: string; status: string };

export function DriversManager({ initialDrivers }: { initialDrivers: Driver[] }) {
  const [drivers, setDrivers] = useState(initialDrivers);
  async function create(formData: FormData) {
    const response = await fetch("/api/admin/drivers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"), documentId: formData.get("documentId"),
        phone: formData.get("phone")
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error ?? "No se pudo registrar");
      return;
    }
    setDrivers((items) => [...items, payload.driver]);
    toast.success("Conductor registrado");
  }
  async function deactivate(id: string) {
    const response = await fetch(`/api/admin/drivers?id=${id}`, { method: "DELETE" });
    if (!response.ok) return toast.error("No se pudo desactivar");
    setDrivers((items) => items.map((item) => item.id === id ? { ...item, status: "inactive" } : item));
  }
  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form action={create} className="space-y-4 rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Registrar conductor</h2>
        <div><Label htmlFor="fullName">Nombre</Label><Input id="fullName" name="fullName" required /></div>
        <div><Label htmlFor="documentId">Cédula</Label><Input id="documentId" name="documentId" inputMode="numeric" required /></div>
        <div><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" required /></div>
        <Button className="w-full">Registrar</Button>
      </form>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-left text-sm"><thead><tr><th className="p-4">Nombre</th><th>Cédula</th><th>Teléfono</th><th>Estado</th><th /></tr></thead>
          <tbody>{drivers.map((driver) => <tr className="border-t" key={driver.id}><td className="p-4">{driver.full_name}</td><td>{driver.document_id}</td><td>{driver.phone}</td><td>{driver.status}</td><td className="pr-4 text-right">{driver.status === "active" ? <Button variant="outline" size="sm" onClick={() => deactivate(driver.id)}>Desactivar</Button> : null}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
