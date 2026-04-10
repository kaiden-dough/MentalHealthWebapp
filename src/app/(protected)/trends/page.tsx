import { MoodTrendChart } from "@/components/trends/mood-trend-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMoodEntriesForUser } from "@/lib/data/mood-entries";

export const metadata = {
  title: "Trends",
};

/**
 * Historical mood visualization — empty state when no data yet.
 */
export default async function TrendsPage() {
  const entries = await getMoodEntriesForUser(120);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Trends</h1>
        <p className="mt-1 text-muted-foreground">Your recent check-ins, newest on the right.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Mood over time</CardTitle>
          <CardDescription>Scores map rough → great on a 1–5 scale for readability.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <p className="text-sm font-medium">No entries yet</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Complete a check-in and you&apos;ll see your line chart here.
              </p>
            </div>
          ) : (
            <MoodTrendChart entries={entries} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
