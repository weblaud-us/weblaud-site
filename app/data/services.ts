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
    title: "Custom Operations Platforms & ERPs",
    description:
      "We build the core back-office software your business runs on — automating billing, inventory, multi-branch reporting, and fine-grained access control.",
    features: [
      "Automated invoicing, payment workflows & PDF docs",
      "Role-Based Access Control (RBAC) & audit logging",
      "Real-time executive reporting & financial dashboards",
    ],
    image: retailEcommerceImg,
    imageAlt: "Custom Operations Platforms & ERPs",
  },
  {
    id: 2,
    title: "Scalable Web App & SaaS Engineering",
    description:
      "High-performance web apps built to scale from day one — blazing fast response times, SEO-optimized frontends, and resilient database architectures.",
    features: [
      "Full-Stack Architecture (React / Next.js + Node / Go)",
      "Secure multi-tenant auth & subscription billing",
      "Production CI/CD pipelines & zero-downtime deploys",
    ],
    image: webAppImg,
    imageAlt: "Scalable Web App & SaaS Engineering",
  },
  {
    id: 3,
    title: "Cross-Platform Mobile & API Systems",
    description:
      "Native-performing iOS & Android apps built from a unified codebase, bundled with robust cloud APIs and administrative backends.",
    features: [
      "Single Flutter codebase for iOS, Android & Web",
      "Offline-first sync, push notifications & payments",
      "Turnkey App Store & Google Play deployment",
    ],
    image: mobileAppImg,
    imageAlt: "Cross-Platform Mobile & API Systems",
  },
  {
    id: 4,
    title: "Production AI & LLM Integration",
    description:
      "Embed production-ready AI models into your software in a 2 to 4 week fixed-scope sprint — measurable output with zero hype.",
    features: [
      "Custom RAG & LLM Workflows (OpenAI, Claude, Gemini)",
      "AI assistants trained securely on your private data",
      "Rigorous evaluation frameworks & full ownership",
    ],
    image: aiAppImg,
    imageAlt: "Production AI & LLM Integration",
  },
  {
    id: 5,
    title: "Real-Time Infrastructure & Streaming",
    description:
      "Self-hosted voice, video, and messaging infrastructure on your own cloud — eliminating expensive per-minute SaaS vendor billing.",
    features: [
      "Custom WebRTC / LiveKit video & real-time chat",
      "Automated DevOps, CI/CD, backups & 99.9% uptime",
      "Load-tested, fully documented & zero vendor lock-in",
    ],
    image: algorithmTradingImg,
    imageAlt: "Real-Time Infrastructure & Streaming",
  },
  {
    id: 6,
    title: "Dedicated Senior Engineering Pods",
    description:
      "Embed senior engineers directly into your sprints. We adapt to your toolchain, culture, and cadence with elite engineering velocity.",
    features: [
      "Full-stack senior engineers (Node, Python, Flutter)",
      "Direct Slack/Teams integration & daily standups",
      "Transparent sprint billing & weekly milestone demos",
    ],
    image: customDesignImg,
    imageAlt: "Dedicated Senior Engineering Pods",
  },
];
