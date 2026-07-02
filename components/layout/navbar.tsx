"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Mail, MapPin, Menu, Phone } from "lucide-react";
import { PreferenceSwitcher, useLanguage } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

const logoSrc = "/images/move-logo-original.png";

const nav = [
  { href: "/#servicios", label: { ES: "Servicios", EN: "Services" } },
  { href: "/#destinos", label: { ES: "Destinos", EN: "Destinations" } },
  { href: "/#vehiculos", label: { ES: "Vehiculos", EN: "Fleet" } }
];

export function Navbar() {
  const [language] = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    const update = () => setScrolled(!isHome || window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <>
    <header
      className={
        transparent
          ? "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-transparent text-white transition-all duration-300"
          : "fixed inset-x-0 top-0 z-50 border-b bg-background/92 text-foreground shadow-sm backdrop-blur-xl transition-all duration-300"
      }
    >
      <div
        className={
          transparent
            ? "hidden border-b border-white/10 py-2 text-xs font-semibold text-white/88 md:block"
            : "hidden border-b bg-primary py-2 text-xs font-semibold text-primary-foreground md:block"
        }
      >
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5" aria-hidden />
              Colombia
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-3.5" aria-hidden />
              +57 314 727 8404
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-3.5" aria-hidden />
              reservas@movecolombia.co
            </span>
          </div>
          <span>{language === "EN" ? "Travel with confidence. No rush." : "Viaja en confianza. Sin afanes."}</span>
        </div>
      </div>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="relative size-10 overflow-hidden rounded-md bg-primary shadow-sm">
            <Image src={logoSrc} alt="MOVE Colombia" fill priority className="object-cover" sizes="40px" />
          </span>
          <span>MOVE Colombia</span>
        </Link>
        <nav className={transparent ? "hidden items-center gap-7 text-sm font-medium text-white/82 md:flex" : "hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={transparent ? "transition hover:text-white" : "transition hover:text-foreground"}>
              {item.label[language]}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <PreferenceSwitcher />
          <Button asChild variant={transparent ? "secondary" : "ghost"} size="sm" className="transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]">
            <Link href="https://wa.link/6f907x" target="_blank">
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </Link>
          </Button>
          <Button asChild size="sm" className="transition [transition-duration:250ms] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/reservar">
              <CalendarCheck className="size-4" aria-hidden />
              {language === "EN" ? "Book" : "Reservar"}
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <PreferenceSwitcher />
          <Button variant="ghost" size="sm" aria-label="Abrir menu">
            <Menu className="size-5" aria-hidden />
          </Button>
        </div>
      </div>
    </header>
    {isHome ? null : <div className="h-16 md:h-[6.15rem]" aria-hidden />}
    </>
  );
}
