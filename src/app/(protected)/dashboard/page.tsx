import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMoodEntriesForUser } from "@/lib/data/mood-entries";
import { computeStreak, countLast7Days } from "@/lib/stats";

export const metadata = {
  title: "Home",
};

/**
 * Dashboard: streak, recent activity, and primary CTA to check in.
 */
export default async function DashboardPage() {
  const entries = await getMoodEntriesForUser(200);
  const streak = computeStreak(entries);
  const weekCount = countLast7Days(entries);
  const last = entries[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Today</h1>
        <p className="mt-1 text-muted-foreground">Small steps count. Ready for a quick check-in?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Streak</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">{streak} days</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Consecutive days with at least one log (starting today or yesterday).
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last 7 days</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums">{weekCount} check-ins</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Rolling week—every log counts toward your awareness, not perfection.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Last check-in</CardTitle>
          <CardDescription>
            {last
              ? `${formatDistanceToNow(new Date(last.created_at), { addSuffix: true })} · mood “${last.mood}”, stress ${last.stress}/10`
              : "You haven’t logged yet—your first entry unlocks trends."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/check-in">Start check-in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/trends">View trends</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
