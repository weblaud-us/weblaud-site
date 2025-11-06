import HeroBanner from "./ui/hero-banner";
import techCube from "~/assets/about-us.png";

const BannerAboutUs = () => {
  return (
    <HeroBanner
      badge={{
        text: "Innovation & Excellence",
        showPulse: true,
      }}
      title="We're Engineers of Intelligent Change"
      description="Pioneering the intersection of AI, blockchain, and quantitative finance to deliver innovative solutions that drive business transformation"
      button={{
        text: "Get In Touch",
        onClick: () => {
          console.log("Get In Touch clicked");
        },
      }}
      image={{
        src: techCube,
        alt: "Our Team - Engineers of Change",
        showOnMobile: false,
      }}
      showPatterns={true}
      contentAlignment="left"
    />
  );
};

export default BannerAboutUs;
