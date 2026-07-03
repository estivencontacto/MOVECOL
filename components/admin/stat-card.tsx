import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  helper,
  icon: Icon
}: {
  title: string;
  value: string;
  helper: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        {Icon ? (
          <span className="premium-icon shrink-0">
            <Icon className="size-5" aria-hidden />
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
