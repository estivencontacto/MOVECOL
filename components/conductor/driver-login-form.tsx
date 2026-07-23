"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export function DriverLoginForm() {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) return;
    const render = () => {
      if (!captchaRef.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(captchaRef.current, {
        sitekey,
        callback: setCaptchaToken,
        "expired-callback": () => setCaptchaToken("")
      });
    };
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  async function login(formData: FormData) {
    setLoading(true);
    const response = await fetch("/api/conductor/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId: String(formData.get("documentId")).replace(/\D/g, ""),
        captchaToken
      })
    });
    setLoading(false);
    if (!response.ok) {
      toast.error("No fue posible iniciar sesión. Verifica los datos e intenta más tarde.");
      window.turnstile?.reset(widgetId.current);
      setCaptchaToken("");
      return;
    }
    window.location.href = "/conductor";
  }

  return (
    <Card className="w-full max-w-md border-primary/15 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-4 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><ShieldCheck aria-hidden /></span>
        <div><CardTitle className="text-2xl">Portal de conductor</CardTitle><p className="mt-2 text-sm text-muted-foreground">Ingresa con la cédula registrada por MOVE.</p></div>
      </CardHeader>
      <CardContent>
        <form action={login} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="documentId">Cédula</Label><Input id="documentId" name="documentId" inputMode="numeric" autoComplete="username" pattern="[0-9]{5,20}" required aria-describedby="document-help" /><p id="document-help" className="text-xs text-muted-foreground">Solo números, sin puntos ni espacios.</p></div>
          <div ref={captchaRef} className="min-h-[65px]" aria-label="Verificación de seguridad" />
          <Button className="w-full" size="lg" disabled={loading || !captchaToken}>{loading ? "Verificando..." : "Ingresar"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
