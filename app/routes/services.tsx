import type { Route } from "./+types/services";
import BannerOurServices from "~/components/services/bannerOurServices";
import OurServices from "~/components/services/ourServices";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Our Services - Strategy, Design, Development & More | Weblaud" },
    {
      name: "description",
      content:
        "Explore Weblaud's comprehensive services: strategy, design, custom development, maintenance, and scaling solutions for your digital transformation.",
    },
    {
      name: "keywords",
      content:
        "web development services, UI/UX design, custom software, strategy, digital services, app development, maintenance",
    },
    {
      name: "og:title",
      content: "Our Services - Strategy, Design, Development & More | Weblaud",
    },
    {
      name: "og:description",
      content:
        "Comprehensive digital services including strategy, design, development, maintenance, and scaling solutions.",
    },
    { name: "og:type", content: "website" },
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
  ];
}

const Services = () => {
  return (
    <>
      <BannerOurServices />
      <OurServices />
    </>
  );
};

export default Services;
