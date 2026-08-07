import type { Route } from "./+types/aboutus";
import BannerAboutUs from "~/components/aboutUs/bannerAboutUs";
import Discuss from "~/components/aboutUs/discuss";
import OurMissionAndStory from "~/components/aboutUs/ourMissionAndStory";
import OurTrack from "~/components/aboutUs/ourTrack";
import TheTeam from "~/components/aboutUs/theTeam";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Weblaud LLC is a software engineering company. We build internal products and deliver core software systems to solve complex problems through code.",
    },
    {
      property: "og:title",
      content: "About Weblaud - Our Mission, Story & Team",
    },
    {
      property: "og:description",
      content:
        "Learn about Weblaud's mission, vision, and talented team. Discover our journey in transforming digital ideas into reality.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/aboutus" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:alt", content: "About Weblaud - Our Team" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "About Weblaud - Our Mission, Story & Team",
    },
    {
      name: "twitter:description",
      content:
        "Learn about Weblaud's mission, vision, and talented team dedicated to digital transformation.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Weblaud LLC",
        description:
          "Weblaud LLC is a software engineering company building operations platforms, AI tools, and mobile apps for global businesses.",
        url: "https://weblaud.com/aboutus",
        mainEntity: {
          "@type": "Organization",
          name: "Weblaud LLC",
          legalName: "Weblaud LLC",
          url: "https://weblaud.com",
          logo: "https://weblaud.com/favicon.png",
          employee: [
            {
              "@type": "Person",
              name: "Sakib Al Jaber",
              jobTitle: "Lead Software Engineer",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
            {
              "@type": "Person",
              name: "Manirul Islam",
              jobTitle: "Business Development",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
            {
              "@type": "Person",
              name: "Kazi Arif Ishtique",
              jobTitle: "Senior Software Engineer",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
            {
              "@type": "Person",
              name: "Shoaib Al Jayed",
              jobTitle: "Software Engineer",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
            {
              "@type": "Person",
              name: "Ruhul Amin",
              jobTitle: "Full Stack Engineer",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
            {
              "@type": "Person",
              name: "Jubayed Islam",
              jobTitle: "Software Engineer",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
            {
              "@type": "Person",
              name: "Shuvo Chandra",
              jobTitle: "Software Engineer",
              worksFor: { "@type": "Organization", name: "Weblaud LLC" },
            },
          ],
        },
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
            name: "About Us",
            item: "https://weblaud.com/aboutus",
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/aboutus" },
  ];
}

const AboutUs = () => {
  return (
    <div>
      <BannerAboutUs />
      <OurMissionAndStory />
      <OurTrack />
      <TheTeam />
      <Discuss />
    </div>
  );
};

export default AboutUs;

//