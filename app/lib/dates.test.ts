import { describe, expect, it } from "vitest";
import { addUtcDays, formatDate, formatShortDate, formatTimestamp, startOfUtcWeek } from "./dates";

describe("calendar dates", () => {
  // Midnight UTC is how <input type="date"> values are stored. In a timezone
  // west of UTC a local formatter prints the previous day — the bug.
  it("prints the stored day regardless of the machine's timezone", () => {
    expect(formatDate("2026-10-17T00:00:00.000Z")).toBe("Oct 17, 2026");
    expect(formatShortDate("2026-10-17T00:00:00.000Z")).toBe("Oct 17");
  });
});

describe("formatTimestamp", () => {
  it("formats in the requested timezone", () => {
    const iso = "2026-10-17T23:30:00.000Z";
    expect(formatTimestamp(iso, { timeZone: "UTC" })).toBe("Oct 17, 2026");
    expect(formatTimestamp(iso, { timeZone: "Asia/Dhaka" })).toBe("Oct 18, 2026");
    expect(formatTimestamp(iso, { withTime: true, timeZone: "UTC" })).toMatch(/Oct 17, 2026.*11:30\sPM/);
  });
});

describe("startOfUtcWeek", () => {
  it("returns Monday 00:00 UTC for any day of the week", () => {
    const monday = "2026-10-12T00:00:00.000Z";
    expect(startOfUtcWeek(new Date("2026-10-12T09:00:00Z")).toISOString()).toBe(monday);
    expect(startOfUtcWeek(new Date("2026-10-17T23:59:00Z")).toISOString()).toBe(monday);
    // Sunday belongs to the week that started six days earlier.
    expect(startOfUtcWeek(new Date("2026-10-18T12:00:00Z")).toISOString()).toBe(monday);
  });

  it("steps whole days in UTC", () => {
    expect(addUtcDays(new Date("2026-10-12T00:00:00Z"), 7).toISOString()).toBe(
      "2026-10-19T00:00:00.000Z",
    );
  });
});
