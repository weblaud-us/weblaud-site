import type { Route } from "./+types/aboutUs";
import BannerAboutUs from "~/components/aboutUs/bannerAboutUs";
import Discuss from "~/components/aboutUs/discuss";
import OurAchievement from "~/components/aboutUs/ourAchievement";
import OurMissionAndStory from "~/components/aboutUs/ourMissionAndStory";
import OurTrack from "~/components/aboutUs/ourTrack";
import TheTeam from "~/components/aboutUs/theTeam";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Weblaud - Our Mission, Story & Team" },
    {
      name: "description",
      content:
        "Learn about Weblaud's mission, vision, and talented team. Discover our journey in transforming digital ideas into reality with innovative solutions.",
    },
    {
      name: "keywords",
      content:
        "about us, company mission, digital agency, web development team, innovation",
    },
    { name: "og:title", content: "About Weblaud - Our Mission, Story & Team" },
    {
      name: "og:description",
      content:
        "Learn about Weblaud's mission, vision, and talented team. Discover our journey in transforming digital ideas into reality.",
    },
    { name: "og:type", content: "website" },
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
