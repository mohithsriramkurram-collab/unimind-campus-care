import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin } from "lucide-react";

export function CounselorCard({ counselor }) {
  const initials = (counselor.full_name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      to="/counselors/$counselorId"
      params={{ counselorId: counselor.id }}
      className="group flex flex-col rounded-3xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border border-border">
          <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-semibold leading-tight tracking-tight">{counselor.full_name}</h3>
          <p className="text-sm text-muted-foreground">{counselor.title}</p>
        </div>
      </div>
      {counselor.specialties?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {counselor.specialties.slice(0, 4).map((s) => (
            <Badge key={s} variant="secondary" className="font-normal">
              {s}
            </Badge>
          ))}
        </div>
      )}
      {counselor.bio && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{counselor.bio}</p>}
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        {counselor.modalities?.includes("video") && (
          <span className="flex items-center gap-1">
            <Video className="h-3.5 w-3.5" /> Video
          </span>
        )}
        {counselor.modalities?.includes("in-person") && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> In person
          </span>
        )}
        <span className="ml-auto font-medium text-primary group-hover:underline">Book →</span>
      </div>
    </Link>
  );
}