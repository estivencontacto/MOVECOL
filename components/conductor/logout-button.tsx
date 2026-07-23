"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DriverLogoutButton() {
  async function logout() {
    await fetch("/api/conductor/session", { method: "DELETE" });
    window.location.href = "/conductor/login";
  }
  return <Button variant="outline" onClick={logout}><LogOut className="size-4" aria-hidden />Salir</Button>;
}
