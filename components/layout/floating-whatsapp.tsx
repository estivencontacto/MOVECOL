import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

const whatsappUrl = "https://wa.link/6f907x";

export function FloatingWhatsapp() {
  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir chat de WhatsApp"
      className="fixed bottom-5 right-5 z-[70] grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-16px_rgba(37,211,102,0.85)] transition [transition-duration:250ms] hover:-translate-y-1 hover:scale-105 hover:bg-[#1ebe5d] active:scale-95 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="size-8" />
    </Link>
  );
}
