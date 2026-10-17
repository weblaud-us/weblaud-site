import type { Invoice, ProjectMilestone } from "~/lib/types";

/** Start of the UTC calendar day — milestone due dates are stored as UTC midnights (see lib/dates.ts). */
function utcDay(value: string | Date): number {
  const d = new Date(value);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Due before today (UTC) and not done. A milestone due today isn't late yet. */
export function isMilestoneLate(milestone: Pick<ProjectMilestone, "dueDate" | "status">, now: Date = new Date()) {
  if (!milestone.dueDate || milestone.status === "done") return false;
  return utcDay(milestone.dueDate) < utcDay(now);
}

/**
 * The milestone to show as "next": the first not-done one in due-date order
 * (undated ones last, keeping the PM's order among equals). Null when
 * everything is done or there are none.
 */
export function nextMilestone<T extends Pick<ProjectMilestone, "dueDate" | "status">>(milestones: T[]): T | null {
  const open = milestones
    .map((m, index) => ({ m, index }))
    .filter(({ m }) => m.status !== "done");
  open.sort((a, b) => {
    const da = a.m.dueDate ? utcDay(a.m.dueDate) : Infinity;
    const db = b.m.dueDate ? utcDay(b.m.dueDate) : Infinity;
    return da === db ? a.index - b.index : da - db;
  });
  return open[0]?.m ?? null;
}

/** What has actually been billed: every invoice except drafts and voided ones. */
export function invoicedTotal(invoices: Pick<Invoice, "status" | "total">[]): number {
  return invoices
    .filter((i) => i.status !== "draft" && i.status !== "void")
    .reduce((sum, i) => sum + i.total, 0);
}
