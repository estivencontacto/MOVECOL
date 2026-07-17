"use client";

import {
  BusFront,
  CalendarCheck,
  CreditCard,
  MapPinned,
  RefreshCcw,
  Route
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HelpCategory, HelpLanguage } from "@/lib/data/help-center";
import { cn } from "@/lib/utils";

const icons: Record<HelpCategory["id"], LucideIcon> = {
  bookings: CalendarCheck,
  tours: Route,
  payments: CreditCard,
  changes: RefreshCcw,
  vehicles: BusFront,
  coverage: MapPinned
};

export function HelpCategorySelector({
  categories,
  activeId,
  language,
  onChange
}: {
  categories: HelpCategory[];
  activeId: HelpCategory["id"];
  language: HelpLanguage;
  onChange: (id: HelpCategory["id"]) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="tablist">
      {categories.map((category) => {
        const Icon = icons[category.id];
        const active = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(category.id)}
            className={cn(
              "focus-ring inline-flex min-h-10 shrink-0 items-center gap-2 border px-3 text-xs font-semibold",
              active ? "border-primary bg-primary text-primary-foreground" : "bg-background"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {category.label[language]}
          </button>
        );
      })}
    </div>
  );
}
