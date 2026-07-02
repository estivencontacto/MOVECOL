import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Pagina no encontrada</h1>
        <p className="mt-4 text-muted-foreground">
          La ruta que buscas no existe o todavia no esta publicada.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </section>
  );
}
