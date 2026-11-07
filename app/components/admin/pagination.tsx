import { Link, useNavigate, useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { PAGE_SIZES, pageWindow } from "~/lib/pagination";

type Meta = { page: number; limit: number; total: number; totalPages: number };

/**
 * Footer for every paginated admin list: "Showing 21–40 of 57", a rows-per-page
 * select, and Prev / 1 … 4 5 6 … 12 / Next. Links keep the other query params
 * (tab, stage, filters) and navigate client-side.
 */
export function AdminPagination({
  meta,
  noun = "results",
  className,
}: {
  meta: Meta;
  noun?: string;
  className?: string;
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Coerced: not every endpoint's meta has been through a number transform.
  const page = Number(meta.page) || 1;
  const limit = Number(meta.limit) || 20;
  const total = Number(meta.total) || 0;
  const totalPages = Math.max(1, Number(meta.totalPages) || 1);

  if (total === 0) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(searchParams);
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

  const setLimit = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.set("limit", value);
    navigate(`?${params.toString()}`);
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pageLink = (active: boolean) =>
    cn(
      buttonVariants({ variant: active ? "outline" : "ghost", size: "icon" }),
      "size-8 text-xs",
      !active && "text-white/60 hover:text-white",
    );
  const edgeLink = (disabled: boolean) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "gap-1 text-white/60 hover:text-white",
      disabled && "pointer-events-none opacity-30",
    );

  return (
    <nav
      aria-label="pagination"
      className={cn(
        "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-4 text-xs text-white/50">
        <span>
          Showing <span className="text-white/80">{from}–{to}</span> of{" "}
          <span className="text-white/80">{total}</span> {noun}
        </span>
        <label className="flex items-center gap-2">
          Rows
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/50 [&>option]:bg-card-bg"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="flex items-center gap-1">
        <li>
          <Link
            to={hrefFor(page - 1)}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={edgeLink(page <= 1)}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        </li>
        {pageWindow(page, totalPages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden className="flex size-8 items-center justify-center text-white/30">
              <MoreHorizontal className="size-4" />
            </li>
          ) : (
            <li key={p}>
              <Link
                to={hrefFor(p)}
                aria-current={p === page ? "page" : undefined}
                className={pageLink(p === page)}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>
          <Link
            to={hrefFor(page + 1)}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={edgeLink(page >= totalPages)}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
