import type { Route } from "./+types/services";
import BannerOurServices from "~/components/services/bannerOurServices";
import OurServices from "~/components/services/ourServices";
import Discuss from "~/components/aboutUs/discuss";
import FAQ, { type FaqItem } from "~/components/home/faq";
import SolutionLinks from "~/components/services/solutionLinks";
import { fetchOptional, resolveMediaUrl } from "~/lib/api.server";
import { optimizeMediaUrl } from "~/lib/media";
import type { AdminService } from "~/lib/types";

/**
 * Rendered on the page *and* emitted as FAQPage JSON-LD. Google requires
 * marked-up questions to be visible; the schema used to describe an FAQ this
 * page never showed.
 */
const SERVICES_FAQS: FaqItem[] = [
  {
    _id: "services-faq-1",
    question: "What services does Weblaud LLC provide?",
    answer:
      "Weblaud LLC provides end-to-end software development including custom operations platforms, B2B SaaS web applications, cross-platform mobile apps (React Native & Flutter), production AI/LLM integrations, real-time WebSocket infrastructure, and cloud DevOps management.",
  },
  {
    _id: "services-faq-2",
    question: "What technologies and frameworks does Weblaud LLC use?",
    answer:
      "We specialize in React, React Router v7, TypeScript, Node.js, Python, FastAPI, NestJS, Flutter, React Native, PostgreSQL, Redis, Docker, and AWS cloud infrastructure.",
  },
  {
    _id: "services-faq-3",
    question: "Does Weblaud LLC build custom AI and LLM solutions?",
    answer:
      "Yes, Weblaud LLC builds production RAG (Retrieval-Augmented Generation) systems, vector database caching, semantic search, and custom LLM agent pipelines using Python, FastAPI, and OpenAI/Anthropic APIs.",
  },
  {
    _id: "services-faq-4",
    question: "Does Weblaud LLC provide software maintenance and SLA support?",
    answer:
      "Yes, we provide 99.9% uptime SLA monitoring, continuous cloud DevOps management, database backups, security patch updates, and feature expansion as your active user base grows.",
  },
];

export async function loader() {
  const services = await fetchOptional<AdminService[]>("/services", []);
  return {
    // Service icons render at 160 px.
    services: services.map((s) => ({ ...s, image: optimizeMediaUrl(resolveMediaUrl(s.image), 320) })),
  };
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Expert Services – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Explore Weblaud LLC's comprehensive software services: operations platforms, web application development, mobile & backend development, AI integrations, cloud & real-time infrastructure, and dedicated engineering teams.",
    },
    {
      property: "og:title",
      content: "Our Services - Strategy, Design, Development & More | Weblaud",
    },
    {
      property: "og:description",
      content:
        "Comprehensive digital services including web development, mobile apps, UI/UX design, AI solutions, and custom software.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/services" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:alt", content: "Weblaud Services" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Our Services - Weblaud Digital Solutions",
    },
    {
      name: "twitter:description",
      content:
        "We provide system architecture, application development, and infrastructure scaling for your business.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Weblaud LLC Software Engineering Services",
        itemListElement: [
          {
            "@type": "Service",
            name: "Operations Platforms Development",
            provider: { "@type": "Organization", name: "Weblaud LLC" },
            description:
              "Custom admin systems, internal dashboards, and operational workflow platforms built for companies outgrowing manual processes.",
            serviceType: "Software Engineering",
          },
          {
            "@type": "Service",
            name: "Web Application Development",
            provider: { "@type": "Organization", name: "Weblaud LLC" },
            description:
              "High-performance, scalable web applications built with modern frontend frameworks, cloud infrastructure, and robust APIs.",
            serviceType: "Web Engineering",
          },
          {
            "@type": "Service",
            name: "Mobile App & Backend Engineering",
            provider: { "@type": "Organization", name: "Weblaud LLC" },
            description:
              "Native and cross-platform mobile app development with high-concurrency backend services.",
            serviceType: "Mobile Development",
          },
          {
            "@type": "Service",
            name: "AI & Machine Learning Integration",
            provider: { "@type": "Organization", name: "Weblaud LLC" },
            description:
              "Custom machine learning platforms, RAG pipelines, predictive analytics, and automated decision-making engines.",
            serviceType: "Artificial Intelligence",
          },
          {
            "@type": "Service",
            name: "Dedicated Engineering Teams",
            provider: { "@type": "Organization", name: "Weblaud LLC" },
            description:
              "Full-stack senior engineering teams integrated directly into client product workflows for rapid scaling.",
            serviceType: "Engineering Staff Augmentation",
          },
        ],
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: SERVICES_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://weblaud.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://weblaud.com/services",
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/services" },
  ];
}

const Services = ({ loaderData }: Route.ComponentProps) => {
  return (
    <>
      <BannerOurServices />
      <OurServices services={loaderData.services} />
      <SolutionLinks />
      <FAQ faqs={SERVICES_FAQS} />
      <Discuss />
    </>
  );
};

export default Services;
