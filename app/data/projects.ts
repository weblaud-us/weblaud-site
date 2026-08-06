import pimg01 from "~/assets/pimg-01.png";
import pimg02 from "~/assets/pimg-02.png";
import pimg03 from "~/assets/pimg-03.png";
import pimg04 from "~/assets/pimg-04.png";
import pimg05 from "~/assets/pimg-05.png";
import pimg06 from "~/assets/pimg-06.png";

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  problem: string;
  solution: string;
  techStack: string[];
  businessImpact: string;
}

/**
 * One case study per Weblaud service (see ~/data/services.ts) so the
 * portfolio always demonstrates something we actually sell.
 */
export const projects: Project[] = [
  {
    id: 1,
    slug: "enterprise-operations-erp-platform",
    title: "Enterprise Operations & ERP Platform",
    description:
      "Custom back-office ERP unifying billing, inventory, and multi-branch reporting into a single platform with granular role-based access control.",
    features: [
      "Automated invoicing, payment workflows & PDF generation",
      "Role-based access control (RBAC) & full audit logging",
      "Real-time executive reporting & financial dashboards",
    ],
    image: pimg05,
    imageAlt: "Enterprise Operations & ERP Dashboard",
    problem: "A multi-branch retail operator ran finance, inventory, and staff permissions across six disconnected spreadsheets and a legacy desktop accounting tool, forcing manual reconciliation every month and giving branch managers no real-time visibility into cash position or stock levels.",
    solution: "We built a unified operations platform with automated invoicing and payment workflows, granular role-based access control down to the branch level, and live executive dashboards pulling directly from the transaction database — replacing the manual reconciliation process entirely.",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis", "AWS", "Stripe"],
    businessImpact: "Cut month-end close from 5 days to same-day, eliminated manual reconciliation errors across all 6 branches, and gave leadership real-time cash and inventory visibility for the first time."
  },
  {
    id: 2,
    slug: "b2b-saas-subscription-platform",
    title: "B2B SaaS Subscription Platform",
    description:
      "Multi-tenant SaaS platform built for scale from day one — subscription billing, secure tenant isolation, and zero-downtime deploys.",
    features: [
      "Multi-tenant architecture with secure data isolation",
      "Stripe-powered subscription billing & plan management",
      "Zero-downtime CI/CD pipeline with automated testing",
    ],
    image: pimg04,
    imageAlt: "B2B SaaS Subscription Platform",
    problem: "An early-stage SaaS startup had validated demand with a single-tenant prototype, but the codebase couldn't support paying customers — no subscription billing, no tenant isolation, and every deploy required a maintenance window.",
    solution: "We re-architected the application into a secure multi-tenant platform, integrated Stripe for self-serve subscription billing and plan upgrades, and built a CI/CD pipeline with automated test gates enabling zero-downtime deploys multiple times a week.",
    techStack: ["React", "Next.js", "Node.js", "PostgreSQL", "Stripe", "Docker"],
    businessImpact: "Went from zero to 40 paying tenants in the first quarter post-launch with zero billing incidents, and cut average deploy time from a 2-hour maintenance window to under 10 minutes with no downtime."
  },
  {
    id: 3,
    slug: "offline-first-field-service-app",
    title: "Offline-First Field Service Mobile App",
    description:
      "Cross-platform Flutter app and API backend giving field technicians full functionality in zero-connectivity environments, with automatic background sync.",
    features: [
      "Single Flutter codebase for iOS, Android & Web",
      "Offline-first local storage with background sync",
      "Push notifications & in-app payment collection",
    ],
    image: pimg02,
    imageAlt: "Offline-First Field Service Mobile App",
    problem: "A field services company's technicians regularly lost work orders and photo documentation when cellular signal dropped in basements, rural sites, and metal-frame buildings, forcing them to redo paperwork back at the office.",
    solution: "We built a single Flutter codebase for iOS and Android backed by local-first storage, so technicians can complete work orders, capture photos, and collect payment entirely offline. A background sync queue pushes everything to the cloud API the moment connectivity returns.",
    techStack: ["Flutter", "SQLite", "Node.js", "PostgreSQL", "Firebase Cloud Messaging"],
    businessImpact: "Eliminated redone paperwork from lost connectivity, cut average job completion time by 25%, and gave dispatch real-time visibility into technician status even in low-signal areas."
  },
  {
    id: 4,
    slug: "ai-support-assistant-rag-pipeline",
    title: "AI Support Assistant & RAG Pipeline",
    description:
      "Production RAG pipeline and AI assistant trained securely on a company's private documentation, deployed as a support-deflection tool for its customer success team.",
    features: [
      "Custom RAG pipeline over a private knowledge base",
      "AI assistant secured to company data, zero data leakage",
      "Evaluation framework tracking accuracy & hallucination rate",
    ],
    image: pimg01,
    imageAlt: "AI Support Assistant & RAG Pipeline",
    problem: "A B2B software company's support team was drowning in repetitive tickets that were already answered somewhere in their 400-page internal documentation, but agents couldn't search it fast enough to keep up with ticket volume.",
    solution: "We built a production RAG pipeline that indexes the company's private documentation into a vector database, paired with an AI assistant that answers support agents' questions with cited sources in seconds. A rigorous evaluation framework tracks accuracy and flags low-confidence answers for human review before they reach a customer.",
    techStack: ["Python", "FastAPI", "OpenAI API", "Pinecone", "PostgreSQL"],
    businessImpact: "Cut average ticket resolution time by 45% within the first 6 weeks and reduced escalations to senior support staff by a third, with no drop in customer satisfaction scores."
  },
  {
    id: 5,
    slug: "self-hosted-video-voice-infrastructure",
    title: "Self-Hosted Video & Voice Infrastructure",
    description:
      "Self-hosted WebRTC video, voice, and messaging infrastructure replacing per-minute third-party vendor billing for a telehealth platform.",
    features: [
      "Custom WebRTC / LiveKit video & voice infrastructure",
      "Real-time session quality & uptime monitoring",
      "Automated DevOps, CI/CD & 99.9% uptime SLA",
    ],
    image: pimg03,
    imageAlt: "Real-Time Video & Voice Infrastructure Monitoring",
    problem: "A telehealth startup was paying a third-party video SaaS vendor per-minute fees that scaled directly with patient visit volume, eating an increasing share of revenue as the platform grew, with no control over call quality or uptime.",
    solution: "We deployed self-hosted LiveKit/WebRTC infrastructure on the company's own cloud, giving them full ownership of video and voice sessions. A real-time monitoring dashboard tracks call quality and infrastructure health, backed by automated CI/CD and a 99.9% uptime SLA.",
    techStack: ["LiveKit", "WebRTC", "Node.js", "Redis", "Docker", "AWS"],
    businessImpact: "Eliminated per-minute vendor billing entirely, cutting video infrastructure costs by 65% at current volume, while maintaining 99.9% uptime with full control over call quality and data residency."
  },
  {
    id: 6,
    slug: "dedicated-engineering-pod-scaling-sprint",
    title: "Dedicated Engineering Pod for a Scaling SaaS Team",
    description:
      "Embedded senior full-stack pod integrated directly into a scaling SaaS company's existing sprints to clear a critical product backlog without a 3-to-6 month hiring cycle.",
    features: [
      "Senior full-stack engineers embedded in client's toolchain",
      "Direct Slack integration & daily standups from week one",
      "Transparent sprint billing & weekly milestone demos",
    ],
    image: pimg06,
    imageAlt: "Dedicated Engineering Pod for a Scaling SaaS Team",
    problem: "A venture-backed SaaS company had a roadmap it couldn't ship — its 4-person engineering team was already at capacity, and a 3-to-6 month hiring cycle would have meant missing its next funding milestone.",
    solution: "We embedded a 3-engineer senior pod directly into the client's existing sprints and toolchain within 48 hours, working from their backlog and attending their daily standups as if we were internal hires, with zero onboarding drag on their core team.",
    techStack: ["Node.js", "React", "Python", "PostgreSQL", "AWS"],
    businessImpact: "Shipped the delayed roadmap 10 weeks ahead of the original in-house hiring timeline, directly supporting the company's next funding round, with zero net increase to permanent headcount."
  },
];
