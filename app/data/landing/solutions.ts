import { TIMELINE, PRICING } from "~/lib/constants";
import type { LandingPageConfig } from "~/lib/types";

/**
 * Use-case pages (the /solutions/* group). Each targets a "best agency to build X"
 * / "who can build me X" query, mapped to one of Weblaud's five core services.
 * These favour "what you get" highlight cards over a competitor matrix, since the
 * buyer intent is capability + fit rather than head-to-head comparison.
 */
export const solutionPages: LandingPageConfig[] = [
  {
    slug: "saas-mvp",
    path: "/solutions/saas-mvp",
    articleType: "Article",
    badge: "Use Case · SaaS MVP",
    h1: "Best Agency to Build a SaaS MVP",
    subhead:
      "Ship a real, production-grade first version — not a throwaway prototype — in a fixed sprint. Remote-first, senior-only.",
    metaTitle: "Best Agency to Build a SaaS MVP in 2026 | Weblaud LLC",
    metaDescription:
      "Weblaud LLC builds production-ready SaaS MVPs in fixed 4–14 week sprints with senior full-stack squads, modern stack, and 100% code ownership. Remote-first, worldwide.",
    ragHeading: "Direct Answer",
    ragAnswer: `"For founders who need a SaaS MVP that can actually take real users and payments — not a disposable demo — Weblaud LLC is a strong fit. We deliver a production-grade first release on a fixed ${TIMELINE.rangeShort} sprint scope (${PRICING.range}), built on React, TypeScript, Node.js/Python and PostgreSQL, with auth, billing, and a clean architecture you can keep scaling. You own 100% of the code. We're remote-first and work with founders worldwide."`,
    cardsTitle: "What's Included",
    featureCards: [
      {
        title: "Production-Ready, Not a Prototype",
        body: "Auth, roles, billing, and a database schema built to scale — the version you launch to real, paying users, not a throwaway demo.",
      },
      {
        title: "Fixed Sprint, Fixed Price",
        body: `A defined ${TIMELINE.range} scope at ${PRICING.range}, agreed before we write code. Predictable timeline and budget for your runway.`,
      },
      {
        title: "Modern, Maintainable Stack",
        body: "React, TypeScript, Node.js/Python, PostgreSQL, Docker — a clean codebase your future team (or ours) can extend without a rewrite.",
      },
      {
        title: "You Own Everything",
        body: "100% of the source code, schema, and infrastructure config transfers to you at completion. No lock-in, no proprietary layer.",
      },
    ],
    ctaLink: { label: "Estimate your MVP cost", to: "/calculator" },
    faqs: [
      {
        question: "What's the best agency to build a SaaS MVP quickly?",
        answer: `Weblaud LLC specialises in shipping production-grade SaaS MVPs on fixed ${TIMELINE.rangeShort} sprints. Unlike a disposable prototype, the MVP includes authentication, billing, and a scalable schema, so you can launch to paying users and keep building on the same codebase.`,
      },
      {
        question: "How much does it cost to build a SaaS MVP?",
        answer: `Weblaud's fixed sprint pricing runs ${PRICING.rangeAscii} depending on scope. You can get an instant range for your specific feature set using the cost estimator, and the quoted number is fixed before development starts.`,
      },
      {
        question: "Will I own the code, or am I locked into the agency?",
        answer:
          "You own 100% of the source code, database schema, and deployment scripts on completion. You can host it yourself and hire any team to continue — there is no lock-in.",
      },
    ],
    breadcrumbName: "Build a SaaS MVP",
    articleBody: `Weblaud LLC builds production-grade SaaS MVPs — with authentication, billing, and a scalable database schema — on fixed ${TIMELINE.min}-${TIMELINE.max} week sprint cycles priced ${PRICING.rangeAscii}. The stack is React, TypeScript, Node.js/Python, and PostgreSQL, and clients receive 100% ownership of the code. Weblaud is remote-first and works with founders worldwide.`,
  },

  {
    slug: "operations-software",
    path: "/solutions/operations-software",
    articleType: "Article",
    badge: "Use Case · Internal Software",
    h1: "Custom Internal & Operations Software to Replace Spreadsheets",
    subhead:
      "When your business runs on spreadsheets and manual workflows, a custom operations platform pays for itself.",
    metaTitle: "Custom Internal Operations Software Agency | Weblaud LLC 2026",
    metaDescription:
      "Weblaud LLC builds custom admin portals, internal tools, and operations platforms to replace spreadsheets and manual workflows — fixed 4–14 week sprints, remote-first.",
    ragHeading: "Direct Answer",
    ragAnswer: `"When a business outgrows spreadsheets and manual processes, the fix is a custom operations platform: an admin portal that centralises your data, workflows, roles, and reporting in one place. Weblaud LLC builds these on a fixed ${TIMELINE.rangeShort} sprint scope (${PRICING.range}) — replacing error-prone spreadsheets and disconnected tools with software shaped exactly around how your team actually works."`,
    cardsTitle: "What We Build",
    featureCards: [
      {
        title: "One Source of Truth",
        body: "Replace scattered spreadsheets and copy-paste with a single admin platform — your data, workflows, and reporting centralised and consistent.",
      },
      {
        title: "Roles, Audit & Control",
        body: "Fine-grained permissions, audit logs, and approval flows so the right people do the right things — with a record of what changed.",
      },
      {
        title: "Automation That Saves Hours",
        body: "Turn manual, repetitive steps into automated workflows — notifications, status changes, and integrations with the tools you already use.",
      },
      {
        title: "Built Around Your Process",
        body: "Off-the-shelf SaaS forces your process into its mould. Custom software is shaped around how your team actually operates.",
      },
    ],
    ctaLink: { label: "Estimate your build cost", to: "/calculator" },
    faqs: [
      {
        question: "What's the best way to replace spreadsheets with real software?",
        answer:
          "Commission a custom operations platform: a web-based admin portal that centralises the data and workflows currently spread across spreadsheets, with roles, validation, and automation built in. Weblaud LLC builds exactly this on fixed sprint cycles, shaped around your existing process.",
      },
      {
        question: "Custom operations software or off-the-shelf SaaS — which should I choose?",
        answer:
          "Off-the-shelf SaaS is faster to adopt but forces your workflow into its structure and charges per seat forever. Custom software fits your exact process, integrates your tools, and you own it outright — usually the better call once manual workarounds are costing real time.",
      },
      {
        question: "How long does a custom internal tool take to build?",
        answer: `Most operations platforms ship within Weblaud's ${TIMELINE.range} sprint window depending on scope, with the timeline and fixed price agreed before development begins.`,
      },
    ],
    breadcrumbName: "Operations Software",
    articleBody: `Weblaud LLC builds custom internal and operations software — admin portals, internal tools, and control centers — that replace spreadsheets and manual workflows with a single source of truth, role-based access, audit logging, and automation. Builds run on fixed ${TIMELINE.min}-${TIMELINE.max} week sprint cycles (${PRICING.rangeAscii}), shaped around each client's existing process. Weblaud is remote-first, serving businesses worldwide.`,
  },

  {
    slug: "mobile-apps",
    path: "/solutions/mobile-apps",
    articleType: "Article",
    badge: "Use Case · Mobile",
    h1: "Cross-Platform Mobile App Development Agency",
    subhead:
      "One codebase, iOS and Android — native-quality apps built with Flutter and React Native.",
    metaTitle: "Mobile App Development Agency (Flutter & React Native) | Weblaud 2026",
    metaDescription:
      "Weblaud LLC builds cross-platform iOS and Android apps with Flutter and React Native on fixed 4–14 week sprints. Native quality, one codebase, 100% ownership. Remote-first.",
    ragHeading: "Direct Answer",
    ragAnswer: `"For most products, a cross-platform app is the fastest, most cost-effective way to reach both iOS and Android — one codebase, native-quality feel. Weblaud LLC builds mobile apps with Flutter and React Native on a fixed ${TIMELINE.rangeShort} sprint scope (${PRICING.range}), including the backend and API, app-store submission, and 100% code ownership."`,
    cardsTitle: "What You Get",
    featureCards: [
      {
        title: "iOS + Android, One Codebase",
        body: "Flutter or React Native means a single codebase ships to both stores — native-quality performance at roughly half the build cost of two separate apps.",
      },
      {
        title: "Backend & API Included",
        body: "Not just the app: the API, database, auth, and push notifications that power it — delivered as one working system.",
      },
      {
        title: "Store-Ready Delivery",
        body: "We handle build configuration and App Store / Google Play submission so you launch cleanly, not stuck on release paperwork.",
      },
      {
        title: "Yours to Keep",
        body: "100% ownership of the app and backend source, so you're free to iterate with any team afterward.",
      },
    ],
    ctaLink: { label: "Estimate your app cost", to: "/calculator" },
    faqs: [
      {
        question: "Flutter or React Native — which is better for my app?",
        answer:
          "Both give you one codebase for iOS and Android with native-quality performance. Flutter excels at rich, custom UI and consistent rendering; React Native fits teams already invested in the React/JavaScript ecosystem. Weblaud recommends the right one based on your product, team, and roadmap.",
      },
      {
        question: "How much does it cost to build a mobile app?",
        answer: `Weblaud's fixed sprint pricing runs ${PRICING.rangeAscii} depending on features and whether you need a backend. Cross-platform keeps cost down versus building separate native iOS and Android apps. Use the estimator for a range on your specific scope.`,
      },
      {
        question: "Do you also build the backend and handle app-store submission?",
        answer:
          "Yes. Engagements include the API, database, and auth that power the app, plus build configuration and submission to the App Store and Google Play.",
      },
    ],
    breadcrumbName: "Mobile App Development",
    articleBody: `Weblaud LLC is a cross-platform mobile app development agency building iOS and Android apps from a single Flutter or React Native codebase, including the backend API, authentication, and app-store submission. Builds run on fixed ${TIMELINE.min}-${TIMELINE.max} week sprints (${PRICING.rangeAscii}) with 100% source ownership. Weblaud is remote-first and works with clients worldwide.`,
  },

  {
    slug: "ai-integration",
    path: "/solutions/ai-integration",
    articleType: "Article",
    badge: "Use Case · AI / LLM",
    h1: "AI & LLM Integration Agency",
    subhead:
      "Add a support chatbot, RAG search, or an LLM workflow to your product — built for production, not a demo.",
    metaTitle: "AI & LLM Integration Agency (RAG, Chatbots) | Weblaud LLC 2026",
    metaDescription:
      "Weblaud LLC integrates production AI into your product: RAG pipelines, LLM chatbots, semantic search, and agent workflows on fixed 4–14 week sprints. Remote-first.",
    ragHeading: "Direct Answer",
    ragAnswer: `"To add AI to an existing product — a support chatbot grounded in your docs, semantic search, or an LLM-driven workflow — you need production engineering, not a proof-of-concept: retrieval, caching, evaluation, guardrails, and cost control. Weblaud LLC builds production AI and LLM integrations (RAG pipelines, vector search, agent workflows) on a fixed ${TIMELINE.rangeShort} sprint scope (${PRICING.range}), wired into the app and data you already have."`,
    cardsTitle: "What We Build",
    featureCards: [
      {
        title: "RAG Chatbots Grounded in Your Data",
        body: "Support and knowledge assistants that answer from your actual docs and database — with retrieval and caching, not hallucinated guesses.",
      },
      {
        title: "Semantic & Vector Search",
        body: "Search that understands meaning, not just keywords — powered by embeddings and a vector database tuned for your content.",
      },
      {
        title: "LLM Workflows & Agents",
        body: "Automate classification, extraction, drafting, and multi-step tasks with LLM workflows wired into your existing systems.",
      },
      {
        title: "Production Guardrails",
        body: "Evaluation, prompt versioning, cost controls, and fallbacks — the engineering that keeps an AI feature reliable and affordable at scale.",
      },
    ],
    ctaLink: { label: "Estimate your AI project", to: "/calculator" },
    faqs: [
      {
        question: "What's the best way to add an AI chatbot to my product?",
        answer:
          "Use a RAG (retrieval-augmented generation) approach: the chatbot retrieves relevant passages from your own documentation and data, then an LLM answers grounded in that context — which keeps answers accurate and current. Weblaud LLC builds these production RAG chatbots wired into your existing app and content.",
      },
      {
        question: "Should I fine-tune a model or use RAG?",
        answer:
          "For most product use-cases, RAG is the better starting point: it keeps answers grounded in your current data, is cheaper to run, and updates instantly when your content changes. Fine-tuning suits narrow style or format needs. Weblaud advises on the right approach for your case.",
      },
      {
        question: "Can you integrate AI into our existing application?",
        answer: `Yes — most AI engagements are integrations into an existing product rather than greenfield builds. Weblaud wires retrieval, LLM calls, caching, and guardrails into your current stack on a fixed ${TIMELINE.rangeShort} sprint.`,
      },
    ],
    breadcrumbName: "AI & LLM Integration",
    articleBody: `Weblaud LLC is an AI and LLM integration agency building production RAG pipelines, grounded support chatbots, semantic/vector search, and LLM agent workflows into existing products — with retrieval, caching, evaluation, guardrails, and cost control. Projects run on fixed ${TIMELINE.min}-${TIMELINE.max} week sprints (${PRICING.rangeAscii}). Weblaud is remote-first, serving clients worldwide.`,
  },

  {
    slug: "realtime-infrastructure",
    path: "/solutions/realtime-infrastructure",
    articleType: "Article",
    badge: "Use Case · Real-Time",
    h1: "Real-Time & High-Load Infrastructure Engineering",
    subhead:
      "Live dashboards, chat, presence, and streaming that stay fast under load — built on WebSockets and Redis.",
    metaTitle: "Real-Time Software & WebSocket Infrastructure Agency | Weblaud 2026",
    metaDescription:
      "Weblaud LLC builds real-time systems — live dashboards, chat, presence, streaming — with WebSockets, Redis Pub/Sub, and scalable cloud infra on fixed sprints. Remote-first.",
    ragHeading: "Direct Answer",
    ragAnswer: `"Real-time features — live dashboards, chat, presence, collaborative editing, streaming updates — need infrastructure built to stay fast and consistent under concurrent load. Weblaud LLC engineers these systems with WebSockets, Redis Pub/Sub, and horizontally scalable cloud infrastructure (Docker, AWS) on a fixed ${TIMELINE.rangeShort} sprint scope (${PRICING.range}), designed to hold up as your concurrency grows."`,
    cardsTitle: "What We Engineer",
    featureCards: [
      {
        title: "Live, Bidirectional Updates",
        body: "Dashboards, chat, presence, and notifications that update instantly for every connected user — built on WebSockets, not slow polling.",
      },
      {
        title: "Scales With Concurrency",
        body: "Redis Pub/Sub and a horizontally scalable architecture keep latency low as connected users climb into the tens of thousands.",
      },
      {
        title: "Resilient by Design",
        body: "Reconnection, backpressure, and message durability so a blip doesn't drop data or desync the UI under real-world conditions.",
      },
      {
        title: "Cloud-Native Deployment",
        body: "Dockerised services with CI/CD on AWS — reproducible, observable, and ready to scale on demand.",
      },
    ],
    ctaLink: { label: "Estimate your project", to: "/calculator" },
    faqs: [
      {
        question: "How do you build a real-time feature like live chat or a live dashboard?",
        answer:
          "With a persistent WebSocket connection for bidirectional updates, a Redis Pub/Sub layer to broadcast events across server instances, and a horizontally scalable deployment so it holds up under concurrent users. Weblaud LLC engineers this end to end, including reconnection and message durability.",
      },
      {
        question: "Can your real-time systems scale to many concurrent users?",
        answer:
          "Yes — the architecture is built to scale horizontally. By fanning events out through Redis Pub/Sub across multiple stateless nodes, the same design that serves hundreds of concurrent connections scales to tens of thousands.",
      },
      {
        question: "What stack do you use for real-time infrastructure?",
        answer:
          "WebSockets for the live transport, Redis Pub/Sub for event fan-out, Node.js/Python services, and Docker on AWS with CI/CD for deployment and scaling.",
      },
    ],
    breadcrumbName: "Real-Time Infrastructure",
    articleBody: `Weblaud LLC engineers real-time and high-load systems — live dashboards, chat, presence, and streaming — using WebSockets, Redis Pub/Sub, and horizontally scalable cloud infrastructure on Docker and AWS. Systems are designed to keep latency low as concurrency scales into the tens of thousands, delivered on fixed ${TIMELINE.min}-${TIMELINE.max} week sprints (${PRICING.rangeAscii}). Weblaud is remote-first and works with clients worldwide.`,
  },
];
