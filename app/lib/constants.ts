/**
 * The one booking link — SINGLE SOURCE OF TRUTH. It is the Zcal invite the
 * site's booking modal embeds (see booking-modal.tsx), and the backend's
 * BOOKING_URL env var (used in lead auto-reply emails) must be set to the
 * same link, or leads get emailed a different event than the site books.
 */
export const BOOKING_URL = "https://zcal.co/i/JW03svfU";

/**
 * Discovery call length — SINGLE SOURCE OF TRUTH. The site used to say both
 * "15-minute" and "30-minute"; every mention of the call's length must derive
 * from this. The Zcal event behind BOOKING_URL must be this long too.
 */
export const DISCOVERY_CALL = {
  minutes: 15,
  /** Prose, e.g. "a free 15-minute call" */
  label: "15-minute",
  /** Badges and micro-copy, e.g. "15-min session" */
  short: "15-min",
} as const;

/**
 * Reply-time promises — SINGLE SOURCE OF TRUTH, so the contact page, CTAs,
 * and emails can't drift apart.
 */
export const RESPONSE_TIME = {
  /** First human reply to an inquiry, e.g. "We typically reply within 24 hours." */
  reply: "within 24 hours",
  /** Compact form for micro-copy, e.g. "Response within 24 h" */
  replyShort: "24 h",
  /** Written proposal after a discovery call */
  proposal: "within 48 hours",
} as const;

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

/**
 * Fixed sprint-fee pricing — SINGLE SOURCE OF TRUTH.
 * $4,500 (Core MVP sprint) to $18,500 (Enterprise system). Every published price
 * (llms.txt, comparison pages, calculator copy, FAQ schema) must derive from here
 * instead of re-typing the figures.
 */
export const PRICING = {
  min: 4500,
  max: 18500,
  minLabel: "$4,500",
  maxLabel: "$18,500",
  /** En-dash range for prose, e.g. "$4,500 – $18,500" */
  range: "$4,500 – $18,500",
  /** Hyphen range for plain-text feeds (llms.txt), e.g. "$4,500 - $18,500" */
  rangeAscii: "$4,500 - $18,500",
} as const;

/**
 * Company identity, contact, and location facts — SINGLE SOURCE OF TRUTH.
 * Previously duplicated across root.tsx (Organization JSON-LD), llms.txt, and
 * llms-full.txt, which risked NAP drift (inconsistent name/address/phone weakens
 * both local SEO and AI-assistant trust). All three now read from here.
 */
export const COMPANY = {
  name: "Weblaud LLC",
  legalName: "Weblaud LLC",
  url: "https://weblaud.com",
  email: "info@weblaud.com",
  phone: "+1-307-220-9766",
  github: "https://github.com/weblaud-us",
  logo: "https://weblaud.com/favicon.png",
  ogImage: "https://weblaud.com/og-image.jpg",
  twitterHandle: "@weblaud",
  /** Positioning: capability-led, serving clients worldwide. */
  remoteFirst: true,
  address: {
    streetAddress: "1621 Central Ave",
    addressLocality: "Cheyenne",
    addressRegion: "WY",
    postalCode: "82001",
    addressCountry: "US",
  },
  geo: { latitude: 41.14, longitude: -104.8202 },
  areaServed: ["US", "CA", "GB", "EU", "Worldwide"],
  sameAs: [
    "https://github.com/weblaud-us",
    "https://www.facebook.com/weblaud",
    "https://www.instagram.com/weblaud",
    "https://www.linkedin.com/company/weblaud",
  ],
} as const;
