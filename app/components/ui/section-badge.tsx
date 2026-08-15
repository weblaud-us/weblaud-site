import React from "react";
import { cn } from "~/lib/utils";

export interface SectionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text content of the badge */
  text?: string;
  /** Optional icon rendered on the left */
  icon?: React.ReactNode;
  /** Optional dynamic accent/glow color (e.g. #3b82f6 or rgb/hex) */
  color?: string;
  /** Whether to show the indicator dot (default false) */
  pulsingDot?: boolean;
  /** Visual variant */
  variant?: "glass" | "glow" | "outline" | "gradient";
  /** Optional secondary text or counter */
  badgeLabel?: string;
  children?: React.ReactNode;
}

export const SectionBadge = React.forwardRef<HTMLDivElement, SectionBadgeProps>(
  (
    {
      text,
      icon,
      color = "#3b82f6",
      pulsingDot = false,
      variant = "glass",
      badgeLabel,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-barlow tracking-[0.06em] uppercase select-none transition-all duration-300 backdrop-blur-xl",
          variant === "glass" &&
            "bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] shadow-[0_0_20px_rgba(0,0,0,0.5)]",
          variant === "glow" &&
            "bg-white/[0.05] border border-white/[0.12] shadow-[0_0_25px_rgba(0,0,0,0.6)]",
          variant === "outline" && "border border-white/15 bg-transparent",
          variant === "gradient" &&
            "bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-white/[0.08] border border-white/10",
          className
        )}
        style={{
          ...style,
          ...(color
            ? {
                borderColor: `${color}35`,
                boxShadow: `0 0 20px ${color}15, 0 4px 15px rgba(0,0,0,0.4)`,
              }
            : {}),
        }}
        {...props}
      >
        {/* Ambient inner glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{
            background: color
              ? `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 80%)`
              : undefined,
          }}
        />

        {/* Top subtle highlight reflection */}
        <div
          className="absolute top-0 left-3 right-3 h-[1px] opacity-40 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${color || "rgba(255,255,255,0.6)"}, transparent)`,
          }}
        />

        {/* Pulsing indicator dot (optional, default false) */}
        {pulsingDot && (
          <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 duration-1000"
              style={{ backgroundColor: color }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}`,
              }}
            />
          </span>
        )}

        {/* Custom Icon with subtle glow */}
        {icon && (
          <span
            className="shrink-0 flex items-center justify-center transition-all duration-500"
            style={{
              color: color || "inherit",
              filter: color ? `drop-shadow(0 0 6px ${color}80)` : undefined,
            }}
          >
            {icon}
          </span>
        )}

        {/* Main Text Content */}
        {children ? (
          children
        ) : (
          <span
            className="font-bold transition-colors duration-500 tracking-[0.06em]"
            style={{ color: color || "inherit" }}
          >
            {text}
          </span>
        )}

        {/* Optional Secondary Label */}
        {badgeLabel && (
          <span className="text-white/50 pl-2 border-l border-white/10 font-medium tracking-[0.04em] text-[11px]">
            {badgeLabel}
          </span>
        )}
      </div>
    );
  }
);

SectionBadge.displayName = "SectionBadge";

export default SectionBadge;

