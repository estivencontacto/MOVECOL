import Link from "next/link";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta({
  citySlug,
  title,
  description,
  bookLabel,
  whatsappLabel
}: {
  citySlug: string;
  title: string;
  description: string;
  bookLabel: string;
  whatsappLabel: string;
}) {
  return (
    <section id="contacto" className="section scroll-mt-24">
      <div className="container">
        <div className="grid gap-8 rounded-lg bg-primary p-6 text-primary-foreground sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-pretty leading-7 text-primary-foreground/76">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="whitespace-nowrap active:scale-[0.98]"
            >
              <Link href={`/reservar?city=${citySlug}`}>
                {bookLabel}
                <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="whitespace-nowrap border-white/30 bg-white/8 text-white hover:bg-white/14 active:scale-[0.98]"
            >
              <Link href="https://wa.link/6f907x" target="_blank" rel="noreferrer">
                <MessageCircleMore className="size-4" strokeWidth={1.8} aria-hidden />
                {whatsappLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
