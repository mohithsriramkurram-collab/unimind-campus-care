import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCounselor } from "@/lib/server-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingForm } from "@/components/counselors/BookingForm";
import { Video, MapPin, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authed/counselors/$counselorId")({
  ssr: false,
  loader: async ({ params }) => {
    const counselor = await getCounselor({ data: { id: params.counselorId } });
    if (!counselor) throw notFound();
    return counselor;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `MindHaven · ${loaderData?.full_name ?? "Counselor"}` }] }),
  component: CounselorDetail,
});

function CounselorDetail() {
  const counselor = Route.useLoaderData();
  const initials = (counselor.full_name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="overflow-hidden border-border/70">
        <div className="h-28 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/40" />
        <CardContent className="-mt-12 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="h-24 w-24 border-4 border-card">
              <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{counselor.full_name}</h1>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" /> {counselor.title}
              </p>
            </div>
          </div>

          {counselor.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {counselor.specialties.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          )}

          {counselor.bio && <p className="leading-relaxed text-foreground/90">{counselor.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {counselor.modalities?.includes("video") && (
              <span className="flex items-center gap-1.5">
                <Video className="h-4 w-4" /> Video sessions
              </span>
            )}
            {counselor.modalities?.includes("in-person") && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> In-person sessions
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Book a session</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingForm counselor={counselor} />
        </CardContent>
      </Card>
    </div>
  );
}