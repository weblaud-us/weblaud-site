import HeroBanner from "../ui/hero-banner";
import ourServicesImg from "~/assets/our-services.png";

const BannerOurServices = () => {
  return (
    <HeroBanner
      badge={{
        text: "Our Services",
        showPulse: true,
      }}
      title={
        <>
          Our Comprehensive{" "}
          <span className="text-primary">Digital Solutions</span>
        </>
      }
      description="At Weblaud LLC, we are a software development company dedicated to building the future of digital innovation. Our skilled team combines deep engineering expertise with a passion for excellence — delivering exceptional results in web design, mobile development, AI integrations, and custom software solutions."
      image={{
        src: ourServicesImg,
        alt: "Our Digital Solutions",
        showOnMobile: false,
      }}
      showPatterns={true}
      contentAlignment="left"
    />
  );
};

export default BannerOurServices;
