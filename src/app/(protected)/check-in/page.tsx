import { CheckInForm } from "@/components/check-in/check-in-form";

export const metadata = {
  title: "Check-in",
};

/**
 * Mood + stress logging screen.
 */
export default function CheckInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Check-in</h1>
        <p className="mt-1 text-muted-foreground">Honest taps only—there’s no wrong answer.</p>
      </div>
      <CheckInForm />
    </div>
  );
}
