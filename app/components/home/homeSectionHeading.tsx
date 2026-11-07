import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { cn } from "~/lib/utils";

/**
 * Left-aligned home section opener: dot + mono eyebrow on a hairline rule,
 * then the Barlow heading and an optional subtitle. `pinned` tightens it for
 * scroll-pinned sections, which must fit one viewport.
 */
export function HomeSectionHeading({ eyebrow, title, subtitle, titleId, className, pinned = false }: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  titleId?: string;
  className?: string;
  pinned?: boolean;
}) {
  const [ref, isVisible] = useBlurAnimation<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("mb-10 md:mb-14", pinned && "pin:mb-8 pin-compact:mb-5", getBlurAnimationClasses(isVisible), className)}
    >
      <div className={cn("mb-5 flex items-center gap-3 md:mb-7", pinned && "pin-compact:mb-3")}>
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-xs">
          {eyebrow}
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.08]" />
      </div>
      <h2
        id={titleId}
        className={cn(
          "max-w-3xl text-balance font-barlow text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl",
          pinned && "pin-compact:max-w-5xl pin-compact:text-4xl",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base md:text-lg",
            pinned && "pin-compact:mt-2 pin-compact:max-w-3xl pin-compact:text-base",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
