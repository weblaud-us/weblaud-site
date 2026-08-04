import aiAppImg from "~/assets/ai-app.png";
import mobileAppImg from "~/assets/mobile-app.png";
import algorithmTradingImg from "~/assets/algorithm-trading.png";
import retailEcommerceImg from "~/assets/retail-ecommerce.png";
import webAppImg from "~/assets/web-app.png";
import customDesignImg from "~/assets/custom-design.png";

export interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Operations Platform Development",
    description:
      "We build role-based admin panels, billing pipelines, full accounting ledgers, and automated reporting systems. Built for clinics, logistics firms, distributors, and multi-branch service operations.",
    features: [
      "Role-based admin panel with granular permissions",
      "Billing, invoicing, and print-ready document generation",
      "Full accounting: debit/credit, expenses, dues, discounts",
      "Automated commission and profit-distribution logic",
      "Daily / monthly / yearly reporting dashboards",
      "Cloud hosting with automated backups",
    ],
    image: retailEcommerceImg,
    imageAlt: "Operations Platform Development",
  },
  {
    id: 2,
    title: "Web Application Development",
    description:
      "Custom web applications and SaaS platforms. We use React and Next.js on the front end, backed by FastAPI or Node.js and PostgreSQL. Server-side rendering, real auth, and a data layer that holds up past the first thousand users.",
    features: [
      "React / Next.js application with SSR and SEO-ready routing",
      "FastAPI or Node.js/NestJS backend with documented APIs",
      "PostgreSQL schema design, indexing, and migrations",
      "Authentication, role-based access, and subscription billing",
      "Staging and production deployment pipeline",
    ],
    image: webAppImg,
    imageAlt: "Web Application Development",
  },
  {
    id: 3,
    title: "Mobile App & Backend Development",
    description:
      "Flutter applications for iOS and Android backed by secure Node.js or NestJS APIs, plus the admin dashboard to run them. Auth, payments, push notifications, and store deployment included.",
    features: [
      "Flutter app for iOS and Android from a single codebase",
      "Node.js / NestJS backend with documented REST APIs",
      "Web admin dashboard",
      "Authentication, roles, payments, push notifications",
      "App Store and Play Store deployment",
    ],
    image: mobileAppImg,
    imageAlt: "Mobile App & Backend Development",
  },
  {
    id: 4,
    title: "AI Integration Sprint",
    description:
      "A fixed-scope engagement that layers AI onto your existing product. Document and report generation, support assistants trained on your own data, invoice and form extraction, and semantic internal search.",
    features: [
      "LLM integration (OpenAI, Claude, or Gemini) into your existing stack",
      "Document generation and data extraction pipelines",
      "RAG-based assistants grounded in your company data",
      "Evaluation harness so output quality is measurable",
      "Handover documentation for your team",
    ],
    image: aiAppImg,
    imageAlt: "AI Integration Sprint",
  },
  {
    id: 5,
    title: "Cloud & Real-Time Infrastructure",
    description:
      "WebRTC systems deployed on your own infrastructure. You get video, voice, and chat capabilities without per-minute vendor pricing, plus the deployment, backup, and monitoring layer underneath. For teams without a dedicated DevOps engineer.",
    features: [
      "LiveKit / WebRTC deployment, TURN/STUN (coturn) setup and hardening",
      "Real-time chat with presence, delivery states, and push",
      "Server provisioning, security hardening, and CI/CD pipelines",
      "Automated backups with restores actually tested",
      "Uptime, error, and performance monitoring with alerts",
      "Load testing, scaling runbook, and infrastructure handover",
    ],
    image: algorithmTradingImg,
    imageAlt: "Cloud & Real-Time Infrastructure",
  },
  {
    id: 6,
    title: "Dedicated Engineering Team",
    description:
      "A dedicated engineer or small pod working as an extension of your in-house team. We adopt your tools, standups, and roadmap while providing the cost structure of an offshore partner.",
    features: [
      "Senior full-stack engineers (Flutter, Node.js, NestJS, cloud)",
      "Dedicated Slack channel and your sprint cadence",
      "Weekly milestone reviews",
      "Minimum 3-month engagement",
    ],
    image: customDesignImg,
    imageAlt: "Dedicated Engineering Team",
  },
];
