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
        "Explore Weblaud LLC's comprehensive software services: operations platforms, mobile & backend development, AI integrations, dedicated engineering teams, real-time infrastructure, and cloud DevOps.",
    },
    {
      name: "keywords",
      content:
        "software services, software agency, Weblaud LLC, operations platforms, mobile development, AI integration, dedicated engineering, real-time infrastructure, DevOps",
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
        "From strategy to scaling, we provide end-to-end digital solutions for your business needs.",
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
