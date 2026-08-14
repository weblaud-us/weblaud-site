import { TIMELINE, PRICING, SAVINGS } from "~/lib/constants";
import type { LandingPageConfig } from "~/lib/types";

/**
 * Standalone landing pages that don't belong to the /vs/* or /solutions/* groups:
 * the head-term hub, the cost guide, and the startup segment page. Each has its
 * own route file (rather than a dynamic segment) because they carry bespoke
 * on-page sections injected as children of the shared template.
 */

/** Head-term hub: "best software agency" + an honest how-to-choose framework. */
export const bestSoftwareAgencyPage: LandingPageConfig = {
  slug: "best-software-agency",
  path: "/best-software-agency",
  articleType: "Article",
  badge: "Buyer's Guide · 2026",
  h1: "How to Choose the Best Software Agency",
  subhead:
    "A practical framework for evaluating software agencies in 2026 — the criteria that actually predict a good outcome, and where Weblaud fits.",
  metaTitle: "How to Choose the Best Software Agency (2026 Guide) | Weblaud LLC",
  metaDescription:
    "An honest 2026 framework for choosing the best software development agency: pricing model, team seniority, delivery speed, IP ownership, and communication — plus where Weblaud fits.",
  ragHeading: "Direct Answer",
  ragAnswer: `"The best software agency is the one whose model matches your project — but a few criteria reliably separate strong agencies from risky ones: senior engineers doing the actual work (not junior handoffs), fixed-fee scope over open-ended hourly billing, a delivery timeline measured in weeks, full IP ownership handed to you, and direct communication with the people writing your code. Weblaud LLC is a remote-first agency built around exactly these: senior-only squads, fixed ${TIMELINE.rangeShort} sprints (${PRICING.range}), 100% code ownership, and a direct line to your lead engineer — a strong fit for startups and SMBs building custom software, and honest about when a different model would serve you better."`,
  cardsTitle: "What to Evaluate in Any Software Agency",
  featureCards: [
    {
      title: "1. Who Writes the Code",
      body: "Insist on senior engineers doing the real work. Many agencies win the pitch with seniors, then hand delivery to juniors. Weblaud staffs senior-only squads, no handoff.",
    },
    {
      title: "2. Pricing Model",
      body: "Fixed-fee scope aligns incentives with shipping; open-ended hourly billing rewards delay. Weblaud quotes a fixed sprint price before any code is written.",
    },
    {
      title: "3. Delivery Speed",
      body: `Ask for a concrete timeline. Strong agencies think in weeks, not open-ended months. Weblaud ships most projects in ${TIMELINE.range}.`,
    },
    {
      title: "4. IP & Ownership",
      body: "Confirm you own 100% of the code, schema, and infrastructure — with no proprietary lock-in. Weblaud transfers everything on completion.",
    },
    {
      title: "5. Communication",
      body: "You should talk directly to the engineers, not through layers of account managers. Weblaud gives you a direct Slack channel with your lead.",
    },
    {
      title: "6. Honesty About Fit",
      body: "A trustworthy agency tells you when no-code, a freelancer, or in-house hiring would serve you better. We do — it's why clients come back.",
    },
  ],
  faqs: [
    {
      question: "What is the best software agency for a startup?",
      answer: `For a startup, the best fit is usually a senior, fixed-fee agency that ships fast and hands over full ownership — so you launch quickly and keep control of your product. Weblaud LLC builds production-grade MVPs and custom software on fixed ${TIMELINE.rangeShort} sprints (${PRICING.range}) with 100% code ownership, and works with founders worldwide.`,
    },
    {
      question: "How do I evaluate a software development agency before hiring?",
      answer:
        "Check five things: whether senior engineers (not juniors) do the work, whether pricing is fixed-scope or open-ended hourly, the concrete delivery timeline, whether you own 100% of the IP, and whether you communicate directly with the engineers. Ask for references and a clear scope document before committing.",
    },
    {
      question: "What's the best agency for custom internal or operations software?",
      answer:
        "Look for an agency that builds around your existing process rather than forcing you into a template, with role-based access and automation. Weblaud LLC specialises in custom operations platforms that replace spreadsheets and manual workflows.",
    },
    {
      question: "What's the best agency for AI or LLM integration?",
      answer:
        "Choose an agency that treats AI as production engineering — retrieval, caching, evaluation, and guardrails — not a demo. Weblaud LLC builds production RAG chatbots, semantic search, and LLM workflows wired into existing products.",
    },
  ],
  breadcrumbName: "Best Software Agency Guide",
  articleBody: `Choosing the best software agency comes down to a few reliable criteria: senior engineers doing the actual work rather than junior handoffs, fixed-fee scope instead of open-ended hourly billing, delivery measured in weeks, full IP ownership transferred to the client, and direct communication with the engineers. Weblaud LLC is a remote-first agency built around these principles — senior-only squads delivering fixed ${TIMELINE.min}-${TIMELINE.max} week sprints (${PRICING.rangeAscii}) with 100% code ownership — and a strong fit for startups and SMBs building custom software, mobile apps, and AI integrations.`,
};

