import { redirect } from "react-router";

export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Reads ?page= and ?limit= for an admin list loader. Only the sizes offered
 * by the rows-per-page select are accepted, so a hand-edited URL can't ask the
 * API for 10,000 rows.
 */
export function readPageParams(url: URL, defaultLimit = DEFAULT_PAGE_SIZE) {
  const page = Math.max(1, Math.floor(Number(url.searchParams.get("page"))) || 1);
  const rawLimit = Number(url.searchParams.get("limit"));
  const limit = (PAGE_SIZES as readonly number[]).includes(rawLimit)
    ? rawLimit
    : defaultLimit;
  return { page, limit };
}

/**
 * After deletes (or a stale bookmark) the requested page can be past the end;
 * send the browser to the last real page instead of rendering an empty list.
 */
export function redirectPastLastPage(
  url: URL,
  meta: { page: number; totalPages: number },
) {
  const page = Number(meta.page);
  const totalPages = Number(meta.totalPages);
  if (totalPages > 0 && page > totalPages) {
    const params = new URLSearchParams(url.search);
    params.set("page", String(totalPages));
    throw redirect(`${url.pathname}?${params.toString()}`);
  }
}

/** Page numbers to show, with null for a gap: 1 … 4 5 6 … 12. */
export function pageWindow(current: number, total: number): (number | null)[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}
