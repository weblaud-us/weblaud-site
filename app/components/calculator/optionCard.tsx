import { cn } from "~/lib/utils";

interface OptionCardProps {
  /** Shared across every card in a group — this is what makes radios a group. */
  name: string;
  value: string;
  type: "radio" | "checkbox";
  checked: boolean;
  onSelect: (value: string) => void;
  title: string;
  desc?: string;
  /** Rendered left of the title, e.g. the project-type icon. */
  icon?: React.ReactNode;
  /** Rendered right of the title — the checkbox tick or a clock glyph. */
  indicator?: React.ReactNode;
  className?: string;
}

export function OptionCard({
  name,
  value,
  type,
  checked,
  onSelect,
  title,
  desc,
  icon,
  indicator,
  className,
}: OptionCardProps) {
  return (
    <label
      className={cn(
        "relative block cursor-pointer rounded-2xl border transition-all duration-300 group overflow-hidden select-none",
        "bg-[#0e0e0e] border-[#1f1f1f] hover:border-white/20 hover:bg-white/[0.02]",
        checked &&
          "bg-gradient-to-br from-primary/[0.08] via-[#0e0e0e] to-[#0e0e0e] border-primary/60 ring-1 ring-primary/40 shadow-xl shadow-blue-500/10 hover:border-primary",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-black",
        className,
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />

      {/* Subtle top-right ambient glow when active */}
      {checked && (
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 relative z-10">
        {icon && (
          <div
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
              checked
                ? "bg-primary/15 border border-primary/40 shadow-md shadow-blue-500/20"
                : "bg-white/[0.03] border border-white/[0.08] text-gray-300 group-hover:border-white/20 group-hover:text-white",
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <h4
              className={cn(
                "text-sm sm:text-lg font-bold font-barlow tracking-tight transition-colors leading-snug",
                checked ? "text-white" : "text-gray-200 group-hover:text-white",
              )}
            >
              {title}
            </h4>
            {indicator}
          </div>
          {desc && (
            <p className="text-xs sm:text-sm text-gray-400 font-barlow mt-1 sm:mt-1.5 leading-relaxed">
              {desc}
            </p>
          )}
        </div>
      </div>
    </label>
  );
}
