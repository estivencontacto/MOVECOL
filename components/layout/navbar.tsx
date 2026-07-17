"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  ChevronRight,
  Menu,
  MessageCircleMore,
  X
} from "lucide-react";
import { PreferenceSwitcher, useLanguage } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";

const logoSrc = "/images/move-logo-original.png";

const nav = [
  { href: "/", label: { ES: "Inicio", EN: "Home" } },
  { href: "/#destinos", label: { ES: "Tours", EN: "Tours" } },
  { href: "/#servicios", label: { ES: "Servicios", EN: "Services" } },
  { href: "/destinos/bogota", label: { ES: "Bogotá", EN: "Bogotá" } },
  { href: "/destinos/medellin", label: { ES: "Medellín", EN: "Medellín" } },
  { href: "/#contacto", label: { ES: "Contacto", EN: "Contact" } }
];

export function Navbar() {
  const [language] = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/12 bg-[#07162f] text-white">
        <div className="container flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3 font-bold">
            <span className="relative size-10 overflow-hidden rounded-md bg-white">
              <Image
                src={logoSrc}
                alt="MOVE Colombia"
                fill
                priority
                className="object-cover"
                sizes="40px"
              />
            </span>
            <span className="hidden sm:inline">MOVE Colombia</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm font-semibold text-white/76 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap transition-colors duration-200 hover:text-white focus-visible:text-white"
              >
                {item.label[language]}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <PreferenceSwitcher />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/24 bg-white/8 text-white hover:bg-white/14 active:scale-[0.98]"
            >
              <Link href="https://wa.link/6f907x" target="_blank" rel="noreferrer">
                <MessageCircleMore className="size-4" strokeWidth={1.8} aria-hidden />
                WhatsApp
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="active:scale-[0.98]">
              <Link href="/reservar">
                <CalendarCheck className="size-4" strokeWidth={1.8} aria-hidden />
                {language === "EN" ? "Book" : "Reservar"}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <PreferenceSwitcher />
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  aria-label={language === "EN" ? "Open menu" : "Abrir menú"}
                >
                  <Menu className="size-5" strokeWidth={1.8} aria-hidden />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[#07162f]/72 backdrop-blur-sm data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,390px)] flex-col bg-background p-5 text-foreground shadow-[-18px_0_45px_-32px_rgba(0,0,0,0.6)] outline-none data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
                  <div className="flex items-center justify-between gap-4 border-b pb-5">
                    <Dialog.Title className="text-lg font-bold">MOVE Colombia</Dialog.Title>
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={language === "EN" ? "Close menu" : "Cerrar menú"}
                      >
                        <X className="size-5" strokeWidth={1.8} aria-hidden />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <nav className="flex flex-1 flex-col py-4">
                    {nav.map((item) => (
                      <Dialog.Close asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between border-b py-4 text-base font-semibold"
                        >
                          {item.label[language]}
                          <ChevronRight className="size-4 text-muted-foreground" strokeWidth={1.8} aria-hidden />
                        </Link>
                      </Dialog.Close>
                    ))}
                  </nav>
                  <div className="grid gap-3 border-t pt-5">
                    <Button asChild variant="outline">
                      <Link href="https://wa.link/6f907x" target="_blank" rel="noreferrer">
                        <MessageCircleMore className="size-4" strokeWidth={1.8} aria-hidden />
                        WhatsApp
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/reservar">
                        <CalendarCheck className="size-4" strokeWidth={1.8} aria-hidden />
                        {language === "EN" ? "Book" : "Reservar"}
                      </Link>
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
      {isHome ? null : <div className="h-[72px]" aria-hidden />}
    </>
  );
}
