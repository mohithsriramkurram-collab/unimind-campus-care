import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { CalendarCheck, HeartPulse, TrendingUp } from "lucide-react";
import { listMoodEntries } from "@/lib/server-fns";
import { MoodCheckIn } from "@/components/mood/MoodCheckIn";
import { MoodChart } from "@/components/mood/MoodChart";
import { Panel } from "@/components/dashboard/Panel";

const EMOJI = { great: "😄", good: "🙂", okay: "😐", low: "😔", rough: "😣" };

export const Route = createFileRoute("/_authed/mood")({
  ssr: false,
  loader: () => listMoodEntries(),
  head: () => ({ meta: [{ title: "MindHaven · Mood" }] }),
  component: MoodPage,
});

function MoodPage() {
  const entries = Route.useLoaderData() || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="animate-fade-up rounded-[1.75rem] border border-pastel-sky bg-gradient-to-br from-pastel-sky/80 to-pastel-mint/60 p-6 sm:p-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary ring-1 ring-border/60">
          <HeartPulse className="h-3.5 w-3.5" />
          Mood tracker
        </span>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground">How are you today?</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/70">
          Notice patterns over time. A check-in takes a minute, and it helps you understand yourself better.
        </p>
      </header>

      <Panel title="Today's check-in" icon={HeartPulse}>
        <MoodCheckIn />
      </Panel>

      <Panel title="Your mood over time" icon={TrendingUp}>
        <MoodChart entries={entries} />
      </Panel>

      <Panel title="Recent check-ins" icon={CalendarCheck}>
        <div className="space-y-3">
          {entries.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No check-ins yet. Your first one will appear here.
            </p>
          )}
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 transition-colors hover:bg-secondary/50"
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
                    {e.emotions.map((em) => (
                      <span
                        key={em}
                        className="rounded-full bg-pastel-mint/70 px-2 py-0.5 text-[11px] font-medium capitalize text-foreground/80"
                      >
                        {em}
                      </span>
                    ))}
                  </div>
                )}
                {e.notes && <p className="mt-2 text-sm text-muted-foreground">{e.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}