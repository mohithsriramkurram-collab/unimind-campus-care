import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mascot } from "@/components/Mascot";
import { cn } from "@/lib/utils";
import {
  Home,
  HeartPulse,
  BookOpen,
  Sparkles,
  Users,
  CalendarDays,
  LifeBuoy,
  LogOut,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Home", short: "Home", icon: Home },
  { to: "/mood", label: "Mood", short: "Mood", icon: HeartPulse },
  { to: "/companion", label: "Sage", short: "Sage", icon: Sparkles },
  { to: "/resources", label: "Resources", short: "Resources", icon: BookOpen },
  { to: "/counselors", label: "Counselors", short: "Counselors", icon: Users },
  { to: "/sessions", label: "My Sessions", short: "Sessions", icon: CalendarDays },
];

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const initials = (user?.full_name || user?.email || "S")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background bg-aurora bg-no-repeat">
      {/* Emergency support strip */}
      <div className="border-b border-pastel-peach bg-pastel-peach/60">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[11px] leading-tight text-foreground sm:text-xs">
          <LifeBuoy className="h-3.5 w-3.5 shrink-0 text-primary" />
          <p>
            In crisis? You're not alone. Call <span className="font-bold">iCall 9152987821</span> or{" "}
            <span className="font-bold">Aasra 9820466726</span> — free &amp; confidential.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-3 sm:px-5 lg:px-6">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 py-5 lg:block">
          <div className="flex h-full flex-col rounded-[1.75rem] border border-sidebar-border bg-sidebar p-4 shadow-soft">
            <Link to="/" className="mb-6 flex items-center gap-3 px-1.5 py-1">
              <Mascot className="h-11 w-11" />
              <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">MindHaven</span>
            </Link>

            <nav className="flex flex-1 flex-col gap-1.5">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl py-2 pl-4 pr-3 text-sm font-semibold transition-all duration-200",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-200",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                        active
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-muted text-muted-foreground group-hover:bg-card group-hover:text-primary",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </nav>

            <Link
              to="/companion"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-pastel-mint/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <Mascot className="h-11 w-11 animate-float" />
              <span className="min-w-0">
                <span className="block text-xs font-bold text-foreground">Sage is here</span>
                <span className="block text-[11px] leading-tight text-muted-foreground">Talk it out, anytime</span>
              </span>
            </Link>

            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{user?.full_name || "Student"}</p>
                <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={() => logout()}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/85 px-3 py-3 backdrop-blur lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <Mascot className="h-9 w-9" />
              <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">MindHaven</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => logout()}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </header>

          <main className="flex-1 px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
            <Outlet />
          </main>

          {/* Bottom nav (mobile) */}
          <nav className="sticky bottom-0 z-30 flex items-stretch justify-around gap-0.5 border-t border-border/60 bg-background/92 px-1.5 py-1.5 backdrop-blur lg:hidden">
            {NAV.map(({ to, short, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl pb-1 pt-2 text-[10px] font-semibold transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0 h-1 w-7 rounded-full bg-primary transition-opacity duration-200",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                      active ? "bg-primary/12" : "",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="truncate">{short}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}