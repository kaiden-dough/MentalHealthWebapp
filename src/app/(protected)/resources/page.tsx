import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CAMPUS_RESOURCES } from "@/lib/campus-resources";

export const metadata = {
  title: "Resources",
};

const categoryLabel = {
  crisis: "Crisis",
  counseling: "Counseling & care",
  wellness: "Wellness & support",
};

/**
 * Static VT-first resource list (ready to swap for Supabase-backed admin content later).
 */
export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Campus resources</h1>
        <p className="mt-1 text-muted-foreground">
          Curated starting points—always verify hours and availability on official sites.
        </p>
      </div>

      <div className="grid gap-4">
        {CAMPUS_RESOURCES.map((r) => (
          <Card key={r.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-display text-lg">{r.title}</CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {categoryLabel[r.category]}
                </Badge>
              </div>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-3" />
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Visit site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        External links open in a new tab. HokieHealth does not operate these services.
      </p>
    </div>
  );
}
