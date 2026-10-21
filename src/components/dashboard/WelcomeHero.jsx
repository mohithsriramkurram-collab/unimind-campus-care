import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { ArrowRight, MessageCircleHeart } from "lucide-react";

export function WelcomeHero({ firstName, greeting }) {
  return (
    <section className="relative animate-fade-up overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-navy via-brand-navy to-primary text-primary-foreground shadow-card">
      <span className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-pastel-mint/25 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-pastel-sky/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            <MessageCircleHeart className="h-3.5 w-3.5" />
            Care for your mind
          </span>
          <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
            This is your private space to check in with yourself, breathe, and find support — whenever you need it.
            Nothing here is ever shared without you.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-primary-foreground font-bold text-brand-navy transition-transform hover:-translate-y-0.5 hover:bg-primary-foreground/90"
            >
              <Link to="/mood">
                Check in now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl border-primary-foreground/40 bg-primary-foreground/10 font-semibold text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <Link to="/companion">Talk to Sage</Link>
            </Button>
          </div>
        </div>

        <Mascot className="h-40 w-40 animate-float self-center md:h-48 md:w-48" />
      </div>
    </section>
  );
}