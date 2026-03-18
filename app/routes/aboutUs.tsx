import type { Route } from "./+types/aboutUs";
import BannerAboutUs from "~/components/aboutUs/bannerAboutUs";
import Discuss from "~/components/aboutUs/discuss";
import OurAchievement from "~/components/aboutUs/ourAchievement";
import OurMissionAndStory from "~/components/aboutUs/ourMissionAndStory";
import OurTrack from "~/components/aboutUs/ourTrack";
import TheTeam from "~/components/aboutUs/theTeam";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Weblaud LLC is an innovation-driven software company. From building proprietary products to delivering expert engineering services, our mission is to solve complex problems through code.",
    },
    {
      name: "keywords",
      content:
        "about us, Weblaud LLC, software agency, software engineering team, innovation, company mission",
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/aboutus" },
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
  ];
}

const AboutUs = () => {
  return (
    <div>
      <BannerAboutUs />
      <OurAchievement />
      <OurMissionAndStory />
      <OurTrack />
      <TheTeam />
      <Discuss />
    </div>
  );
};

export default AboutUs;
