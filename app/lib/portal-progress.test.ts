import { describe, expect, it } from "vitest";
import { invoicedTotal, isMilestoneLate, nextMilestone } from "./portal-progress";

const NOW = new Date("2026-10-17T23:30:00.000Z");

describe("isMilestoneLate", () => {
  it("is late only when due before today (UTC) and not done", () => {
    expect(isMilestoneLate({ dueDate: "2026-10-16T00:00:00.000Z", status: "pending" }, NOW)).toBe(true);
    expect(isMilestoneLate({ dueDate: "2026-10-17T00:00:00.000Z", status: "in_progress" }, NOW)).toBe(false);
    expect(isMilestoneLate({ dueDate: "2026-10-01T00:00:00.000Z", status: "done" }, NOW)).toBe(false);
    expect(isMilestoneLate({ status: "pending" }, NOW)).toBe(false);
  });
});

describe("nextMilestone", () => {
  it("picks the earliest open milestone, undated ones last", () => {
    const m = nextMilestone([
      { title: "Done", status: "done", dueDate: "2026-09-01T00:00:00.000Z" },
      { title: "Undated", status: "pending" },
      { title: "Later", status: "pending", dueDate: "2026-12-01T00:00:00.000Z" },
      { title: "Sooner", status: "in_progress", dueDate: "2026-11-01T00:00:00.000Z" },
    ]);
    expect(m?.title).toBe("Sooner");
  });

  it("returns null when everything is done", () => {
    expect(nextMilestone([{ status: "done" as const }])).toBeNull();
    expect(nextMilestone([])).toBeNull();
  });
});

describe("invoicedTotal", () => {
  it("counts everything billed, not drafts or voided invoices", () => {
    expect(
      invoicedTotal([
        { status: "draft", total: 100 },
        { status: "sent", total: 200 },
        { status: "paid", total: 300 },
        { status: "partially_paid", total: 400 },
        { status: "overdue", total: 500 },
        { status: "void", total: 600 },
      ]),
    ).toBe(1400);
  });
});
