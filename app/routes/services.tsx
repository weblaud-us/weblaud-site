import type { Route } from "./+types/services";
import BannerOurServices from "~/components/services/bannerOurServices";
import OurServices from "~/components/services/ourServices";
import Discuss from "~/components/aboutUs/discuss";

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
        mainEntity: [
          {
            "@type": "Question",
            name: "What services does Weblaud LLC provide?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Weblaud LLC provides end-to-end software development including custom operations platforms, B2B SaaS web applications, cross-platform mobile apps (React Native & Flutter), production AI/LLM integrations, real-time WebSocket infrastructure, and cloud DevOps management.",
            },
          },
          {
            "@type": "Question",
            name: "What technologies and frameworks does Weblaud LLC use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We specialize in React, React Router v7, TypeScript, Node.js, Python, FastAPI, NestJS, Flutter, React Native, PostgreSQL, Redis, Docker, and AWS cloud infrastructure.",
            },
          },
          {
            "@type": "Question",
            name: "Does Weblaud LLC build custom AI and LLM solutions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Weblaud LLC builds production RAG (Retrieval-Augmented Generation) systems, vector database caching, semantic search, and custom LLM agent pipelines using Python, FastAPI, and OpenAI/Anthropic APIs.",
            },
          },
          {
            "@type": "Question",
            name: "Does Weblaud LLC provide software maintenance and SLA support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we provide 99.9% uptime SLA monitoring, continuous cloud DevOps management, database backups, security patch updates, and feature expansion as your active user base grows.",
            },
          },
        ],
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

const Services = () => {
  return (
    <>
      <BannerOurServices />
      <OurServices />
      <Discuss />
    </>
  );
};

export default Services;
