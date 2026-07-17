"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { HelpFaq, HelpLanguage } from "@/lib/data/help-center";

export function HelpFaqList({
  faqs,
  language
}: {
  faqs: HelpFaq[];
  language: HelpLanguage;
}) {
  return (
    <Accordion.Root type="single" collapsible className="border-t">
      {faqs.map((item) => (
        <Accordion.Item key={item.id} value={item.id} className="border-b">
          <Accordion.Header>
            <Accordion.Trigger className="group focus-ring flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-sm font-semibold">
              {item.question[language]}
              <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden text-sm leading-6 text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="pb-4">{item.answer[language]}</p>
            {item.href ? (
              <Link href={item.href} className="mb-4 inline-flex min-h-10 items-center font-semibold text-primary underline underline-offset-4">
                {language === "EN" ? "View policy" : "Ver política"}
              </Link>
            ) : null}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
