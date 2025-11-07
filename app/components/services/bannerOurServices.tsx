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
      description="At Catalyst Analytics, we offer a comprehensive suite of digital solutions designed to propel your business to new heights in the digital realm. With a team of skilled professionals, cutting-edge technology, and a passion for innovation, we are committed to delivering exceptional results for every project we undertake. From captivating web design that leaves a lasting impression to seamless web development that ensures optimal functionality, we cover every aspect of your online presence."
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
