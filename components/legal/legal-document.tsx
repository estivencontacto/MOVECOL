"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Mail } from "lucide-react";
import { useLanguage } from "@/components/preferences/site-preferences";
import { Button } from "@/components/ui/button";
import type { LegalDocument as LegalDocumentData } from "@/lib/legal/documents";
import { legalDocuments } from "@/lib/legal/documents";
import { company } from "@/lib/legal/company";

const copy = {
  ES: {
    home: "Inicio",
    legal: "Legal",
    updated: "Última actualización",
    contents: "Contenido",
    contactTitle: "¿Necesitas aclarar esta política?",
    contactText:
      "Escríbenos con la ruta legal y la pregunta concreta para darte una respuesta trazable.",
    contact: "Enviar correo",
    related: "Otras políticas",
    translation:
      ""
  },
  EN: {
    home: "Home",
    legal: "Legal",
    updated: "Last updated",
    contents: "Contents",
    contactTitle: "Need clarification about this policy?",
    contactText:
      "Write to us with the policy name and your specific question so we can provide a traceable response.",
    contact: "Send email",
    related: "Related policies",
    translation:
      "This English text is an informative translation. The Spanish version prevails until professional legal review is completed."
  }
};

export function LegalDocument({ document }: { document: LegalDocumentData }) {
  const [language] = useLanguage();
  const t = copy[language];

  return (
    <article className="section">
      <div className="container">
        <nav aria-label="Breadcrumb" className="no-print mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/">{t.home}</Link></li>
            <li aria-hidden>/</li>
            <li>{t.legal}</li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{document.title[language]}</li>
          </ol>
        </nav>

        <header className="max-w-4xl border-b pb-10">
          <h1 className="text-balance text-4xl font-black tracking-[-0.035em] md:text-6xl">
            {document.title[language]}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground">
            {document.summary[language]}
          </p>
          {t.translation ? (
            <p className="mt-5 rounded-md bg-muted p-4 text-sm leading-6 text-muted-foreground">
              {t.translation}
            </p>
          ) : null}
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays className="size-4" strokeWidth={1.8} aria-hidden />
            {t.updated}: {company.lastUpdated}
          </p>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[250px_minmax(0,760px)] lg:items-start">
          <aside className="no-print lg:sticky lg:top-28">
            <h2 className="text-sm font-bold">{t.contents}</h2>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              {document.sections.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-primary">
                    {item.title[language]}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="space-y-12">
            {document.sections.map((item) => (
              <section key={item.id} id={item.id} className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">
                  {item.title[language]}
                </h2>
                <div className="mt-4 space-y-4">
                  {item.paragraphs[language].map((paragraph) => (
                    <p key={paragraph} className="max-w-[72ch] leading-7 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="no-print rounded-lg bg-primary p-6 text-primary-foreground sm:p-8">
              <h2 className="text-2xl font-bold">{t.contactTitle}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-primary-foreground/76">{t.contactText}</p>
              <Button asChild variant="secondary" className="mt-5">
                <a href={`mailto:${company.generalEmail}`}>
                  <Mail className="size-4" strokeWidth={1.8} aria-hidden />
                  {t.contact}
                </a>
              </Button>
            </section>

            <section className="no-print border-t pt-8">
              <h2 className="text-lg font-bold">{t.related}</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {legalDocuments
                  .filter((item) => item.slug !== document.slug)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/legal/${item.slug}`}
                      className="flex items-center justify-between rounded-md border p-4 text-sm font-semibold hover:border-primary/40 hover:bg-muted/45"
                    >
                      {item.title[language]}
                      <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
                    </Link>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
