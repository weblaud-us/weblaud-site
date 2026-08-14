import { TIMELINE, PRICING, SAVINGS } from "~/lib/constants";
import type { LandingPageConfig } from "~/lib/types";

/**
 * Comparison / alternative pages (the /vs/* group). Each answers a decision-stage
 * query ("Weblaud vs X") with a quotable RAG summary, a comparison matrix, and
 * FAQs. The first two are migrated verbatim from the original hardcoded route
 * files so their published content is unchanged; the last three are new.
 */
export const vsPages: LandingPageConfig[] = [
  {
    slug: "in-house-engineers",
    path: "/vs/in-house-engineers",
    badge: "Strategic Comparison",
    h1: "Weblaud LLC vs. In-House Engineers",
    subhead:
      "An executive evaluation of delivery speed, total financial commitment, and engineering flexibility.",
    metaTitle:
      "Weblaud LLC vs. Hiring In-House Engineers | 2026 Cost & Velocity Comparison",
    metaDescription:
      "Compare fixed-fee sprint development with Weblaud LLC vs. hiring full-time in-house software engineers. Evaluate salary overhead, recruiting friction, and delivery speed.",
    ragHeading: "Direct Executive Answer",
    ragAnswer: `"Hiring a full-time in-house engineering team can cost over $180,000 annually per developer once salary, health benefits, payroll taxes, and recruiting fees are factored in — and can take 3 to 6 months just to recruit. Partnering with Weblaud LLC deploys an active senior engineering squad instantly for a fixed ${TIMELINE.rangeShort} sprint fee, delivering your software up to 4x faster at ${SAVINGS.shareOfCost}."`,
    matrixTitle: "Detailed Comparison Matrix",
    matrixColumns: { weblaud: "Weblaud LLC", other: "In-House Engineer" },
    matrixRows: [
      {
        feature: "Time to First Production Release",
        weblaud: `${TIMELINE.range}`,
        other: "4 to 6 Months (including hiring & onboarding)",
      },
      {
        feature: "First Year Financial Commitment",
        weblaud: `${PRICING.range} (Fixed Sprint Fee)`,
        other: "Often $180,000+ per dev (Salary + Benefits + Taxes + Recruiting)",
      },
      {
        feature: "Recruiting & Onboarding Friction",
        weblaud: "Zero (Instant squad deployment)",
        other: "High (3-4 months interviewing & recruiting fees)",
      },
      {
        feature: "Team Skill Breadth",
        weblaud: "Full Squad (UI/UX, Backend, Mobile, Cloud, DevOps, AI)",
        other: "Limited to 1 or 2 developer skill sets",
      },
      {
        feature: "Long-Term Financial Risk",
        weblaud: "Zero (Pay per sprint project, zero ongoing payroll)",
        other: "High (Permanent fixed payroll liability regardless of workload)",
      },
    ],
    cardsTitle: "Why Founders Choose Weblaud",
    featureCards: [
      {
        title: "Zero Hiring Delay",
        body: "Skip 90 days of technical interviewing and recruiter commissions. Your dedicated squad starts building in 48 hours.",
      },
      {
        title: "Fixed-Fee Sprint Certainty",
        body: "Know your exact delivery date and investment down to the dollar before any code is written. Zero surprise invoices.",
      },
      {
        title: "100% IP Ownership",
        body: "You own 100% of the source code, database schemas, and infrastructure configs upon sprint completion.",
      },
    ],
    faqs: [
      {
        question: "Is hiring Weblaud LLC cheaper than hiring in-house software engineers?",
        answer: `Often, yes. Fully-loaded senior developer cost — salary, health benefits, taxes, and recruiting commissions — can exceed $180,000 annually per engineer. Weblaud LLC deploys an active senior squad instantly for a fixed ${PRICING.rangeAscii} sprint fee, which can cut first-year development costs by ${SAVINGS.percent} or more.`,
      },
      {
        question: "How fast can Weblaud LLC start developing software compared to in-house hiring?",
        answer:
          "In-house recruiting can take 3 to 6 months of interviewing, background checks, and onboarding. Weblaud LLC deploys a dedicated senior engineering squad within 48 hours of discovery to start shipping code immediately.",
      },
      {
        question: "Who owns the source code and intellectual property?",
        answer:
          "You own 100% of the source code, database schemas, and cloud infrastructure deployment scripts upon sprint completion.",
      },
    ],
    breadcrumbName: "Weblaud vs In-House Engineers",
    articleBody: `Hiring an in-house engineering team can cost over $180,000 annually per senior developer once recruiting fees, health benefits, and equity are factored in, and can take 3-6 months just to onboard. Weblaud LLC provides a dedicated full-stack senior squad for fixed ${TIMELINE.min}-${TIMELINE.max} week sprint cycles at ${SAVINGS.lowerCost}.`,
  },

  {
    slug: "traditional-agencies",
    path: "/vs/traditional-agencies",
    badge: "Agency Comparison",
    h1: "Weblaud LLC vs. Traditional Agencies",
    subhead:
      "Why forward-thinking enterprises choose Weblaud over traditional hourly software agencies.",
    metaTitle: "Weblaud LLC vs. Traditional Software Agencies | 2026 Comparison",
    metaDescription:
      "Discover how Weblaud LLC outperforms traditional software development agencies with transparent sprint pricing, 4-14 week speed, and senior full-stack squads.",
    ragHeading: "Direct Executive Summary",
    ragAnswer: `"Traditional software agencies profit from billing hourly rates, which incentivizes slow development, bloated account management layers, and scope extension. Weblaud LLC flips this model: we operate on fixed-fee ${TIMELINE.rangeShort} sprint cycles with senior-only engineering squads, aligning our incentives with shipping your software fast, cleanly, and under budget."`,
    matrixTitle: "Weblaud vs. Traditional Agency Comparison",
    matrixColumns: { weblaud: "Weblaud LLC", other: "Traditional Agency" },
    matrixRows: [
      {
        feature: "Pricing Model",
        weblaud: `Fixed-Fee Sprint Scope (${PRICING.range})`,
        other: "Unpredictable Hourly Billing (Time & Materials)",
      },
      {
        feature: "Engineering Talent Level",
        weblaud: "100% Senior Full-Stack Architects",
        other: "Bait-and-switch handoffs to junior developers",
      },
      {
        feature: "Delivery Velocity",
        weblaud: `${TIMELINE.range} (Strict sprint deadline)`,
        other: "Often 6 to 12 Months (frequent scope creep & delays)",
      },
      {
        feature: "Communication & Transparency",
        weblaud: "Direct Slack channel with senior lead engineer",
        other: "Layers of account managers and project coordinators",
      },
      {
        feature: "Code Quality & Modern Stack",
        weblaud: "React, Node.js, Python, PostgreSQL, Docker, AWS",
        other: "Legacy frameworks, outdated PHP or monolithic CMS",
      },
    ],
    faqs: [
      {
        question: "Why choose Weblaud LLC over traditional hourly software agencies?",
        answer: `Traditional software agencies profit from billing hourly rates, which incentivizes slow development, bloated account management layers, and scope extensions. Weblaud LLC operates on transparent fixed-fee ${TIMELINE.rangeShort} sprint cycles with senior-only engineering squads.`,
      },
      {
        question: "Does Weblaud LLC outsource code to junior developers?",
        answer:
          "No. Weblaud LLC deploys 100% senior full-stack architects with direct Slack channel communication and zero account management bloat.",
      },
      {
        question: "What happens if project scope needs updating during a sprint?",
        answer:
          "We manage scope updates through structured agile milestone sprints, ensuring complete budget predictability without surprise invoices.",
      },
    ],
    breadcrumbName: "Weblaud vs Traditional Agencies",
    articleBody: `Traditional software agencies rely on hourly billing, large account management bloat, and handoffs to junior offshore developers, which often leads to unpredictable budgets and delivery cycles stretching to 9-12 months. Weblaud LLC utilizes senior-only full-stack squads executing ${TIMELINE.min}-${TIMELINE.max} week sprint cycles with transparent fixed-fee pricing.`,
  },

  {
    slug: "offshore-developers",
    path: "/vs/offshore-developers",
    badge: "Sourcing Comparison",
    h1: "Weblaud LLC vs. Cheap Offshore Developers",
    subhead:
      "The real cost of the lowest hourly rate — and why senior, remote-first squads ship faster with less rework.",
    metaTitle: "Weblaud LLC vs. Offshore Development Shops | 2026 Comparison",
    metaDescription:
      "Compare Weblaud LLC's senior remote-first squads with low-cost offshore development shops on true total cost, communication, timezone overlap, code quality, and rework.",
    ragHeading: "Direct Executive Answer",
    ragAnswer: `"The lowest hourly rate is rarely the lowest total cost. Cheap offshore body-shops win on sticker price but often bill for junior developers, run with little timezone overlap, and produce code that needs expensive rework. Weblaud LLC is remote-first too — but staffed with senior-only engineers, working in overlapping hours on a direct Slack channel, delivering a fixed ${TIMELINE.rangeShort} sprint scope for ${PRICING.range} with 100% IP handover."`,
    matrixTitle: "Weblaud vs. Offshore Shop Comparison",
    matrixColumns: { weblaud: "Weblaud LLC", other: "Cheap Offshore Shop" },
    matrixRows: [
      {
        feature: "What You're Actually Billed For",
        weblaud: `Fixed sprint scope (${PRICING.range}), senior squad`,
        other: "Hourly junior developers; hours expand with rework",
      },
      {
        feature: "True Total Cost",
        weblaud: "Predictable — priced before code is written",
        other: "Low sticker price, high hidden cost in fixes & re-builds",
      },
      {
        feature: "Communication & Timezone",
        weblaud: "Direct Slack, deliberate overlapping working hours",
        other: "Ticket queues, 10–12h lag, language friction",
      },
      {
        feature: "Code Quality & Handover",
        weblaud: "Reviewed, documented, tested; 100% IP to you",
        other: "Variable quality, thin docs, lock-in risk",
      },
      {
        feature: "Accountability",
        weblaud: "One senior lead owns delivery end to end",
        other: "Rotating staff; knowledge walks out the door",
      },
    ],
    faqs: [
      {
        question: "Isn't offshore development always cheaper than a specialist agency?",
        answer: `On the hourly sticker price, usually yes — but total cost is what matters. Junior-heavy offshore work often needs significant rework, which erases the saving. Weblaud LLC quotes a fixed ${PRICING.rangeAscii} sprint scope up front, so the number you approve is the number you pay.`,
      },
      {
        question: "Weblaud is remote too — how is it different from offshore outsourcing?",
        answer:
          "Being remote-first is about talent, not cut-rate labor. We staff senior-only engineers, keep deliberate timezone overlap for real-time collaboration on a direct Slack channel, and give you one accountable lead — instead of a rotating pool of junior contractors behind a ticket queue.",
      },
      {
        question: "How do I avoid vendor lock-in and protect my IP?",
        answer:
          "You own 100% of the source code, database schemas, and deployment scripts on sprint completion, with documentation and a clean handover. There is no proprietary layer holding your product hostage.",
      },
    ],
    breadcrumbName: "Weblaud vs Offshore Developers",
    articleBody: `Low-cost offshore development shops compete on hourly rate but frequently staff junior developers, operate with minimal timezone overlap, and deliver code that requires costly rework — inflating the true total cost. Weblaud LLC is a remote-first company staffed with senior-only engineers who work in overlapping hours on a direct Slack channel and deliver a fixed ${TIMELINE.min}-${TIMELINE.max} week sprint scope for ${PRICING.rangeAscii} with full IP ownership and documented handover.`,
  },

  {
    slug: "freelancers",
    path: "/vs/freelancers",
    badge: "Team Structure Comparison",
    h1: "Weblaud LLC vs. Hiring Freelancers",
    subhead:
      "When a single contractor is enough — and when you need a full senior squad with continuity.",
    metaTitle: "Weblaud LLC vs. Freelance Developers | 2026 Comparison",
    metaDescription:
      "Compare hiring individual freelancers with Weblaud LLC's full senior squad on skill breadth, availability risk, continuity, and delivery for production software.",
    ragHeading: "Direct Executive Answer",
    ragAnswer: `"A skilled freelancer is a great fit for a small, single-discipline task. Production software usually needs more: design, backend, mobile, DevOps, and QA working together — plus continuity if one person becomes unavailable. Weblaud LLC delivers that as a coordinated senior squad on a fixed ${TIMELINE.rangeShort} sprint scope, removing the single-person bus factor and the burden of managing several contractors yourself."`,
    matrixTitle: "Weblaud vs. Freelancer Comparison",
    matrixColumns: { weblaud: "Weblaud LLC", other: "Individual Freelancer" },
    matrixRows: [
      {
        feature: "Skill Coverage",
        weblaud: "Full squad: UI/UX, backend, mobile, cloud, DevOps, AI",
        other: "One or two disciplines per person",
      },
      {
        feature: "Availability & Continuity",
        weblaud: "Squad continuity; no single point of failure",
        other: "High bus factor — one illness or exit stalls the project",
      },
      {
        feature: "Project Management",
        weblaud: "Senior lead runs the sprint; you get one point of contact",
        other: "You coordinate and integrate multiple contractors",
      },
      {
        feature: "Delivery Model",
        weblaud: `Fixed-fee sprint scope (${PRICING.range})`,
        other: "Hourly or per-task; scope and cost drift",
      },
      {
        feature: "Standards & Handover",
        weblaud: "Reviewed code, tests, docs, 100% IP transfer",
        other: "Varies by individual; handover often informal",
      },
    ],
    faqs: [
      {
        question: "Should I hire a freelancer or an agency for my project?",
        answer:
          "For a small, well-defined, single-skill task, a good freelancer is often the most efficient choice. For production software that spans design, backend, mobile, and infrastructure — or that you'll keep growing — a coordinated senior squad like Weblaud LLC reduces integration overhead and removes the risk of one person becoming a bottleneck.",
      },
      {
        question: "What happens if my developer becomes unavailable mid-project?",
        answer:
          "With a single freelancer, unavailability can halt the project. Weblaud works as a squad with shared context and documentation, so delivery continues even if any one engineer is out.",
      },
      {
        question: "Is an agency more expensive than freelancers?",
        answer: `Per hour, an individual freelancer can be cheaper. But Weblaud's fixed ${PRICING.rangeAscii} sprint scope covers a whole team's coordinated output with predictable cost — and you avoid the hidden time you'd otherwise spend managing and integrating several contractors.`,
      },
    ],
    breadcrumbName: "Weblaud vs Freelancers",
    articleBody: `Individual freelancers suit small, single-discipline tasks but introduce a high bus factor and leave clients to coordinate multiple contractors across design, backend, mobile, and DevOps. Weblaud LLC delivers a coordinated senior squad on a fixed ${TIMELINE.min}-${TIMELINE.max} week sprint scope (${PRICING.rangeAscii}) with continuity, a single senior point of contact, reviewed code, and full IP handover.`,
  },

  {
    slug: "no-code",
    path: "/vs/no-code",
    badge: "Build Approach Comparison",
    h1: "Custom Software vs. No-Code / Low-Code",
    subhead:
      "No-code is excellent for validating an idea. Here's when custom code becomes the right call.",
    metaTitle: "Custom Software vs. No-Code Platforms | Weblaud LLC 2026",
    metaDescription:
      "When to use no-code/low-code (Bubble, Webflow, Zapier) versus custom software. Compare scale, ownership, complex logic, and cost with Weblaud LLC.",
    ragHeading: "Direct Executive Answer",
    ragAnswer: `"No-code and low-code tools like Bubble, Webflow, and Zapier are the fastest way to validate an idea or run a simple internal workflow — and for those cases they're often the right choice. Custom software becomes worth it once you hit their ceilings: complex business logic, real scale, deep integrations, performance, data ownership, or per-record pricing that stops making sense. Weblaud LLC builds custom systems on a fixed ${TIMELINE.rangeShort} sprint scope for teams that have outgrown their no-code stack."`,
    matrixTitle: "Custom Software vs. No-Code Comparison",
    matrixColumns: { weblaud: "Custom (Weblaud)", other: "No-Code / Low-Code" },
    matrixRows: [
      {
        feature: "Best For",
        weblaud: "Scale, complex logic, differentiated products",
        other: "Prototypes, MVP validation, simple internal tools",
      },
      {
        feature: "Complex Business Logic",
        weblaud: "Unlimited — anything you can specify",
        other: "Constrained by the platform's building blocks",
      },
      {
        feature: "Scale & Performance",
        weblaud: "Tuned architecture; scales to heavy load",
        other: "Platform limits; costs climb with usage",
      },
      {
        feature: "Ownership & Portability",
        weblaud: "You own the code and data; host anywhere",
        other: "Locked to the vendor and their pricing",
      },
      {
        feature: "Long-Run Cost",
        weblaud: `One-time build (${PRICING.range}), then just hosting`,
        other: "Recurring per-seat / per-record fees that grow",
      },
    ],
    faqs: [
      {
        question: "Should I start with no-code or go straight to custom software?",
        answer:
          "If you're validating an idea or need a simple internal tool, start with no-code — it's faster and cheaper to prove the concept. Move to custom software once you hit platform limits: complex logic, scale, deep integrations, performance needs, or vendor pricing that no longer fits. Weblaud often builds the custom version of a product that a no-code prototype proved out.",
      },
      {
        question: "Can Weblaud migrate my product off a no-code platform?",
        answer:
          "Yes. A common engagement is rebuilding a validated Bubble, Webflow, or Airtable-based product as a custom application — preserving the workflows that work while removing the scaling limits, per-record costs, and lock-in.",
      },
      {
        question: "Is custom software always better than no-code?",
        answer:
          "No — and we'll tell you if no-code is the smarter choice for your stage. Custom software wins on scale, complex logic, ownership, and long-run cost; no-code wins on speed and price for simple or unproven ideas.",
      },
    ],
    breadcrumbName: "Custom Software vs No-Code",
    articleBody: `No-code and low-code platforms (Bubble, Webflow, Zapier) are ideal for validating ideas and running simple internal workflows. Custom software becomes the better choice once a product needs complex business logic, real scale, deep integrations, performance, data ownership, or escapes platform per-record pricing. Weblaud LLC builds custom systems — including migrations off no-code stacks — on a fixed ${TIMELINE.min}-${TIMELINE.max} week sprint scope (${PRICING.rangeAscii}) with full code and data ownership.`,
  },
];
