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
      "End-to-end operational systems — role-based admin panels, billing and invoicing, full accounting ledgers, automated reporting, and print-ready document generation. Built for clinics, logistics firms, distributors, and multi-branch service operations.",
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
    title: "Mobile App & Backend Development",
    description:
      "Flutter applications for iOS and Android backed by production-grade Node.js/NestJS APIs, plus the admin dashboard to run them. Auth, payments, push notifications, and store deployment included.",
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
    id: 3,
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
    id: 4,
    title: "Dedicated Engineering Team",
    description:
      "A dedicated engineer or small pod working as an extension of your in-house team. Your tools, your standups, your roadmap — with the timezone overlap and cost structure of an offshore partner.",
    features: [
      "Senior full-stack engineers (Flutter, Node.js, NestJS, cloud)",
      "Dedicated Slack channel and your sprint cadence",
      "Weekly milestone reviews",
      "Minimum 3-month engagement",
    ],
    image: customDesignImg,
    imageAlt: "Dedicated Engineering Team",
  },
  {
    id: 5,
    title: "Real-Time & Communication Infrastructure",
    description:
      "Production WebRTC systems built and tuned on your own infrastructure — video calls, voice, live chat, and presence — without per-minute vendor pricing. We deploy, harden, and optimize the media servers behind them.",
    features: [
      "LiveKit / WebRTC deployment on your own infrastructure",
      "TURN/STUN (coturn) setup, hardening, and NAT traversal tuning",
      "Real-time chat with presence, delivery states, and push",
      "Load testing and connection-quality optimization",
      "Monitoring and scaling runbook",
    ],
    image: algorithmTradingImg,
    imageAlt: "Real-Time & Communication Infrastructure",
  },
  {
    id: 6,
    title: "Cloud Infrastructure & DevOps",
    description:
      "Production infrastructure for teams without a dedicated DevOps engineer. Server provisioning and hardening, automated CI/CD, scheduled backups, and monitoring — on AWS, GCP, Azure, or cost-optimized VPS.",
    features: [
      "Server provisioning and security hardening",
      "CI/CD pipelines with automated deploys and rollback",
      "Automated backup and restore, with restores actually tested",
      "Uptime, error, and performance monitoring with alerts",
      "Infrastructure documentation and handover",
    ],
    image: webAppImg,
    imageAlt: "Cloud Infrastructure & DevOps",
  },
];
