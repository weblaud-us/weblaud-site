import type { Route } from "./+types/home";
import BannerHome from "~/components/home/bannerHome";
import OurSpeciality from "~/components/home/ourSpeciality";
import WhyChooseUs from "~/components/home/whyChooseUs";
import OurSay from "~/components/home/ourSay";
import FAQ from "~/components/home/faq";
import LetsDiscuss from "~/components/home/letsDiscuss";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weblaud - Digital Solutions & Web Development Services" },
    {
      name: "description",
      content:
        "Transform your ideas into reality with Weblaud. Expert digital solutions, web development, UI/UX design, and custom software for your business.",
    },
    {
      name: "keywords",
      content:
        "WebLaud, digital solutions, web development, UI/UX design, custom software, React development, Next.js, software agency, app development, mobile app development,",
    },
    {
      name: "og:title",
      content: "Weblaud - Digital Solutions & Web Development Services",
    },
    {
      name: "og:description",
      content:
        "Transform your ideas into reality with Weblaud. Expert digital solutions, web development, UI/UX design, and custom software for your business.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Weblaud - Digital Solutions & Web Development Services",
    },
    {
      name: "twitter:description",
      content:
        "Transform your ideas into reality with Weblaud. Expert digital solutions, web development, UI/UX design, and custom software.",
    },
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
