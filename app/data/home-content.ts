/**
 * Copy for the home page ROI cards (RoiCalculatorWidget, BottleneckSelector).
 * Figures that are already published elsewhere carry `valueFrom` and are read
 * out of lib/constants.ts by the component, so they cannot drift. Prices never
 * appear here: budget questions route to /calculator.
 */

import { PRICING, SAVINGS, TIMELINE } from "~/lib/constants";
import type { FaqItem } from "~/components/home/faq";

/**
 * Home page FAQ. Static rather than the CMS /faqs list so the questions match
 * the AI-first positioning above them; the FAQPage JSON-LD in routes/home.tsx
 * reads the same array, so schema and visible answers cannot drift.
 */
export const HOME_FAQS: FaqItem[] = [
  {
    _id: "home-faq-ai-or-software",
    question: "Is Weblaud LLC an AI agency or a custom software development company?",
    answer:
      "Both. We are an AI-first software engineering studio. We build standalone AI systems—including 24/7 AI voice receptionists, RAG knowledge assistants, and automated document workflows—as well as complete B2B SaaS platforms, internal operations portals, and mobile apps with or without AI.",
  },
  {
    _id: "home-faq-timeline",
    question: "How long does a software or AI project take to ship?",
    answer: `We operate on focused, fixed-scope agile sprint cycles. Targeted AI workflows, voice agents, and MVP builds typically ship in ${TIMELINE.mvp}, while full enterprise platforms complete within 8 to ${TIMELINE.max} weeks. You receive a detailed milestone roadmap during discovery and bi-weekly sprint reviews.`,
  },
  {
    _id: "home-faq-pricing",
    question: "What is Weblaud LLC's pricing model?",
    answer: `We operate on transparent, fixed-fee sprint pricing starting at ${PRICING.minLabel} for focused AI automations and MVPs up to ${PRICING.maxLabel}+ for full enterprise platforms. You receive 100% IP and source-code ownership with zero unpredictable hourly billing or surprise invoices.`,
  },
  {
    _id: "home-faq-vs-in-house",
    question: "Why hire Weblaud LLC instead of in-house software engineers?",
    answer: `Hiring a single senior AI or full-stack engineer costs over $180,000 annually once salary, benefits, and recruiting fees are factored in—and takes 3 to 6 months to hire. Weblaud LLC deploys an active senior engineering squad immediately for a fixed sprint fee at ${SAVINGS.shareOfCost}.`,
  },
  {
    _id: "home-faq-support",
    question: "Do you provide post-launch support, cloud maintenance, and AI monitoring?",
    answer:
      "Yes. We provide continuous SLA support packages including 99.9% uptime monitoring, automated database backups, LLM latency/cost monitoring, security patch updates, and on-demand feature expansion as your user base grows.",
  },
  {
    _id: "home-faq-integrations",
    question: "Can you integrate with our existing APIs, databases, or legacy systems?",
    answer:
      "Yes. We connect directly to your existing PostgreSQL/MySQL/MongoDB databases, CRM/ERP tools, third-party REST/GraphQL APIs, and cloud services without disrupting your active operational workflows.",
  },
];

/**
 * ROI estimator copy. The arithmetic and its assumptions live in the
 * component, which derives build payback from PRICING so this section can never
 * quote a project price that contradicts /calculator.
 */
export const ROI = {
  badge: "Cost of Manual Work",
  badgeLabel: "ROI",
  heading: "See what manual work is actually costing your business",
  subheading:
    "Move the sliders to estimate the hours and payroll your team reclaims once repetitive admin moves into custom software and AI automation.",
  fields: {
    teamSize: "Staff handling manual admin, spreadsheets or calls",
    hoursPerWeek: "Hours lost per person each week to repetitive tasks",
    hourlyCost: "Average hourly staff cost (salary + overhead)",
  },
  results: {
    savings: "Estimated annual payroll value reclaimed",
    hours: "Hours saved / year",
    payback: "Typical build payback",
  },
  cta: "Get your custom build estimate",
} as const;

/**
 * Bottleneck selector copy: one operational bottleneck per option, with the
 * three-step system that replaces it and the change it makes. Metrics are
 * capabilities or published figures, never guarantees (no uptime SLA, no
 * latency claim that depends on a telephony provider).
 */
export const BOTTLENECKS = {
  badge: "Bottleneck to AI Solution",
  badgeLabel: "Solutions",
  heading: "Pick the bottleneck. See the system that replaces it.",
  subheading:
    "Choose where work piles up today to see how the request flows once it is automated, and what changes for your team.",
  cta: "Explore this solution",
  options: [
    {
      id: "voice",
      label: "24/7 AI Voice & Call Intake",
      path: ["Inbound Call", "Weblaud AI Engine", "Booked in CRM & Calendar"],
      metric: { value: "24/7", label: "Every call answered, day or night" },
      summary:
        "A voice agent answers every call, qualifies the caller and books the slot, so nothing waits for office hours.",
    },
    {
      id: "docs",
      label: "AI Document & Workflow Automation",
      path: ["Inbound PDF / Email", "Weblaud AI Engine", "Synced in CRM & Calendar"],
      metric: { valueFrom: "automationShare", label: "Less manual work" },
      summary:
        "Documents are read, checked and filed into your systems automatically. Your team reviews only the exceptions.",
    },
    {
      id: "portal",
      label: "Custom Operations Portal",
      path: ["Spreadsheets & Inboxes", "Weblaud Platform", "One Source of Truth"],
      metric: { value: "1", label: "System in place of scattered spreadsheets and inboxes" },
      summary:
        "Approvals, records and reporting move out of scattered files into one role-based portal your whole team works from.",
    },
    {
      id: "product",
      label: "Web & Mobile Product",
      path: ["Your Requirements", "Weblaud Engineering", "Live in Production"],
      metric: { valueFrom: "deliveryRange", label: "From kickoff to live" },
      summary:
        "A production web or mobile product with auth, billing and admin tooling, shipped in fixed-scope milestones.",
    },
  ],
} as const;
