import React from "react";
import FAQ from "../components/faq";

export const Welcome = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-white mb-6">Hello World</h1>
      </div>
      <FAQ />
    </div>
  );
};
