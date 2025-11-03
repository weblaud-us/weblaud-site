import * as React from "react";
import { cn } from "~/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "bg-black/40 border border-light-black rounded-lg px-3 py-3 text-white font-barlow text-sm focus:outline-none focus:border-primary/50 transition-colors [&>option]:bg-card-bg [&>option]:text-white [&>option]:py-2 [&>option]:px-3 [&>option]:rounded-md [&>option]:my-1",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
