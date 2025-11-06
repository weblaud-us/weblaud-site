import React from "react";
import FAQ from "../components/faq";
import OurSay from "~/components/ourSay";
import WhyChooseUs from "~/components/whyChooseUs";
import BannerHome from "~/components/bannerHome";

export const Welcome = () => {
  return (
    <div>
      <BannerHome />
      <WhyChooseUs />
      <OurSay />
      <FAQ />
    </div>
  );
};
