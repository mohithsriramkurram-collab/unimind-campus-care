import { LifeBuoy, ShieldCheck } from "lucide-react";
import { Panel } from "./Panel";

export function SafetyNote() {
  return (
    <Panel className="border-pastel-lilac bg-pastel-lilac/40">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-primary ring-1 ring-border/60">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-foreground">Your privacy comes first</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Your check-ins, notes and conversations belong to you alone. They're never shared with your college or
              anyone else unless you choose to involve them.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-primary ring-1 ring-border/60">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-foreground">If things feel urgent</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              You deserve support right away. Call iCall 9152987821 or Aasra 9820466726 — free and confidential — or
              reach out to someone you trust.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}