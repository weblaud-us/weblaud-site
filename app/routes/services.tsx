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
      name: "keywords",
      content:
        "software services, software agency, Weblaud LLC, operations platforms, web applications, mobile development, AI integration, real-time infrastructure, dedicated engineering",
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
