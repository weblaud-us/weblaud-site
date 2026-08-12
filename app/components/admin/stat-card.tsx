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
  const content = (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          accent ? "bg-[#0A84FF]/15 text-[#0A84FF]" : "bg-white/5 text-white/60",
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-white leading-none">{value}</p>
        <p className="text-xs text-white/50 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
