import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link className="transition hover:text-foreground" href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {index < items.length - 1 ? <ChevronRight className="size-4" aria-hidden /> : null}
        </span>
      ))}
    </nav>
  );
}
