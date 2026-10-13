import * as React from "react";
import { cn } from "~/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. Clamped so a bad value from the API can't overflow the bar. */
  value: number;
}

function Progress({ value, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-white/10", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-[#0A84FF] transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
