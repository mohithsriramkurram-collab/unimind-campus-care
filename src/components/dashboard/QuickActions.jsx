import { Link } from "@tanstack/react-router";
import { BookOpen, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    to: "/companion",
    icon: Sparkles,
    tint: "bg-pastel-lilac",
    title: "Talk to Sage",
    desc: "A supportive companion, anytime",
  },
  {
    to: "/resources",
    icon: BookOpen,
    tint: "bg-pastel-butter",
    title: "Self-help library",
    desc: "Guides, exercises & tools",
  },
  {
    to: "/counselors",
    icon: Users,
    tint: "bg-pastel-mint",
    title: "Book a counselor",
    desc: "1:1 video or in-person",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {ACTIONS.map(({ to, icon: Icon, tint, title, desc }) => (
        <Link
          key={to}
          to={to}
          className="group flex flex-col rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
        >
          <span
            className={cn(
              "mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:scale-110",
              tint,
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <p className="font-heading font-bold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
          <span className="mt-3 text-sm font-bold text-primary group-hover:underline">Open →</span>
        </Link>
      ))}
    </div>
  );
}