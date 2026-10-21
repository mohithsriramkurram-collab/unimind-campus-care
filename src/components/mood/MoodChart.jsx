import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

const MOODS = ["great", "good", "okay", "low", "rough"];
const SCORE = { great: 5, good: 4, okay: 3, low: 2, rough: 1 };
const EMOJI = { great: "😄", good: "🙂", okay: "😐", low: "😔", rough: "😣" };

export function MoodChart({ entries = [] }) {
  const data = [...entries]
    .reverse()
    .map((e) => ({
      date: format(parseISO(e.created_date), "MMM d"),
      score: SCORE[e.mood] ?? 3,
      mood: e.mood,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 px-6 text-center text-sm text-muted-foreground">
        No check-ins yet. Your mood map will grow here.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => MOODS[5 - v]?.[0]?.toUpperCase() ?? ""}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--popover))",
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value, name, props) => [`${EMOJI[props.payload.mood]} ${props.payload.mood}`, "Mood"]}
          />
          <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#moodFill)" dot={{ r: 3, fill: "hsl(var(--primary))" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}