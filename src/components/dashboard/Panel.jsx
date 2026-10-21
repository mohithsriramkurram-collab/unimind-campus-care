import { cn } from "@/lib/utils";

/**
 * Shared soft card used across the dashboard: rounded corners, gentle shadow,
 * optional icon + title header with an action slot on the right.
 */
export function Panel({ title, icon: Icon, action, className, bodyClassName, children }) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-soft transition-shadow duration-300 hover:shadow-card sm:p-6",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-foreground">
            {Icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
            )}
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}