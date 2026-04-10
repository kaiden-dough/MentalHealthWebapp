"use client";

import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { moodToScore } from "@/lib/mood-map";
import type { MoodEntryRow } from "@/types/mood";

type Point = { at: string; score: number; label: string };

type MoodTrendChartProps = {
  entries: MoodEntryRow[];
};

/**
 * Area chart of mood scores over time (newest entries on the right).
 */
export function MoodTrendChart({ entries }: MoodTrendChartProps) {
  const chronological = [...entries].reverse();
  const data: Point[] = chronological.map((e) => ({
    at: e.created_at,
    score: moodToScore(e.mood),
    label: e.mood,
  }));

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="at"
            tickFormatter={(v) => format(new Date(v), "MMM d")}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} width={28} tick={{ fontSize: 11 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const p = payload[0].payload as Point;
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="font-medium">{format(new Date(p.at), "MMM d, h:mm a")}</p>
                  <p className="text-muted-foreground capitalize">Mood: {p.label}</p>
                  <p className="text-muted-foreground">Score: {p.score} / 5</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="url(#moodFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
