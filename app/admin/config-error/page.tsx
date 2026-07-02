import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminConfigErrorPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-12">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-destructive" aria-hidden />
            Configuracion requerida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            El panel administrativo esta bloqueado porque faltan variables publicas
            de Supabase. Esta proteccion evita que una ruta privada quede expuesta
            sin verificacion de sesion.
          </p>
          <p>
            Revisa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            en el entorno de despliegue.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
