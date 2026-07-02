import Link from "next/link";
import Image from "next/image";
import { cities, services } from "@/lib/data/catalog";

const logoSrc = "/images/move-logo-original.png";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3 font-semibold">
            <span className="relative size-10 overflow-hidden rounded-md bg-primary-foreground">
              <Image src={logoSrc} alt="MOVE Colombia" fill className="object-cover" sizes="40px" />
            </span>
            MOVE Colombia
          </div>
          <p className="max-w-sm text-sm leading-6 text-primary-foreground/76">
            Movilidad privada y experiencias en Colombia. Servicio 100% privado, seguro y
            personalizado a nivel nacional.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Servicios</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/76">
            {services.slice(0, 5).map((service) => (
              <li key={service.id}>
                <Link href={`/servicios/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Destinos</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/76">
            {cities.map((city) => (
              <li key={city.id}>
                <Link href={`/destinos/${city.slug}`}>{city.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Contacto</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/76">
            <li>+57 314 727 8404</li>
            <li>reservas@movecolombia.co</li>
            <li>Colombia</li>
            <li>Viaja en confianza. Sin afanes.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/12 py-5">
        <div className="container flex flex-col gap-2 text-xs text-primary-foreground/64 md:flex-row md:items-center md:justify-between">
          <span>Copyright 2026 MOVE Colombia. Todos los derechos reservados.</span>
          <span>movecolombia.co</span>
        </div>
      </div>
    </footer>
  );
}
