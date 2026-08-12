export const BOOKING_URL = "https://zcal.co/weblaud/30min";

/**
 * Delivery timeline — SINGLE SOURCE OF TRUTH.
 * Every public timeline claim (hero, meta descriptions, FAQ schema, llms.txt,
 * calculator, insights) must derive from this. Do not hardcode week ranges
 * anywhere else.
 */
/**
 * Cost-savings claim vs. hiring in-house — SINGLE SOURCE OF TRUTH.
 * Derived from our own published pricing: $4,500-$18,500 fixed sprint fee
 * vs. $180,000+/yr in-house senior hire. Even at the top of our range that's
 * ~90% lower; we state a conservative, defensible 70%+ / under 30% so the
 * claim never needs to be walked back.
 */
export const SAVINGS = {
  /** "under 30% of the cost" framing */
  shareOfCost: "under 30% of the cost",
  /** "70%+ lower cost" framing */
  lowerCost: "70%+ lower cost",
  /** For prose that needs a bare percentage, e.g. "by 70%" */
  percent: "70%",
} as const;

/**
 * Case-study results disclosure — SINGLE SOURCE OF TRUTH.
 * Portfolio impact figures are illustrative of typical engagements rather than
 * audited per-client results, so every surface that publishes them must say so
 * in the same words. Once a case study's numbers come from a real, verifiable
 * engagement, move that study out from under this disclosure instead of
 * quietly leaving it covered.
 */
export const RESULTS_DISCLOSURE =
  "Figures shown are representative of typical engagement outcomes. Individual results vary with scope, data quality, and existing systems.";

export const TIMELINE = {
  min: 4,
  max: 14,
  /** Prose range, e.g. "4 to 14 weeks" */
  range: "4 to 14 weeks",
  /** Compact/inline range, e.g. "4–14 weeks" */
  rangeShort: "4–14 weeks",
  /** Simple / MVP builds */
  mvp: "4 to 6 weeks",
  /** Full enterprise builds */
  enterprise: "within 14 weeks",
} as const;
