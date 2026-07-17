"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronUp, X } from "lucide-react";
import type { BookingLanguage, BookingStep, RoutePricingResponse } from "@/components/booking/booking-types";
import { BookingSummaryDetails } from "@/components/booking/booking-summary";
import { Price } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";
import { services, tours } from "@/lib/data/catalog";
import type { ReservationInput } from "@/lib/domain/schemas";
import type { PriceEstimate } from "@/lib/services/pricing";

export function MobileBookingSummary({
  values,
  estimate,
  routeData,
  routePending,
  language,
  currentStep,
  pending,
  onContinue
}: {
  values: ReservationInput;
  estimate: PriceEstimate;
  routeData?: RoutePricingResponse;
  routePending: boolean;
  language: BookingLanguage;
  currentStep: BookingStep;
  pending: boolean;
  onContinue: () => void;
}) {
  const name = tours.find((item) => item.id === values.tourId)?.name ?? services.find((item) => item.id === values.serviceId)?.title ?? "-";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_35px_-28px_rgba(0,0,0,0.45)] lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{name}</p>
          {estimate.quoteOnly ? (
            <p className="text-sm font-bold">
              {language === "EN" ? "Price to confirm" : "Precio por confirmar"}
            </p>
          ) : (
            <Price value={estimate.amount} className="text-lg font-black" />
          )}
        </div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button type="button" variant="ghost" size="sm">
              {language === "EN" ? "Summary" : "Ver resumen"} <ChevronUp className="size-4" aria-hidden />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#07162f]/70" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-[81] max-h-[82vh] overflow-y-auto bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.55)]">
              <div className="mb-5 flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold">{language === "EN" ? "Booking summary" : "Resumen de reserva"}</Dialog.Title>
                <Dialog.Close asChild><Button type="button" variant="ghost" size="sm" aria-label={language === "EN" ? "Close summary" : "Cerrar resumen"}><X className="size-5" aria-hidden /></Button></Dialog.Close>
              </div>
              <BookingSummaryDetails values={values} estimate={estimate} routeData={routeData} routePending={routePending} language={language} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Button
          type={currentStep === 3 ? "submit" : "button"}
          size="sm"
          disabled={pending}
          onClick={currentStep === 3 ? undefined : onContinue}
        >
          {currentStep === 3
            ? estimate.quoteOnly
              ? "WhatsApp"
              : (language === "EN" ? "Confirm" : "Confirmar")
            : (language === "EN" ? "Continue" : "Continuar")}
        </Button>
      </div>
    </div>
  );
}