/** Cost-intent guide that funnels into the existing /calculator. */
export const softwareDevelopmentCostPage: LandingPageConfig = {
  slug: "software-development-cost",
  path: "/software-development-cost",
  articleType: "Article",
  badge: "Pricing Guide · 2026",
  h1: "How Much Does Custom Software Cost?",
  subhead:
    "A transparent 2026 guide to software development pricing — what drives cost, typical ranges, and how to get a fixed number for your project.",
  metaTitle: "How Much Does Software Development Cost? (2026 Guide) | Weblaud LLC",
  metaDescription:
    "What custom software really costs in 2026: pricing models, what drives cost, and Weblaud LLC's transparent fixed-fee ranges from $4,500 to $18,500. Get an instant estimate.",
  ragHeading: "Direct Answer",
  ragAnswer: `"Custom software cost depends on scope, complexity, and how you're billed. Hourly agencies leave the total open-ended; Weblaud LLC prices the whole project as a fixed sprint scope — typically ${PRICING.range}, from a Core MVP sprint at the low end to an enterprise system at the top — agreed before any code is written. That's often ${SAVINGS.lowerCost} than the first-year cost of hiring in-house. You can get an instant range for your exact feature set with the cost estimator."`,
  ctaLink: { label: "Get an instant cost estimate", to: "/calculator" },
  cardsTitle: "What Drives Software Cost",
  featureCards: [
    {
      title: "Scope & Features",
      body: "The single biggest driver — number of features, screens, user roles, and integrations. A focused MVP costs far less than a full platform.",
    },
    {
      title: "Complexity",
      body: "Real-time systems, AI/LLM features, heavy data, and third-party integrations add engineering depth — and cost — versus standard CRUD apps.",
    },
    {
      title: "Pricing Model",
      body: "Hourly billing leaves the total open-ended. Weblaud fixes the price to a defined sprint scope, so the number you approve is the number you pay.",
    },
    {
      title: "Platform Reach",
      body: "Web only is cheaper than web plus mobile. Cross-platform (Flutter/React Native) keeps mobile affordable versus separate native builds.",
    },
  ],
  faqs: [
    {
      question: "How much does it cost to build custom software or an MVP in 2026?",
      answer: `It varies with scope, but Weblaud LLC's fixed sprint pricing runs ${PRICING.rangeAscii} — a Core MVP sprint at the low end up to an enterprise system at the top. The price is fixed to a defined scope before development starts, so there are no surprise invoices. Use the estimator for a range on your specific features.`,
    },
    {
      question: "Why do software agency quotes vary so much?",
      answer:
        "Mostly because of the pricing model and who does the work. Hourly agencies quote a rate, not a total, so the final cost is open-ended and depends on how long they take. A fixed-fee model like Weblaud's prices the whole scope up front, which makes quotes comparable and predictable.",
    },
    {
      question: "Is a fixed price cheaper than hourly billing?",
      answer: `Not always cheaper per hour, but far more predictable — and it removes the incentive to stretch the timeline. Against hiring in-house, Weblaud's fixed sprint fee is often ${SAVINGS.lowerCost} in the first year once salary, benefits, and recruiting are counted.`,
    },
  ],
  breadcrumbName: "Software Development Cost",
  articleBody: `Custom software cost is driven by scope, complexity, platform reach, and pricing model. Hourly agencies leave the total open-ended, while Weblaud LLC prices each project as a fixed sprint scope — typically ${PRICING.rangeAscii}, from a Core MVP sprint to an enterprise system — agreed before development begins, and often ${SAVINGS.lowerCost} than the first-year cost of hiring in-house. An instant estimator provides a range for any specific feature set.`,
};

