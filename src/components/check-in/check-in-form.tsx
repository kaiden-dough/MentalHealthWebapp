"use client";

import { useActionState, useState } from "react";

import { submitMoodEntry, type MoodActionState } from "@/app/actions/mood";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { STRESSOR_OPTIONS, type MoodValue } from "@/types/mood";

const MOOD_UI: { value: MoodValue; emoji: string; label: string }[] = [
  { value: "great", emoji: "😄", label: "Great" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "low", emoji: "😟", label: "Low" },
  { value: "rough", emoji: "😣", label: "Rough" },
];

/**
 * Full check-in flow: mood chips, stress slider, optional stressors and note.
 */
export function CheckInForm() {
  const [state, action, pending] = useActionState(submitMoodEntry, undefined as MoodActionState);
  const [mood, setMood] = useState<MoodValue>("okay");
  const [stress, setStress] = useState(5);
  const [stressors, setStressors] = useState<string[]>([]);

  function toggleStressor(id: string) {
    setStressors((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">How are you feeling?</CardTitle>
        <CardDescription>Tap what fits best—this takes under a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-8">
          <input type="hidden" name="mood" value={mood} />
          <input type="hidden" name="stress" value={stress} />
          <input type="hidden" name="stressors" value={JSON.stringify(stressors)} />

          {state?.error ? (
            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-3">
            <Label className="text-base">Mood</Label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3" role="group" aria-label="Mood">
              {MOOD_UI.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors sm:text-xs",
                    mood === m.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent bg-muted/50 text-muted-foreground hover:border-muted",
                  )}
                >
                  <span className="text-xl sm:text-2xl" aria-hidden>
                    {m.emoji}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="stress-slider" className="text-base">
                Stress level
              </Label>
              <span className="text-sm text-muted-foreground">
                {stress} / 10
              </span>
            </div>
            <Slider
              id="stress-slider"
              min={1}
              max={10}
              step={1}
              value={[stress]}
              onValueChange={(v) => setStress(v[0] ?? 5)}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calmer</span>
              <span>Overwhelmed</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>What&apos;s on your mind? (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {STRESSOR_OPTIONS.map((s) => {
                const on = stressors.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStressor(s.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      on ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Short note (optional)</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="A sentence is enough—only you see this."
              maxLength={2000}
              rows={3}
            />
          </div>

          <Separator />

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Saving…" : "Save check-in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
