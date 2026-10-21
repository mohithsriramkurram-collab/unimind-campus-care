import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Headphones, PenLine } from "lucide-react";

const TYPE_ICON = { article: BookOpen, exercise: PenLine, audio: Headphones };

const CATEGORY_COLOR = {
  anxiety: "bg-sky-100 text-sky-700",
  stress: "bg-orange-100 text-orange-700",
  sleep: "bg-indigo-100 text-indigo-700",
  relationships: "bg-rose-100 text-rose-700",
  academics: "bg-violet-100 text-violet-700",
  mindfulness: "bg-emerald-100 text-emerald-700",
  depression: "bg-blue-100 text-blue-700",
  "self-esteem": "bg-amber-100 text-amber-700",
};

export function ResourceCard({ resource, onOpen }) {
  const Icon = TYPE_ICON[resource.type] || BookOpen;
  const catColor = CATEGORY_COLOR[resource.category] || "bg-secondary text-secondary-foreground";

  return (
    <button
      onClick={() => onOpen(resource)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className="h-24 w-full"
        style={{ background: resource.cover_color || "linear-gradient(135deg, hsl(162 30% 40%), hsl(162 30% 60%))" }}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${catColor}`}>
            {resource.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Icon className="h-3.5 w-3.5" /> {resource.type}
          </span>
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight">{resource.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{resource.summary}</p>
        <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {resource.read_time_minutes || 5} min read
        </p>
      </div>
    </button>
  );
}