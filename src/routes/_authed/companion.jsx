import { createFileRoute } from "@tanstack/react-router";
import { CompanionChat } from "@/components/companion/CompanionChat";

export const Route = createFileRoute("/_authed/companion")({
  ssr: false,
  head: () => ({ meta: [{ title: "MindHaven · Sage Companion" }] }),
  component: CompanionPage,
});

function CompanionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <CompanionChat />
    </div>
  );
}