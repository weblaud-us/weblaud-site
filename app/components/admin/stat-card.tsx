import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  to?: string;
  accent?: boolean;
}

export function StatCard({ label, value, icon: Icon, to, accent }: StatCardProps) {
  const content = (linked: boolean) => (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-white/10 bg-card-bg p-4 transition-colors",
        linked
          ? "group-hover:border-white/20 group-hover:bg-secondary"
          : "hover:border-white/20 hover:bg-secondary",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
          accent
            ? "bg-primary/15 text-primary"
            : cn("bg-white/5 text-white/60", linked && "group-hover:text-primary"),
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-white leading-none tabular-nums">{value}</p>
        <p className="text-xs text-white/50 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="group block">
        {content(true)}
      </Link>
    );
  }
  return content(false);
}
