import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listMySessions, cancelSession } from "@/lib/server-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO, isAfter } from "date-fns";
import { Video, MapPin, CalendarDays, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/_authed/sessions")({
  ssr: false,
  loader: () => listMySessions(),
  head: () => ({ meta: [{ title: "MindHaven · My Sessions" }] }),
  component: SessionsPage,
});

function SessionsPage() {
  const sessions = Route.useLoaderData() || [];
  const router = useRouter();
  const cancel = useServerFn(cancelSession);

  const now = new Date();
  const upcoming = sessions
    .filter((s) => s.status === "scheduled" && isAfter(parseISO(s.scheduled_time), now))
    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
  const past = sessions
    .filter((s) => !(s.status === "scheduled" && isAfter(parseISO(s.scheduled_time), now)))
    .sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time));

  const onCancel = async (id) => {
    try {
      await cancel({ data: { id } });
      toast.success("Session cancelled.");
      await router.invalidate();
    } catch {
      toast.error("Couldn't cancel the session.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">My sessions</h1>
        <p className="mt-2 text-muted-foreground">Your booked and past counseling appointments.</p>
      </header>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No upcoming sessions. <Button asChild variant="link" className="h-auto p-0 align-baseline"><a href="/counselors">Find a counselor →</a></Button>
          </p>
        ) : (
          upcoming.map((s) => (
            <Card key={s.id} className="border-border/70">
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium">{s.counselor_name}</p>
                    <p className="text-sm text-muted-foreground">{format(parseISO(s.scheduled_time), "EEEE, MMM d · h:mm a")}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs capitalize text-muted-foreground">
                      {s.modality === "video" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                      {s.modality} · {s.duration_minutes || 50} min
                    </p>
                    {s.topic && <p className="mt-1 text-sm text-muted-foreground">“{s.topic}”</p>}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => onCancel(s.id)} className="shrink-0">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">Past</h2>
          {past.map((s) => (
            <Card key={s.id} className="border-border/70 opacity-80">
              <CardContent className="flex items-center gap-3">
                {s.status === "cancelled" ? (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium">{s.counselor_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(s.scheduled_time), "MMM d, yyyy · h:mm a")} · {s.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}