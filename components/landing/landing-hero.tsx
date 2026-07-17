"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";
import { landingCopy } from "@/components/landing/landing-copy";

export function LandingHero({
  bogotaImage,
  medellinImage
}: {
  bogotaImage: string;
  medellinImage: string;
}) {
  const [language] = useLanguage();
  const t = landingCopy[language];

  return (
    <section className="relative overflow-hidden bg-[#07162f] text-white">
      <div className="container grid min-h-[78svh] items-center gap-10 pb-14 pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:pb-16 lg:pt-24">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-secondary">
            <MapPin className="size-4" strokeWidth={1.8} aria-hidden />
            {t.heroEyebrow}
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-white/78 sm:text-lg">
            {t.heroText}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/88 active:scale-[0.98]"
            >
              <Link href="#destinos">
                {t.exploreTours}
                <ArrowDownRight className="size-4" strokeWidth={1.8} aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/8 text-white hover:bg-white/14 active:scale-[0.98]"
            >
              <Link href="/reservar">
                {t.bookTransfer}
                <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[360px] lg:min-h-[520px]" aria-label="Bogotá y Medellín">
          <div className="absolute left-0 top-0 h-[74%] w-[68%] overflow-hidden rounded-lg border border-white/12 bg-[#0d2347]">
            <Image
              src={bogotaImage}
              alt="Vista urbana de Bogotá"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 38vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07162f]/58 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-xl font-bold">Bogotá</span>
          </div>
          <div className="absolute bottom-0 right-0 h-[68%] w-[60%] overflow-hidden rounded-lg border border-white/12 bg-[#0d2347] shadow-[0_20px_55px_-28px_rgba(0,0,0,0.72)]">
            <Image
              src={medellinImage}
              alt="Vista urbana de Medellín"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 34vw, 62vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07162f]/58 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-xl font-bold">Medellín</span>
          </div>
        </div>
      </div>
    </section>
  );
}
