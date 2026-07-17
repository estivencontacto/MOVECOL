"use client";

import { Check, CircleAlert } from "lucide-react";
import type { BookingLanguage, BookingStep } from "@/components/booking/booking-types";
import { cn } from "@/lib/utils";

const labels = {
  ES: ["Seleccionar", "Completar", "Revisar y pagar"],
  EN: ["Choose", "Complete", "Review and pay"]
} as const;

export function BookingStepper({
  currentStep,
  completedSteps,
  errorStep,
  language,
  onStepChange
}: {
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  errorStep?: BookingStep;
  language: BookingLanguage;
  onStepChange: (step: BookingStep) => void;
}) {
  return (
    <nav aria-label={language === "EN" ? "Booking progress" : "Progreso de la reserva"}>
      <ol className="relative grid grid-cols-3 gap-2">
        <span aria-hidden className="absolute left-[16.66%] right-[16.66%] top-5 h-px bg-border" />
        {labels[language].map((label, index) => {
          const step = (index + 1) as BookingStep;
          const completed = completedSteps.includes(step);
          const active = currentStep === step;
          const hasError = errorStep === step;
          const available = active || completed;

          return (
            <li key={label} className="relative z-10">
              <button
                type="button"
                disabled={!available}
                aria-current={active ? "step" : undefined}
                onClick={() => available && onStepChange(step)}
                className="group flex min-h-20 w-full flex-col items-center gap-2 text-center text-xs font-semibold disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-full border bg-background transition-colors duration-200",
                    active && "border-primary bg-primary text-primary-foreground",
                    completed && !active && "border-secondary bg-secondary text-secondary-foreground",
                    hasError && "border-destructive bg-destructive text-destructive-foreground"
                  )}
                >
                  {hasError ? (
                    <CircleAlert className="size-4" aria-hidden />
                  ) : completed && !active ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    step
                  )}
                </span>
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
