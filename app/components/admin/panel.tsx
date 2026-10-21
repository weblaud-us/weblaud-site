import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PanelProps {
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, meta, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={cn("rounded-xl border border-white/10 bg-card-bg p-5", className)}>
      {(title || meta) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && <h2 className="text-sm font-medium text-white">{title}</h2>}
          {meta && <div className="text-xs text-white/40">{meta}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}