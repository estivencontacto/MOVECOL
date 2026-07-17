"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircleQuestion, X } from "lucide-react";
import { useState } from "react";
import { HelpCategorySelector } from "@/components/help/help-category";
import { HelpFaqList } from "@/components/help/help-faq-list";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { helpCategories, type HelpCategory, type HelpLanguage } from "@/lib/data/help-center";

export function HelpPanel({
  language,
  whatsappUrl
}: {
  language: HelpLanguage;
  whatsappUrl: string;
}) {
  const [activeId, setActiveId] = useState<HelpCategory["id"]>("bookings");
  const active = helpCategories.find((category) => category.id === activeId) ?? helpCategories[0];

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b p-5">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <MessageCircleQuestion className="size-5" aria-hidden />
          </span>
          <div>
            <Dialog.Title className="font-bold">{language === "EN" ? "MOVE Help Center" : "Centro de ayuda MOVE"}</Dialog.Title>
            <Dialog.Description className="mt-1 text-xs leading-5 text-muted-foreground">
              {language === "EN" ? "Find quick answers or talk to our team." : "Encuentra respuestas rápidas o habla con nuestro equipo."}
            </Dialog.Description>
          </div>
        </div>
        <Dialog.Close asChild>
          <Button type="button" variant="ghost" size="sm" aria-label={language === "EN" ? "Close help center" : "Cerrar centro de ayuda"}>
            <X className="size-5" aria-hidden />
          </Button>
        </Dialog.Close>
      </div>

      <div className="overflow-y-auto p-5">
        <HelpCategorySelector categories={helpCategories} activeId={activeId} language={language} onChange={setActiveId} />
        <div className="mt-4" role="tabpanel">
          <HelpFaqList faqs={active.faqs} language={language} />
        </div>

        <div className="mt-6 bg-primary p-5 text-primary-foreground">
          <h3 className="font-bold">{language === "EN" ? "Need personalized help?" : "¿Necesitas ayuda personalizada?"}</h3>
          <p className="mt-2 text-sm text-primary-foreground/75">
            {language === "EN" ? "Talk to a MOVE advisor on WhatsApp." : "Habla con un asesor de MOVE por WhatsApp."}
          </p>
          <Button asChild variant="secondary" className="mt-4 w-full">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-5" />
              {language === "EN" ? "Contact on WhatsApp" : "Contactar por WhatsApp"}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
