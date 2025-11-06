import React from "react";
import FAQ from "../components/faq";
import OurSay from "~/components/ourSay";
import WhyChooseUs from "~/components/whyChooseUs";
import BannerHome from "~/components/bannerHome";
import LetsDiscuss from "~/components/letsDiscuss";

export const Welcome = () => {
  return (
    <div>
      <BannerHome />
      <WhyChooseUs />
      <OurSay />
      <FAQ />
      <LetsDiscuss />
    </div>
  );
};
