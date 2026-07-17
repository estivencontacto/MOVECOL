"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HelpPanel } from "@/components/help/help-panel";
import { useLanguage } from "@/components/preferences/site-preferences";
import { company } from "@/lib/legal/company";
import { cn } from "@/lib/utils";

type BookingContext = { city?: string; item?: string };

export function FloatingHelpCenter() {
  const pathname = usePathname();
  const [language] = useLanguage();
  const [open, setOpen] = useState(false);
  const [bookingContext, setBookingContext] = useState<BookingContext>({});
  const hidden = pathname.startsWith("/admin") || pathname === "/login";

  useEffect(() => {
    const listener = (event: Event) => {
      setBookingContext((event as CustomEvent<BookingContext>).detail ?? {});
    };
    window.addEventListener("move:booking-context", listener);
    return () => window.removeEventListener("move:booking-context", listener);
  }, []);

  const whatsappUrl = useMemo(() => {
    const pageLabel = pathname === "/reservar" ? "la página de reservas" : "el sitio de MOVE Colombia";
    const message =
      bookingContext.item && bookingContext.city
        ? `Hola, necesito ayuda con una reserva de ${bookingContext.item} en ${bookingContext.city}.`
        : `Hola, estoy en ${pageLabel} y necesito ayuda.`;
    const number = company.phoneHref.replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [bookingContext.city, bookingContext.item, pathname]);

  if (hidden) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          aria-expanded={open}
          aria-controls="move-help-panel"
          aria-label={language === "EN" ? "Open help center" : "Abrir centro de ayuda"}
          className={cn(
            "focus-ring fixed right-4 z-[70] inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/92 md:right-6",
            pathname === "/reservar" ? "bottom-24 lg:bottom-6" : "bottom-5 md:bottom-6",
            open && "bg-secondary text-secondary-foreground"
          )}
        >
          <MessageCircleQuestion className="size-5" aria-hidden />
          <span className="hidden sm:inline">{language === "EN" ? "Need help?" : "¿Necesitas ayuda?"}</span>
        </motion.button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[75] bg-[#07162f]/60 md:bg-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.section
                id="move-help-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-x-0 bottom-0 z-[76] flex max-h-[88vh] flex-col bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_-24px_60px_-32px_rgba(0,0,0,0.55)] outline-none md:bottom-6 md:left-auto md:right-6 md:w-[390px] md:max-h-[70vh] md:border"
              >
                <HelpPanel language={language} whatsappUrl={whatsappUrl} />
              </motion.section>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
