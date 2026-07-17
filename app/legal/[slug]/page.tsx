import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal/legal-document";
import {
  getLegalDocument,
  legalDocumentSlugs
} from "@/lib/legal/documents";
import { absoluteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return legalDocumentSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (!document) return {};

  const title = document.title.ES;
  const description = document.summary.ES;

  return {
    title,
    description,
    alternates: {
      canonical: `/legal/${slug}`
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/legal/${slug}`)
    }
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (!document) notFound();

  return <LegalDocument document={document} />;
}
