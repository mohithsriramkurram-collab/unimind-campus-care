import { createFileRoute } from "@tanstack/react-router";
import { listCounselors } from "@/lib/server-fns";
import { CounselorCard } from "@/components/counselors/CounselorCard";

export const Route = createFileRoute("/_authed/counselors/")({
  ssr: false,
  loader: () => listCounselors(),
  head: () => ({ meta: [{ title: "MindHaven · Counselors" }] }),
  component: CounselorsPage,
});

function CounselorsPage() {
  const counselors = Route.useLoaderData() || [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Our counselors</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Licensed, compassionate professionals. Browse their profiles and book a session that fits your schedule —
          by video or in person.
        </p>
      </header>

      {counselors.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Counselor profiles are being set up. Please check back soon.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {counselors.map((c) => (
            <CounselorCard key={c.id} counselor={c} />
          ))}
        </div>
      )}
    </div>
  );
}