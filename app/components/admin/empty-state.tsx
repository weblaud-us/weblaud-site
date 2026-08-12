import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-white/5">
        <Icon className="size-5 text-white/40" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/70">{title}</p>
        {description && (
          <p className="text-sm text-white/40 mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
