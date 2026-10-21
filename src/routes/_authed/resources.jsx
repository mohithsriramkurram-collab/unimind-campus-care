import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { listResources } from "@/lib/server-fns";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceViewer } from "@/components/resources/ResourceViewer";

const CATEGORIES = [
  "all", "anxiety", "stress", "sleep", "relationships", "academics", "mindfulness", "depression", "self-esteem",
];

export const Route = createFileRoute("/_authed/resources")({
  ssr: false,
  loader: () => listResources(),
  head: () => ({ meta: [{ title: "MindHaven · Resources" }] }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const resources = Route.useLoaderData() || [];
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState(null);

  const filtered = category === "all" ? resources : resources.filter((r) => r.category === category);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Self-help library</h1>
        <p className="mt-2 text-muted-foreground">
          Evidence-informed guides and exercises you can explore on your own, at your own pace.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
              category === c
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-secondary/60"
            }`}
          >
            {c === "self-esteem" ? "Self-esteem" : c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No resources in this category yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} onOpen={setActive} />
          ))}
        </div>
      )}

      <ResourceViewer resource={active} onClose={() => setActive(null)} />
    </div>
  );
}