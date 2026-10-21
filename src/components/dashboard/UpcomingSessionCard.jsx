import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowRight, CalendarDays, MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";

export function UpcomingSessionCard({ session }) {
  return (
    <Panel
      title="Upcoming session"
      icon={CalendarDays}
      className="h-full bg-gradient-to-br from-primary/5 to-pastel-sky/50"
    >
      {session ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
            <p className="font-heading text-base font-bold text-foreground">{session.counselor_name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {format(parseISO(session.scheduled_time), "EEEE, MMM d · h:mm a")}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold capitalize text-secondary-foreground">
              {session.modality === "video" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              {session.modality}
            </span>
          </div>
          <Button asChild variant="secondary" className="rounded-2xl font-semibold">
            <Link to="/sessions">View my sessions</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            No sessions booked yet. Whenever you're ready, a counselor is here for you — no pressure.
          </p>
          <Button asChild className="rounded-2xl font-bold">
            <Link to="/counselors">
              Find a counselor <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </Panel>
  );
}