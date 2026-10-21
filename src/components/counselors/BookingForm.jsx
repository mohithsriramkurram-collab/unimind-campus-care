import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createSession } from "@/lib/server-fns";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildSlots(counselor, days = 14) {
  const slots = [];
  const now = new Date();
  const duration = counselor.slot_duration_minutes || 50;
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const dow = d.getDay();
    const schedules = (counselor.weekly_schedule || []).filter((s) => s.day === dow);
    for (const s of schedules) {
      const [sh, sm] = s.start.split(":").map(Number);
      const [eh, em] = s.end.split(":").map(Number);
      let cursor = new Date(d);
      cursor.setHours(sh, sm, 0, 0);
      const end = new Date(d);
      end.setHours(eh, em, 0, 0);
      while (cursor < end) {
        if (cursor > now) {
          slots.push({
            iso: cursor.toISOString(),
            label: format(cursor, "h:mm a"),
            dayLabel: format(cursor, "EEE, MMM d"),
          });
        }
        cursor = new Date(cursor.getTime() + duration * 60000);
      }
    }
  }
  return slots;
}

export function BookingForm({ counselor }) {
  const slots = useMemo(() => buildSlots(counselor), [counselor]);
  const [selected, setSelected] = useState(null);
  const [modality, setModality] = useState(counselor.modalities?.[0] || "video");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const create = useServerFn(createSession);
  const router = useRouter();

  const grouped = useMemo(() => {
    const map = new Map();
    for (const s of slots) {
      if (!map.has(s.dayLabel)) map.set(s.dayLabel, []);
      map.get(s.dayLabel).push(s);
    }
    return Array.from(map.entries()).slice(0, 7);
  }, [slots]);

  const submit = async () => {
    if (!selected) {
      toast.error("Choose a time slot to book.");
      return;
    }
    setSaving(true);
    try {
      await create({
        data: {
          counselor_id: counselor.id,
          counselor_name: counselor.full_name,
          scheduled_time: selected.iso,
          duration_minutes: counselor.slot_duration_minutes || 50,
          modality,
          topic: topic.trim() || undefined,
        },
      });
      toast.success("Session booked. You can review it under My Sessions.");
      setSelected(null);
      setTopic("");
      await router.invalidate();
    } catch {
      toast.error("Couldn't book the session. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (slots.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        This counselor has no open slots in the next two weeks. Please check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Choose a time</Label>
        <div className="space-y-4">
          {grouped.map(([day, daySlots]) => (
            <div key={day}>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">{day}</p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((s) => {
                  const active = selected?.iso === s.iso;
                  return (
                    <button
                      key={s.iso}
                      type="button"
                      onClick={() => setSelected(s)}
                      className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Session type</Label>
        <div className="flex gap-2">
          {counselor.modalities?.includes("video") && (
            <button
              type="button"
              onClick={() => setModality("video")}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                modality === "video" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary/60"
              }`}
            >
              Video
            </button>
          )}
          {counselor.modalities?.includes("in-person") && (
            <button
              type="button"
              onClick={() => setModality("in-person")}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                modality === "in-person" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary/60"
              }`}
            >
              In person
            </button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="topic" className="mb-2 block">
          What would you like to talk about? (optional)
        </Label>
        <Textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. feeling overwhelmed with exams, sleep trouble, relationship worries…"
          className="min-h-[80px] resize-none"
          maxLength={200}
        />
      </div>

      <Button onClick={submit} disabled={!selected || saving} className="w-full sm:w-auto">
        {saving ? "Booking…" : `Book ${selected ? format(new Date(selected.iso), "EEE, MMM d · h:mm a") : "session"}`}
      </Button>
    </div>
  );
}