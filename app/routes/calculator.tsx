import type { Route } from "./+types/calculator";
import ProjectCalculator from "~/components/calculator/projectCalculator";
import Discuss from "~/components/aboutUs/discuss";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project Cost & Sprint Timeline Calculator | Weblaud LLC" },
    {
      name: "description",
      content:
        "Estimate your software engineering project scope, sprint timeline, and investment range with Weblaud LLC's interactive cost calculator.",
    },
    {
      property: "og:title",
      content: "Interactive Project Sprint & Cost Calculator | Weblaud LLC",
    },
    {
      property: "og:description",
      content:
        "Instantly calculate estimated delivery timelines and investment ranges for operations platforms, SaaS web apps, and AI integrations.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/calculator" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Software Project Sprint & Cost Calculator",
    },
    {
      name: "twitter:description",
      content: "Interactive estimation tool for custom software development projects.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Weblaud Software Project Sprint & Cost Calculator",
        url: "https://weblaud.com/calculator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        provider: {
          "@type": "Organization",
          name: "Weblaud LLC",
          url: "https://weblaud.com",
        },
      },
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/calculator" },
  ];
}

export default function CalculatorRoute() {
  return (
    <div className="bg-black text-white pt-24 md:pt-32 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectCalculator />
      </div>
      <Discuss />
    </div>
  );
}
