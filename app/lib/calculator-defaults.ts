import type { CalculatorConfig } from "./types";

/**
 * Mirrors CALCULATOR_CONFIG_SEED in backend/scripts/migrate-content.ts.
 *
 * Used when the API is unreachable or returns an unconfigured document, so the
 * wizard degrades to a usable, honest estimate instead of rendering an empty
 * shell. Keep in step with the seed when rates change.
 */
export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfig = {
  baseCost: 4500,
  rangeSpreadPct: 0.28,
  roundToNearest: 500,
  projectTypes: [
    {
      id: "operations",
      title: "Operations Platform / Admin Portal",
      desc: "Custom internal dashboards, RBAC workflows, data management to replace spreadsheets.",
      weeks: 6,
      costMultiplier: 1.0,
    },
    {
      id: "webapp",
      title: "SaaS & Web Application",
      desc: "Customer-facing portal, subscription engine, high-concurrency cloud web app.",
      weeks: 8,
      costMultiplier: 1.25,
    },
    {
      id: "mobile",
      title: "Mobile App & Backend",
      desc: "iOS & Android mobile apps paired with scalable cloud microservices.",
      weeks: 8,
      costMultiplier: 1.3,
    },
    {
      id: "ai",
      title: "AI & Machine Learning Engine",
      desc: "Custom RAG pipelines, predictive analytics, automated decision-making models.",
      weeks: 10,
      costMultiplier: 1.5,
    },
  ],
  features: [
    {
      id: "auth",
      title: "User Auth & Multi-Role RBAC",
      desc: "SSO, OAuth, granular permissions",
      weeks: 1,
      costMultiplier: 0.1,
    },
    {
      id: "payments",
      title: "Stripe / Payment Billing",
      desc: "Subscriptions, invoicing, webhooks",
      weeks: 1,
      costMultiplier: 0.15,
    },
    {
      id: "ai_integration",
      title: "Custom AI / LLM Feature",
      desc: "Smart search, automated summaries, predictions",
      weeks: 2,
      costMultiplier: 0.25,
    },
    {
      id: "realtime",
      title: "Real-time Sync & WebSockets",
      desc: "Live chat, notifications, live data updates",
      weeks: 1.5,
      costMultiplier: 0.2,
    },
    {
      id: "integrations",
      title: "Third-Party API Integrations",
      desc: "CRM, ERP, Quickbooks, Zapier connections",
      weeks: 1.5,
      costMultiplier: 0.15,
    },
    {
      id: "mobile_sync",
      title: "Offline Storage & Mobile Sync",
      desc: "Offline capability for field workers",
      weeks: 2,
      costMultiplier: 0.2,
    },
  ],
  timelineSpeeds: [
    {
      id: "standard",
      label: "Standard Sprint Pace",
      multiplier: 1.0,
      desc: "Regular agile iterations (4–14 weeks total)",
      weeksOffset: 0,
    },
    {
      id: "expedited",
      label: "Expedited Launch Pace",
      multiplier: 1.25,
      desc: "Dedicated multi-engineer squad for accelerated delivery",
      weeksOffset: -2,
    },
  ],
};

/**
 * A config is only usable if the wizard has something to pick in every step.
 * A seeded-but-cleared document is as unusable as a network failure.
 */
export function isUsableConfig(
  config: CalculatorConfig | null | undefined,
): config is CalculatorConfig {
  return Boolean(
    config &&
      typeof config.baseCost === "number" &&
      config.baseCost > 0 &&
      config.projectTypes?.length > 0 &&
      config.timelineSpeeds?.length > 0,
  );
}
