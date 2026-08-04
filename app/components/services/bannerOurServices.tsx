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
      description="We engineer core business software, custom web applications, and internal tools. Our team focuses on delivering stable platforms that handle your daily operations."
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
