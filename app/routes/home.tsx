import type { Route } from "./+types/home";
import BannerHome from "~/components/home/bannerHome";
import OurSpeciality from "~/components/home/ourSpeciality";
import WhyChooseUs from "~/components/home/whyChooseUs";
import TrustedPartnerships from "~/components/home/trustedPartnerships";
import OurSay from "~/components/home/ourSay";
import FAQ from "~/components/home/faq";
import LetsDiscuss from "~/components/home/letsDiscuss";
import heroBanner from "~/assets/hero-icon.png";
import { TIMELINE, SAVINGS } from "~/lib/constants";

export const links: Route.LinksFunction = () => {
  return [
    {
      rel: "preload",
      as: "image",
      href: heroBanner,
      fetchPriority: "high",
    },
  ];
};

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600", // Cache in browser for 5 mins, CDN for 1 hour
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weblaud LLC – Software Development Company" },
    {
      name: "description",
      content:
        `We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in ${TIMELINE.range}.`,
    },
    {
      property: "og:title",
      content: "Weblaud LLC – Software Development Company",
    },
    {
      property: "og:description",
      content:
        `We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in ${TIMELINE.range}.`,
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Weblaud LLC – Software Development Company",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Weblaud LLC – Software Development Company",
    },
    {
      name: "twitter:description",
      content:
        `We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in ${TIMELINE.range}.`,
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What services does Weblaud LLC offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Weblaud LLC provides end-to-end software engineering including custom operations platforms, B2B SaaS web applications, cross-platform mobile apps (React Native & Flutter), production AI/LLM integrations, real-time WebSocket infrastructure, and cloud DevOps management.",
            },
          },
          {
            "@type": "Question",
            name: "How long does a software project take to ship?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `We operate on focused, fixed-scope agile sprint cycles. Simple builds typically ship in ${TIMELINE.mvp}, while full enterprise systems complete ${TIMELINE.enterprise}. We provide detailed milestone roadmaps during discovery and host bi-weekly sprint reviews.`,
            },
          },
          {
            "@type": "Question",
            name: "What is Weblaud LLC's pricing model?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We operate on transparent, fixed-fee sprint pricing starting at $4,500 for MVP projects up to $18,500 for full enterprise platforms. You receive 100% IP source code ownership with zero unpredictable hourly billing or unexpected invoices.",
            },
          },
          {
            "@type": "Question",
            name: "Why hire Weblaud LLC instead of in-house software engineers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Hiring a senior developer costs over $180,000 annually per engineer once salary, health benefits, and recruiting commissions are factored in—requiring 3 to 6 months just to hire. Weblaud LLC deploys an active senior squad instantly for a fixed sprint fee at ${SAVINGS.shareOfCost}.`,
            },
          },
          {
            "@type": "Question",
            name: "Do you provide post-launch support and cloud maintenance?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we provide continuous SLA support packages including 99.9% uptime monitoring, automated database backups, security patch updates, and feature expansion as your active user base grows.",
            },
          },
          {
            "@type": "Question",
            name: "Can you integrate with our existing APIs, databases, or legacy systems?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We work with modern and legacy tech stacks, connecting directly to your existing PostgreSQL/MySQL databases, third-party APIs, and cloud services without disrupting active operational workflows.",
            },
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/" },
  ];
}

export default function Home() {
  return (
    <>
      <BannerHome />
      <TrustedPartnerships />
      <OurSpeciality />
      <WhyChooseUs />
      <OurSay />
      <FAQ />
      <LetsDiscuss />
    </>
  );
}
