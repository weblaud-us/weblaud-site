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
    title: "AI Mobile App Design & Development",
    description:
      "We design and develop intelligent mobile applications powered by AI and machine learning. From concept to deployment, we build apps that learn, adapt, and deliver personalized experiences across iOS and Android platforms.",
    features: [
      "AI-powered recommendation engines",
      "On-device machine learning (Core ML / TensorFlow Lite)",
      "Natural language processing features",
      "Predictive UX and smart personalization",
      "Cross-platform (React Native / Flutter)",
    ],
    image: aiAppImg,
    imageAlt: "AI Mobile App Development",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description:
      "We build high-performance native and cross-platform mobile applications that users love. From MVP to enterprise-grade apps, we deliver polished, scalable mobile solutions for iOS and Android with seamless user experiences.",
    features: [
      "iOS and Android native development",
      "React Native & Flutter cross-platform",
      "Offline-first architecture",
      "Push notifications & real-time updates",
      "App Store & Play Store deployment",
    ],
    image: mobileAppImg,
    imageAlt: "Mobile App Development",
  },
  {
    id: 3,
    title: "Algorithmic Trading",
    description:
      "We build advanced algorithmic trading systems powered by machine learning for automated market analysis and execution. From strategy development to live deployment, we create robust, high-performance trading solutions.",
    features: [
      "Trading strategy development",
      "Market analysis algorithms",
      "Performance optimization",
      "High-frequency trading systems",
      "Risk management systems",
    ],
    image: algorithmTradingImg,
    imageAlt: "Algorithmic Trading",
  },
  {
    id: 4,
    title: "Retail & E-commerce",
    description:
      "We build and optimize e-commerce platforms that drive revenue. From custom storefronts to AI-powered personalization and inventory management, we help retail businesses scale online with data-driven digital solutions.",
    features: [
      "Custom e-commerce platform development",
      "AI-powered product recommendations",
      "Inventory & order management systems",
      "Conversion rate optimization (CRO)",
      "Payment gateway integrations",
    ],
    image: retailEcommerceImg,
    imageAlt: "Retail & E-commerce",
  },
  {
    id: 5,
    title: "Custom Website Design & Development",
    description:
      "We design and build stunning, high-performance websites that reflect your brand and convert visitors into customers. Every site is custom-built, mobile-responsive, SEO-optimized, and crafted for measurable results.",
    features: [
      "Custom UI/UX design & interactive prototyping",
      "Responsive & mobile-first development",
      "SEO-optimized architecture & Core Web Vitals",
      "CMS integration (Sanity, Contentful, WordPress)",
      "Performance audits & ongoing optimization",
    ],
    image: customDesignImg,
    imageAlt: "Custom Website Design & Development",
  },
  {
    id: 6,
    title: "DevOps, Cloud & Infrastructure",
    description:
      "We modernize your engineering infrastructure with cloud-native architecture, automated CI/CD pipelines, and DevOps best practices — so your team ships faster with confidence and zero-downtime deployments.",
    features: [
      "Cloud-native architecture (AWS, GCP, Azure)",
      "CI/CD pipeline setup & automation",
      "Docker & Kubernetes orchestration",
      "Infrastructure as Code (Terraform)",
      "Monitoring, alerting & disaster recovery",
    ],
    image: webAppImg,
    imageAlt: "DevOps, Cloud & Infrastructure",
  },
];
