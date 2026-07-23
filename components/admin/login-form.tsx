"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const params = useSearchParams();
  const redirectParam = params.get("redirect");
  const redirect = redirectParam?.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/admin";
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: `${String(formData.get("username")).trim().toLowerCase()}@admin.movecolombia.invalid`,
      password: String(formData.get("password"))
    });
    setIsLoading(false);

    if (error) {
      toast.error("No fue posible iniciar sesion", { description: error.message });
      return;
    }

    window.location.href = redirect;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Acceso administrativo</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
