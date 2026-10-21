import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createMoodEntry } from "@/lib/server-fns";
import { cn } from "@/lib/utils";

const MOODS = [
  { value: "great", emoji: "😄", label: "Great", bg: "bg-pastel-mint", hint: "Bright and steady" },
  { value: "good", emoji: "🙂", label: "Good", bg: "bg-pastel-sky", hint: "Mostly okay" },
  { value: "okay", emoji: "😐", label: "Okay", bg: "bg-pastel-butter", hint: "Getting by" },
  { value: "low", emoji: "😔", label: "Low", bg: "bg-pastel-peach", hint: "A bit heavy" },
  { value: "rough", emoji: "😣", label: "Rough", bg: "bg-pastel-lilac", hint: "A really tough day" },
];

const EMOTIONS = [
  "calm", "anxious", "happy", "sad", "angry", "tired", "stressed",
  "grateful", "overwhelmed", "hopeful", "lonely", "focused", "frustrated", "content", "worried",
];

export function MoodCheckIn({ onDone, compact = false }) {
  const [mood, setMood] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const create = useServerFn(createMoodEntry);
  const router = useRouter();

  const toggleEmotion = (e) =>
    setEmotions((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  const submit = async () => {
    if (!mood) {
      toast.error("Pick how you're feeling first.");
      return;
    }
    setSaving(true);
    try {
      await create({ data: { mood, emotions, notes: notes.trim() || undefined } });
      toast.success("Thanks for checking in. 💚");
      setMood(null);
      setEmotions([]);
      setNotes("");
      await router.invalidate();
      onDone?.();
    } catch (e) {
      toast.error("Couldn't save your check-in. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className={cn("font-semibold text-foreground", compact ? "mb-3 text-sm" : "mb-4 text-base")}>
          How are you feeling right now?
        </p>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {MOODS.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                aria-pressed={active}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  active
                    ? cn(m.bg, "border-transparent shadow-soft ring-2 ring-primary/50 -translate-y-0.5")
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft",
                )}
              >
                {active && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <span
                  className={cn(
                    "leading-none transition-transform duration-200",
                    compact ? "text-2xl" : "text-3xl",
                    active && "scale-110",
                  )}
                >
                  {m.emoji}
                </span>
                <span className={cn("text-[11px] font-bold sm:text-xs", active ? "text-foreground" : "text-muted-foreground")}>
                  {m.label}
                </span>
                {!compact && (
                  <span className="hidden text-[10px] leading-tight text-muted-foreground sm:block">{m.hint}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!compact && (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">What's showing up for you?</p>
          <div className="flex flex-wrap gap-1.5">
            {EMOTIONS.map((e) => {
              const active = emotions.includes(e);
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => toggleEmotion(e)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all duration-200",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!compact && (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Anything you'd like to note? (optional)</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="A few words about your day, what's on your mind, or what you're grateful for…"
            className="min-h-[88px] resize-none rounded-2xl"
            maxLength={1000}
          />
        </div>
      )}

      <Button
        onClick={submit}
        disabled={!mood || saving}
        className="w-full rounded-2xl font-bold transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        {saving ? "Saving…" : "Save check-in"}
      </Button>
    </div>
  );
}