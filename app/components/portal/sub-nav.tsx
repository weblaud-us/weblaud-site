import { NavLink, Outlet, useOutletContext } from "react-router";
import { cn } from "~/lib/utils";

export interface SubNavItem {
  to: string;
  label: string;
  /** Exact match — for a section's index page. */
  end?: boolean;
  /** Items waiting on the reader; shown as a small pill when > 0. */
  count?: number;
}

/** Segmented control for a tab's sub-pages (e.g. Decisions → Approvals / Changes / Questions). */
export function SubNav({ label, items }: { label: string; items: SubNavItem[] }) {
  return (
    <nav
      aria-label={label}
      className="mb-6 inline-flex max-w-full gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex min-w-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80",
            )
          }
        >
          <span className="truncate">{item.label}</span>
          {!!item.count && (
            <span className="rounded-full bg-[#0A84FF]/20 px-1.5 text-[10px] font-semibold leading-4 text-[#0A84FF]">
              <span aria-hidden="true">{item.count}</span>
              <span className="sr-only"> ({item.count} waiting)</span>
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * A tab with sub-pages: the segmented control, then the sub-page. Forwards
 * the project workspace context unchanged, so every sub-page reads it with
 * useOutletContext() exactly as it did when it was a top-level tab.
 */
export function SectionLayout({ label, items }: { label: string; items: SubNavItem[] }) {
  const context = useOutletContext();
  return (
    <>
      <SubNav label={label} items={items} />
      <Outlet context={context} />
    </>
  );
}
