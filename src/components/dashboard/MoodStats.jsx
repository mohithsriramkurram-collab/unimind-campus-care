import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";
import { CalendarCheck, Flame, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI = { great: "😄", good: "🙂", okay: "😐", low: "😔", rough: "😣" };

function buildCards(entries) {
  const latest = entries[0];
  const weekCount = entries.filter(
    (e) => differenceInCalendarDays(new Date(), parseISO(e.created_date)) < 7,
  ).length;

  const days = new Set(entries.map((e) => format(parseISO(e.created_date), "yyyy-MM-dd")));
  let streak = 0;
  let cursor = new Date();
  if (!days.has(format(cursor, "yyyy-MM-dd"))) cursor = subDays(cursor, 1);
  while (days.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return [
    {
      icon: Smile,
      tint: "bg-pastel-mint",
      value: latest ? `${EMOJI[latest.mood]} ${latest.mood}` : "—",
      label: latest ? "Latest check-in" : "No check-in yet",
      hint: latest ? format(parseISO(latest.created_date), "EEE, MMM d") : "Add how you feel today",
      capitalize: true,
    },
    {
      icon: CalendarCheck,
      tint: "bg-pastel-sky",
      value: String(weekCount),
      label: "Check-ins this week",
      hint: weekCount ? "Patterns appear with practice" : "Start with one today",
    },
    {
      icon: Flame,
      tint: "bg-pastel-lilac",
      value: String(streak),
      label: streak === 1 ? "Day in a row" : "Days in a row",
      hint: streak ? "Small steps add up" : "Check in to begin",
    },
  ];
}

export function MoodStats({ entries = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {buildCards(entries).map(({ icon: Icon, tint, value, label, hint, capitalize }) => (
        <div
          key={label}
          className="animate-fade-up rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
        >
          <span className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-2xl text-primary", tint)}>
            <Icon className="h-5 w-5" />
          </span>
          <p className={cn("font-heading text-2xl font-extrabold tracking-tight text-foreground", capitalize && "capitalize")}>
            {value}
          </p>
          <p className="text-sm font-semibold text-foreground/80">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      ))}
    </div>
  );
}