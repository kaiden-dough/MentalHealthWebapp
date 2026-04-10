import { ArrowRight, Heart, LineChart, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Public landing page — value prop and entry to auth.
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-calm-lavender/50 via-background to-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(134,31,65,0.12),_transparent_60%)]" />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Heart className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">HokieHealth</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-8 md:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built for Virginia Tech students
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Mental wellness in under a minute
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Quick mood and stress check-ins, gentle feedback, and campus resources—without the pressure of a
            full journal app.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="gap-2">
              <Link href="/signup">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <Card className="border-primary/10 bg-card/80 shadow-sm backdrop-blur">
            <CardContent className="pt-6">
              <Heart className="mb-3 h-8 w-8 text-primary" />
              <h2 className="font-display text-lg font-semibold">Micro check-ins</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap a mood, set stress, optional context—designed to fit between classes.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-card/80 shadow-sm backdrop-blur">
            <CardContent className="pt-6">
              <LineChart className="mb-3 h-8 w-8 text-primary" />
              <h2 className="font-display text-lg font-semibold">See your patterns</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A simple trend line helps you notice shifts early—your data stays tied to your account.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-card/80 shadow-sm backdrop-blur">
            <CardContent className="pt-6">
              <Shield className="mb-3 h-8 w-8 text-primary" />
              <h2 className="font-display text-lg font-semibold">VT-first resources</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cook Counseling, TimelyCare, and crisis lines—curated for when you need more than self-help.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="mx-auto mt-16 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
          HokieHealth is a class project and not a substitute for professional care. If you or someone else is in
          immediate danger, call 911 or use the{" "}
          <a className="underline underline-offset-2" href="https://988lifeline.org">
            988 Lifeline
          </a>
          .
        </p>
      </main>
    </div>
  );
}
