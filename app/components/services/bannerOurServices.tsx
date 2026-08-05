import HeroBanner from "../ui/hero-banner";
import ourServicesImg from "~/assets/our-services.png";

const BannerOurServices = () => {
  return (
    <HeroBanner
      badge={{
        text: "Engineering Capabilities",
        showPulse: true,
      }}
      title={
        <>
          Full-Cycle Engineering &{" "}
          <span className="text-primary">Scalable Software Systems</span>
        </>
      }
      description="We build enterprise back-offices, high-concurrency web applications, and production AI platforms. Engineered by senior developers for speed, security, and long-term maintainability."
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