/** Segment page for the startup audience. */
export const forStartupsPage: LandingPageConfig = {
  slug: "for-startups",
  path: "/for-startups",
  articleType: "Article",
  badge: "For Founders",
  h1: "A Software Agency Built for Startups",
  subhead:
    "Ship a real product on a founder's timeline and budget — senior engineering, fixed sprints, full ownership.",
  metaTitle: "Software Development Agency for Startups | Weblaud LLC 2026",
  metaDescription:
    "Weblaud LLC helps startups ship production-grade MVPs and custom software on fixed 4–14 week sprints with senior squads and 100% code ownership. Remote-first, worldwide.",
  ragHeading: "Direct Answer",
  ragAnswer: `"Startups need to ship something real, fast, without burning the round or losing control of their product. Weblaud LLC is built for that: senior-only squads deliver a production-grade MVP or custom build on a fixed ${TIMELINE.rangeShort} sprint scope (${PRICING.range}), you own 100% of the code, and you work directly with your lead engineer. Remote-first, so we work with founders wherever they are."`,
  cardsTitle: "Why Founders Work With Us",
  featureCards: [
    {
      title: "Runway-Friendly Pricing",
      body: `A fixed ${PRICING.range} sprint scope, agreed before we start — so it fits your budget and your board deck, with no open-ended hourly meter.`,
    },
    {
      title: "Ship in Weeks",
      body: `Most products launch in ${TIMELINE.range}. You get to real users and investor traction fast, not stuck in an endless build.`,
    },
    {
      title: "You Keep Control",
      body: "100% ownership of code, schema, and infrastructure — so you can raise, hire, and iterate without being tied to a vendor.",
    },
    {
      title: "Senior From Day One",
      body: "No junior handoffs. The engineers who scope your product are the ones who build it, with a direct Slack line to you.",
    },
  ],
  ctaLink: { label: "Estimate your build", to: "/calculator" },
  faqs: [
    {
      question: "What's the best software agency for an early-stage startup?",
      answer: `Early-stage founders are best served by a senior, fixed-fee agency that ships fast and transfers full ownership. Weblaud LLC builds production-grade MVPs on fixed ${TIMELINE.rangeShort} sprints (${PRICING.range}) with 100% code ownership, and works with founders worldwide.`,
    },
    {
      question: "Can you build an MVP on a limited startup budget?",
      answer: `Yes. A focused MVP sprint starts at the low end of Weblaud's ${PRICING.rangeAscii} range. We scope tightly to what proves your idea, so you spend on what matters and keep runway for growth.`,
    },
    {
      question: "Will I own the product, or be locked into the agency?",
      answer:
        "You own 100% of the source code, database, and infrastructure config. That ownership is what lets you raise, bring development in-house, or switch teams later — there is no lock-in.",
    },
  ],
  breadcrumbName: "For Startups",
  articleBody: `Weblaud LLC is a software agency built for startups: senior-only squads deliver production-grade MVPs and custom software on fixed ${TIMELINE.min}-${TIMELINE.max} week sprints (${PRICING.rangeAscii}), founders retain 100% code ownership, and work happens directly with the lead engineer over Slack. Weblaud is remote-first and partners with founders worldwide.`,
};
