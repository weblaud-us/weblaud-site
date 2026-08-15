import { TIMELINE } from "./constants";
import type { CalculatorConfig, RateOption, TimelineSpeed } from "./types";


export interface EstimateSelection {
  projectTypeId: string;
  featureIds: string[];
  speedId: string;
}

export interface EstimateResult {
  totalWeeks: number;
  costMin: number;
  costMax: number;
  projectType?: RateOption;
  features: RateOption[];
  speed?: TimelineSpeed;
}

const DEFAULT_RANGE_SPREAD_PCT = 0.28;
const DEFAULT_ROUND_TO_NEAREST = 500;

function snap(amount: number, increment: number): number {
  if (!Number.isFinite(increment) || increment <= 0) return Math.round(amount);
  return Math.round(amount / increment) * increment;
}

export function estimateProject(
  config: CalculatorConfig,
  selection: EstimateSelection,
): EstimateResult {
  const projectType =
    config.projectTypes.find((p) => p.id === selection.projectTypeId) ??
    config.projectTypes[0];
  const speed =
    config.timelineSpeeds.find((s) => s.id === selection.speedId) ??
    config.timelineSpeeds[0];

  // Preserve the order the admin configured them in, and drop unknown ids.
  const features = config.features.filter((f) =>
    selection.featureIds.includes(f.id),
  );

  const featureWeeks = features.reduce((acc, f) => acc + (f.weeks || 0), 0);
  const featureCostMultiplier = features.reduce(
    (acc, f) => acc + (f.costMultiplier || 0),
    0,
  );

  // Bound the timeline to the company delivery range (single source of truth).
  const rawWeeks =
    (projectType?.weeks ?? 0) + featureWeeks + (speed?.weeksOffset ?? 0);
  const totalWeeks = Math.min(
    TIMELINE.max,
    Math.max(TIMELINE.min, Math.round(rawWeeks * 10) / 10),
  );

  const increment = config.roundToNearest ?? DEFAULT_ROUND_TO_NEAREST;
  const spread = config.rangeSpreadPct ?? DEFAULT_RANGE_SPREAD_PCT;

  const rawCost =
    config.baseCost *
    (projectType?.costMultiplier ?? 1) *
    (1 + featureCostMultiplier) *
    (speed?.multiplier ?? 1);

  const costMin = snap(rawCost, increment);
  const costMax = snap(costMin * (1 + spread), increment);

  return { totalWeeks, costMin, costMax, projectType, features, speed };
}
