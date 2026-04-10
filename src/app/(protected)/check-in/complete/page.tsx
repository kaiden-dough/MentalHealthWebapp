import { ArrowRight, Leaf, Wind } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestMoodEntry } from "@/lib/data/mood-entries";
import { isNegativeMood, pickAffirmation, pickCopingStrategy } from "@/lib/feedback";

export const metadata = {
  title: "Check-in saved",
};

/**
 * Post-submit feedback: curated coping vs affirmation based on latest entry.
 */
export default async function CheckInCompletePage() {
  const entry = await getLatestMoodEntry();
  if (!entry) {
    redirect("/check-in");
  }

  const negative = isNegativeMood(entry.mood);
  const seed = entry.id;
  const coping = negative ? pickCopingStrategy(seed) : null;
  const affirmation = pickAffirmation(seed);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {negative ? <Wind className="h-7 w-7" /> : <Leaf className="h-7 w-7" />}
        </div>
        <Badge variant={negative ? "calm" : "secondary"} className="mb-2">
          {negative ? "Coping idea" : "Affirmation"}
        </Badge>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {negative ? "Thanks for trusting us with that" : "Nice work checking in"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {negative
            ? "Here’s a small, evidence-informed practice you can try in the next few minutes."
            : "Carry this with you today—progress isn’t linear."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">{negative ? coping?.title : "For today"}</CardTitle>
          <CardDescription>
            {negative
              ? "If anything feels uncomfortable in your body, stop and try something gentler—or reach out to campus support."
              : "Curated from our in-app library (no external AI)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-foreground">
          <p>{negative ? coping?.body : affirmation}</p>
          {negative ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground">
              If you are in immediate danger or thinking about hurting yourself, call <strong>911</strong> or the{" "}
              <a href="https://988lifeline.org" className="font-medium text-primary underline">
                988 Lifeline
              </a>
              . VT students can also contact{" "}
              <a href="https://www.ucc.vt.edu" className="font-medium text-primary underline">
                Cook Counseling
              </a>
              .
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="/dashboard">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/check-in">Log another check-in</Link>
        </Button>
      </div>
    </div>
  );
}
