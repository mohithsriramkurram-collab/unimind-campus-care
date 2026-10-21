import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { HeartPulse } from "lucide-react";
import { Panel } from "./Panel";

const EMOJI = { great: "😄", good: "🙂", okay: "😐", low: "😔", rough: "😣" };

export function RecentMood({ entries = [] }) {
  const recent = entries.slice(0, 4);

  return (
    <Panel
      title="Recent mood"
      icon={HeartPulse}
      className="h-full"
      action={
        <Link to="/mood" className="text-xs font-bold text-primary hover:underline">
          See all
        </Link>
      }
    >
      {recent.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Your check-ins will show up here.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {recent.map((e) => (
            <li
              key={e.id}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-3 transition-colors hover:bg-secondary/50"
            >
              <span className="text-2xl leading-none">{EMOJI[e.mood]}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-bold capitalize text-foreground">{e.mood}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {format(parseISO(e.created_date), "EEE, MMM d · h:mm a")}
                  </span>
                </div>
                {e.emotions?.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {e.emotions.slice(0, 3).map((em) => (
                      <span
                        key={em}
                        className="rounded-full bg-pastel-mint/70 px-2 py-0.5 text-[11px] font-medium capitalize text-foreground/80"
                      >
                        {em}
                      </span>
                    ))}
                  </div>
                )}
                {e.notes && <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{e.notes}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}