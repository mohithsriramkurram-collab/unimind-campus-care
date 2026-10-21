import { createFileRoute } from "@tanstack/react-router";
import { isAfter, parseISO } from "date-fns";
import { HeartPulse, TrendingUp } from "lucide-react";
import { listMoodEntries, listMySessions } from "@/lib/server-fns";
import { useAuth } from "@/lib/AuthContext";
import { MoodCheckIn } from "@/components/mood/MoodCheckIn";
import { MoodChart } from "@/components/mood/MoodChart";
import { Panel } from "@/components/dashboard/Panel";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { MoodStats } from "@/components/dashboard/MoodStats";
import { UpcomingSessionCard } from "@/components/dashboard/UpcomingSessionCard";
import { RecentMood } from "@/components/dashboard/RecentMood";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SafetyNote } from "@/components/dashboard/SafetyNote";

export const Route = createFileRoute("/_authed/")({
  ssr: false,
  loader: async () => {
    const [mood, sessions] = await Promise.all([
      listMoodEntries(),
      listMySessions().catch(() => []),
    ]);
    return { mood, sessions };
  },
  head: () => ({ meta: [{ title: "MindHaven · Home" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { mood, sessions } = Route.useLoaderData();
  const entries = mood || [];

  const firstName = (user?.full_name || "").split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const upcoming = (sessions || [])
    .filter((s) => s.status === "scheduled" && isAfter(parseISO(s.scheduled_time), new Date()))
    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time))[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <WelcomeHero firstName={firstName} greeting={greeting} />

      <MoodStats entries={entries} />

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel title="Daily check-in" icon={HeartPulse} className="lg:col-span-3">
          <MoodCheckIn compact />
        </Panel>
        <div className="lg:col-span-2">
          <UpcomingSessionCard session={upcoming} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Panel title="Your mood this week" icon={TrendingUp} className="lg:col-span-3">
          <MoodChart entries={entries.slice(0, 14)} />
        </Panel>
        <div className="lg:col-span-2">
          <RecentMood entries={entries} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-xl font-bold tracking-tight text-foreground">Helpful actions</h2>
        <QuickActions />
      </div>

      <SafetyNote />
    </div>
  );
}