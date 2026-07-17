"use client";

import {
  BadgeCheck,
  CreditCard,
  Headphones,
  MessageCircleMore,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/components/preferences/site-preferences";
import { landingCopy } from "@/components/landing/landing-copy";

const trustItems = {
  ES: [
    { icon: ShieldCheck, label: "Servicio privado" },
    { icon: BadgeCheck, label: "Conductores profesionales" },
    { icon: MessageCircleMore, label: "Atención directa" },
    { icon: CreditCard, label: "Pago mediante Wompi" },
    { icon: Headphones, label: "Soporte antes y durante" }
  ],
  EN: [
    { icon: ShieldCheck, label: "Private service" },
    { icon: BadgeCheck, label: "Professional drivers" },
    { icon: MessageCircleMore, label: "Direct support" },
    { icon: CreditCard, label: "Payments through Wompi" },
    { icon: Headphones, label: "Support before and during" }
  ]
};

export function TrustStrip() {
  const [language] = useLanguage();
  const t = landingCopy[language];

  return (
    <section className="section bg-[#07162f] text-white">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] md:text-5xl">
            {t.trustTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-7 text-white/70">
            {t.trustText}
          </p>
        </div>
        <div className="mt-10 flex flex-wrap border-t border-white/14">
          {trustItems[language].map((item) => (
            <div
              key={item.label}
              className="flex min-h-24 min-w-[50%] flex-1 items-center gap-3 border-b border-white/14 pr-5 text-sm font-semibold sm:min-w-[33%] lg:min-w-0"
            >
              <item.icon className="size-5 text-secondary" strokeWidth={1.8} aria-hidden />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
