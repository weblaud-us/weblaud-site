import React from "react";
import FAQ from "../components/faq";
import OurSay from "~/components/ourSay";
import WhyChooseUs from "~/components/whyChooseUs";

export const Welcome = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-white mb-6">Hello World</h1>
      </div>
      <WhyChooseUs />
      <OurSay />
      <FAQ />
    </div>
  );
};
