import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export const MASCOT_URL =
  "https://media.base44.com/images/public/6ad489fcf0dc74311baba3fb/cfd231251_generated_image.png";

/**
 * The MindHaven wellbeing companion, shown as a soft circular badge so it sits
 * comfortably on both light and dark surfaces.
 */
export function Mascot({ className = "h-16 w-16", alt = "Sage, your wellbeing companion" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-card shadow-soft ring-1 ring-border/60",
        className,
      )}
    >
      <Image src={MASCOT_URL} alt={alt} fittingType="fill" className="h-full w-full object-cover" />
    </span>
  );
}