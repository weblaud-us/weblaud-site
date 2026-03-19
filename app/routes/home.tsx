import type { Route } from "./+types/home";
import BannerHome from "~/components/home/bannerHome";
import OurSpeciality from "~/components/home/ourSpeciality";
import WhyChooseUs from "~/components/home/whyChooseUs";
import OurSay from "~/components/home/ourSay";
import FAQ from "~/components/home/faq";
import LetsDiscuss from "~/components/home/letsDiscuss";
import heroBanner from "~/assets/hero-icon.png";

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
        "Weblaud LLC is a software development company and innovation studio. We build high-performance digital products and provide expert software engineering for businesses worldwide.",
    },
    {
      name: "keywords",
      content:
        "Weblaud LLC, software company, product development, digital product studio, software engineering, SaaS development, UI/UX design, custom software, innovation lab",
    },
    {
      property: "og:title",
      content: "Weblaud LLC - Software Agency & Digital Solutions",
    },
    {
      property: "og:description",
      content:
        "Transform your ideas into reality with Weblaud LLC. A premium software agency providing expert digital solutions and custom software.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Weblaud LLC - Software Agency & Digital Solutions",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Weblaud LLC - Software Agency & Digital Solutions",
    },
    {
      name: "twitter:description",
      content:
        "Transform your ideas into reality with Weblaud LLC. A premium software agency providing expert digital solutions and custom software.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What services does your company offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We provide comprehensive digital solutions including custom web development, mobile app development, UI/UX design, cloud infrastructure setup, API development, and ongoing maintenance and support. Our team specializes in modern technologies like React, Next.js, Node.js, and cloud platforms to deliver scalable, high-performance applications tailored to your business needs.",
            },
          },
          {
            "@type": "Question",
            name: "How long does a typical project take to complete?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Project timelines vary based on complexity and scope. A simple website typically takes 4-6 weeks, while a full-featured web application may require 3-6 months. We provide detailed timelines during the discovery phase and keep you updated throughout development with regular milestone reviews and demos.",
            },
          },
          {
            "@type": "Question",
            name: "Do you offer post-launch support and maintenance?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we provide comprehensive post-launch support including bug fixes, security updates, performance monitoring, and feature enhancements. We offer flexible maintenance packages tailored to your needs, from basic monitoring to full ongoing development partnerships with dedicated support teams.",
            },
          },
          {
            "@type": "Question",
            name: "What is your development process like?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We follow an agile development methodology with clear phases: discovery and planning, design and prototyping, development with regular sprints, quality assurance testing, and deployment. You'll have full visibility throughout with regular check-ins, demos, and the ability to provide feedback at every stage.",
            },
          },
          {
            "@type": "Question",
            name: "Can you work with our existing tech stack or integrate with our systems?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely! We're experienced in working with diverse tech stacks and can seamlessly integrate with your existing systems, APIs, databases, and third-party services. Whether you need to modernize legacy systems, add new features, or build complementary tools, we'll work within your technical ecosystem.",
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
      <OurSpeciality />
      <WhyChooseUs />
      <OurSay />
      <FAQ />
      <LetsDiscuss />
    </>
  );
}
