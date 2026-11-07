import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, DEFAULT_THEME, readTheme, type Theme } from "~/lib/theme";
import { cn } from "~/lib/utils";

/**
 * Both icons are always rendered and CSS shows the right one from
 * html[data-theme], so the server-rendered toggle is correct before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.06] text-white transition-colors duration-300 hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      <Sun className="wl-theme-icon-sun size-[18px]" aria-hidden="true" />
      <Moon className="wl-theme-icon-moon size-[18px]" aria-hidden="true" />
    </button>
  );
}
