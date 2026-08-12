import { describe, expect, it } from "vitest";
import { estimateProject } from "./calculator";
import { TIMELINE } from "./constants";
import type { CalculatorConfig } from "./types";

/**
 * Kept byte-for-byte in step with the fixture in
 * backend/src/modules/estimates/estimate.util.spec.ts so the two
 * implementations of the pricing arithmetic are provably identical.
 */
const CONFIG: CalculatorConfig = {
  baseCost: 4500,
  rangeSpreadPct: 0.28,
  roundToNearest: 500,
  projectTypes: [
    { id: "operations", title: "Operations", desc: "", weeks: 6, costMultiplier: 1.0 },
    { id: "webapp", title: "Web App", desc: "", weeks: 8, costMultiplier: 1.25 },
    { id: "ai", title: "AI Engine", desc: "", weeks: 10, costMultiplier: 1.5 },
  ],
  features: [
    { id: "auth", title: "Auth", desc: "", weeks: 1, costMultiplier: 0.1 },
    { id: "payments", title: "Payments", desc: "", weeks: 1, costMultiplier: 0.15 },
    { id: "ai_integration", title: "AI", desc: "", weeks: 2, costMultiplier: 0.25 },
  ],
  timelineSpeeds: [
    { id: "standard", label: "Standard", multiplier: 1.0, weeksOffset: 0 },
    { id: "expedited", label: "Expedited", multiplier: 1.25, weeksOffset: -2 },
  ],
};

const base = { projectTypeId: "operations", featureIds: [], speedId: "standard" };

describe("estimateProject", () => {
  it("computes the base case with no features", () => {
    const r = estimateProject(CONFIG, base);
    expect(r.totalWeeks).toBe(6);
    expect(r.costMin).toBe(4500); // 4500 * 1.0 * 1 * 1.0
    expect(r.costMax).toBe(6000); // 4500 * 1.28 = 5760, snapped to 500
  });

  it("stacks feature weeks and cost multipliers additively", () => {
    const r = estimateProject(CONFIG, {
      ...base,
      featureIds: ["auth", "payments"],
    });
    expect(r.totalWeeks).toBe(8); // 6 + 1 + 1
    expect(r.costMin).toBe(5500); // 4500 * 1.25 = 5625 -> 5500
    expect(r.features.map((f) => f.id)).toEqual(["auth", "payments"]);
  });

  it("applies the project type and speed multipliers", () => {
    const r = estimateProject(CONFIG, {
      projectTypeId: "webapp",
      featureIds: [],
      speedId: "expedited",
    });
    expect(r.totalWeeks).toBe(6); // 8 + 0 - 2
    expect(r.costMin).toBe(7000); // 4500 * 1.25 * 1.25 = 7031.25 -> 7000
  });

  it("clamps the timeline to the published delivery window", () => {
    const long = estimateProject(
      {
        ...CONFIG,
        projectTypes: [{ id: "x", title: "X", desc: "", weeks: 40, costMultiplier: 1 }],
      },
      { ...base, projectTypeId: "x" },
    );
    expect(long.totalWeeks).toBe(TIMELINE.max);

    const short = estimateProject(
      {
        ...CONFIG,
        projectTypes: [{ id: "x", title: "X", desc: "", weeks: 1, costMultiplier: 1 }],
      },
      { ...base, projectTypeId: "x" },
    );
    expect(short.totalWeeks).toBe(TIMELINE.min);
  });

  it("honours a configured rounding increment and range spread", () => {
    const r = estimateProject(
      { ...CONFIG, roundToNearest: 1000, rangeSpreadPct: 0.5 },
      base,
    );
    expect(r.costMin).toBe(5000); // 4500 -> nearest 1000
    expect(r.costMax).toBe(8000); // 7500 -> nearest 1000
  });

  it("falls back to plain rounding when the increment is unusable", () => {
    const r = estimateProject({ ...CONFIG, roundToNearest: 0 }, base);
    expect(r.costMin).toBe(4500);
  });

  it("ignores unknown feature ids and falls back for unknown type/speed ids", () => {
    const r = estimateProject(CONFIG, {
      projectTypeId: "nope",
      featureIds: ["nope", "auth"],
      speedId: "nope",
    });
    expect(r.features.map((f) => f.id)).toEqual(["auth"]);
    expect(r.projectType?.id).toBe("operations");
    expect(r.speed?.id).toBe("standard");
  });

  it("survives an empty config without throwing", () => {
    const r = estimateProject(
      {
        baseCost: 4500,
        rangeSpreadPct: 0.28,
        roundToNearest: 500,
        projectTypes: [],
        features: [],
        timelineSpeeds: [],
      },
      base,
    );
    expect(r.totalWeeks).toBe(TIMELINE.min);
    expect(r.costMin).toBe(4500);
    expect(r.features).toEqual([]);
  });
});
