import HeroBanner from "../ui/hero-banner";
import ourServicesImg from "~/assets/our-services.png";
import { FiCode } from "react-icons/fi";

const BannerOurServices = () => {
  return (
    <HeroBanner
      badge={{
        icon: <FiCode className="w-3.5 h-3.5" />,
        text: "Engineering",
        badgeLabel: "Capabilities",
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
