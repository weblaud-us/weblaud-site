import type { Route } from "./+types/home";
import BannerHome from "~/components/home/bannerHome";
import OurSpeciality from "~/components/home/ourSpeciality";
import WhyChooseUs from "~/components/home/whyChooseUs";
import OurSay from "~/components/home/ourSay";
import FAQ from "~/components/home/faq";
import LetsDiscuss from "~/components/home/letsDiscuss";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
