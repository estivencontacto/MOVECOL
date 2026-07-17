"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/preferences/site-preferences";
import { company } from "@/lib/legal/company";

const logoSrc = "/images/move-logo-original.png";
const footerImage =
  "/images/MEDELLIN/TOURS/CITY TOUR MEDELLIN/HERO/images (2).jpg";

const footerCopy = {
  ES: {
    description:
      "Transporte privado y experiencias personalizadas en Bogotá y Medellín.",
    explore: "Explora",
    legal: "Legal",
    contact: "Contacto",
    home: "Inicio",
    bogota: "Tours en Bogotá",
    medellin: "Tours en Medellín",
    services: "Servicios",
    book: "Reservar",
    terms: "Términos y condiciones",
    privacy: "Privacidad y datos",
    cookies: "Política de cookies",
    cancellations: "Cancelaciones y reembolsos",
    pqrs: "PQRS",
    principalCity: "Ciudad principal de operación",
    rights: "Todos los derechos reservados."
  },
  EN: {
    description:
      "Private transport and tailored experiences in Bogotá and Medellín.",
    explore: "Explore",
    legal: "Legal",
    contact: "Contact",
    home: "Home",
    bogota: "Tours in Bogotá",
    medellin: "Tours in Medellín",
    services: "Services",
    book: "Book",
    terms: "Terms and conditions",
    privacy: "Privacy and data",
    cookies: "Cookie policy",
    cancellations: "Cancellations and refunds",
    pqrs: "Requests and complaints",
    principalCity: "Principal city of operation",
    rights: "All rights reserved."
  }
};

export function Footer() {
  const [language] = useLanguage();
  const t = footerCopy[language];

  return (
    <footer className="relative overflow-hidden bg-[#061329] text-white">
      <Image
        src={footerImage}
        alt=""
        fill
        className="object-cover opacity-[0.055]"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#061329]/90" />
      <div className="container relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="relative size-11 overflow-hidden rounded-md bg-white">
              <Image src={logoSrc} alt="MOVE Colombia" fill className="object-cover" sizes="44px" />
            </span>
            MOVE Colombia
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/68">{t.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{t.explore}</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/66">
            <li><Link href="/">{t.home}</Link></li>
            <li><Link href="/destinos/bogota#tours">{t.bogota}</Link></li>
            <li><Link href="/destinos/medellin#tours">{t.medellin}</Link></li>
            <li><Link href="/#servicios">{t.services}</Link></li>
            <li><Link href="/reservar">{t.book}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{t.legal}</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/66">
            <li><Link href="/legal/terminos-y-condiciones">{t.terms}</Link></li>
            <li><Link href="/legal/privacidad">{t.privacy}</Link></li>
            <li><Link href="/legal/cookies">{t.cookies}</Link></li>
            <li><Link href="/legal/cancelaciones-y-reembolsos">{t.cancellations}</Link></li>
            <li><Link href="/legal/pqrs">{t.pqrs}</Link></li>
            <li>
              <a href="https://www.sic.gov.co/" target="_blank" rel="noreferrer">
                Superintendencia de Industria y Comercio
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{t.contact}</h2>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li>
              <a href={company.phoneHref} className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-secondary" strokeWidth={1.8} aria-hidden />
                {company.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.generalEmail}`} className="flex items-start gap-3 break-all">
                <Mail className="mt-0.5 size-4 shrink-0 text-secondary" strokeWidth={1.8} aria-hidden />
                {company.generalEmail}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" strokeWidth={1.8} aria-hidden />
              <span>{t.principalCity}: {company.principalCity}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/12 py-5">
        <div className="container flex flex-col gap-2 text-xs text-white/52 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} MOVE Colombia. {t.rights}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/legal/terminos-y-condiciones">{t.terms}</Link>
            <Link href="/legal/privacidad">{t.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
