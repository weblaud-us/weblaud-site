import type { BudgetBand, HeardAbout, LeadStage, LeadTimeline } from "./types";

/** Pipeline order, as shown in the admin stage filter and select. */
export const LEAD_STAGES: { value: LeadStage; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "call_booked", label: "Call booked" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const LEAD_STAGE_LABEL = Object.fromEntries(
  LEAD_STAGES.map((s) => [s.value, s.label]),
) as Record<LeadStage, string>;

export function isLeadStage(value: unknown): value is LeadStage {
  return LEAD_STAGES.some((s) => s.value === value);
}

/**
 * Options for the optional "How did you hear about us?" question on the
 * public forms. Values must match HEARD_ABOUT_OPTIONS in the backend's
 * leads/lead.constants.ts — the API rejects anything else.
 */
export const HEARD_ABOUT_OPTIONS: { value: HeardAbout; label: string }[] = [
  { value: "google", label: "Google / search" },
  { value: "ai_assistant", label: "ChatGPT / AI assistant" },
  { value: "clutch", label: "Clutch / a directory" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral / word of mouth" },
  { value: "other", label: "Other" },
];

export const HEARD_ABOUT_LABEL = Object.fromEntries(
  HEARD_ABOUT_OPTIONS.map((o) => [o.value, o.label]),
) as Record<HeardAbout, string>;

/** Narrows a form value to a known answer; anything else is dropped. */
export function parseHeardAbout(value: unknown): HeardAbout | undefined {
  return HEARD_ABOUT_OPTIONS.some((o) => o.value === value)
    ? (value as HeardAbout)
    : undefined;
}

/**
 * Optional qualifiers on the contact form. Values must match BUDGET_OPTIONS /
 * TIMELINE_OPTIONS in the backend's leads/lead.constants.ts — the API rejects
 * anything else. The bands start at our minimum sprint fee (PRICING.min).
 */
export const BUDGET_OPTIONS: { value: BudgetBand; label: string }[] = [
  { value: "under_5k", label: "Under $5k" },
  { value: "5k_10k", label: "$5k – $10k" },
  { value: "10k_20k", label: "$10k – $20k" },
  { value: "20k_plus", label: "$20k+" },
  { value: "not_sure", label: "Not sure yet" },
];

export const TIMELINE_OPTIONS: { value: LeadTimeline; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "1_3_months", label: "Within 1–3 months" },
  { value: "3_6_months", label: "In 3–6 months" },
  { value: "exploring", label: "Just exploring" },
];

export const BUDGET_LABEL = Object.fromEntries(
  BUDGET_OPTIONS.map((o) => [o.value, o.label]),
) as Record<BudgetBand, string>;

export const TIMELINE_LABEL = Object.fromEntries(
  TIMELINE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<LeadTimeline, string>;

export function parseBudget(value: unknown): BudgetBand | undefined {
  return BUDGET_OPTIONS.some((o) => o.value === value) ? (value as BudgetBand) : undefined;
}

export function parseTimeline(value: unknown): LeadTimeline | undefined {
  return TIMELINE_OPTIONS.some((o) => o.value === value)
    ? (value as LeadTimeline)
    : undefined;
}

/**
 * A person's name as the contact form accepts it: any script's letters (plus
 * combining marks), with the apostrophes, hyphens, dots and spaces real names
 * carry — "O'Brien", "José", "Jean-Luc", "李". The old /^[A-Za-z\s]+$/
 * turned those visitors away. Mirrors the backend's greetingName.
 */
export const PERSON_NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'’. -]*$/u;

/**
 * Builds the PATCH …/admin/:id/pipeline body from the admin pipeline form.
 * Blank inputs become null so the backend clears the field instead of
 * keeping an old value.
 */
export function pipelineBodyFromForm(formData: FormData) {
  const text = (name: string) => {
    const value = String(formData.get(name) ?? "").trim();
    return value || null;
  };
  const stage = formData.get("stage");
  const followUp = text("nextFollowUpAt");

  return {
    ...(isLeadStage(stage) ? { stage } : {}),
    internalNotes: text("internalNotes"),
    // <input type="date"> gives YYYY-MM-DD. Stored as midnight UTC so the
    // daily digest picks it up on that morning; always display it with
    // formatFollowUpDate (UTC) or US timezones would show the day before.
    nextFollowUpAt: followUp ? `${followUp}T00:00:00.000Z` : null,
    lostReason: text("lostReason"),
  };
}

/** "Ada King Lovelace" → { firstName: "Ada", lastName: "King Lovelace" }. */
export function splitName(full: string) {
  const [firstName = "", ...rest] = full.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

/** Follow-up dates are calendar days stored as midnight UTC — show them in UTC. */
export function formatFollowUpDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
}

/** YYYY-MM-DD for an <input type="date"> default value. */
export function followUpInputValue(iso?: string) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}

/** A follow-up date that has arrived (or passed) as of `now`. */
export function isFollowUpDue(nextFollowUpAt?: string, now = new Date()) {
  return !!nextFollowUpAt && new Date(nextFollowUpAt) <= now;
}
