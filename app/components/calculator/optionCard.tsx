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

/**
 * A selectable card backed by a real <input> inside its <label>.
 *
 * The input is visually hidden but still focusable, so keyboard operation
 * (arrow keys within a radio group, Space to toggle a checkbox) and screen
 * reader semantics come for free rather than being reimplemented with
 * role="radio" and key handlers. All selected/focus styling hangs off the
 * `peer-*` variants driven by that input.
 */
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
        "relative block cursor-pointer rounded-2xl border transition-all duration-300",
        "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10",
        checked &&
          "bg-primary/10 border-primary shadow-lg shadow-primary/10 hover:bg-primary/10",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-black",
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
      <div className="flex items-start gap-4 p-5 sm:p-6">
        {icon && <div className="p-3 bg-black/40 rounded-xl shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold font-barlow text-white flex items-center justify-between gap-2">
            <span>{title}</span>
            {indicator}
          </h4>
          {desc && (
            <p className="text-xs text-gray-400 font-barlow mt-1.5 leading-relaxed">
              {desc}
            </p>
          )}
        </div>
      </div>
    </label>
  );
}
