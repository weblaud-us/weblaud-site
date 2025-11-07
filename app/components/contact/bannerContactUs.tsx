import contactImage from "~/assets/contact-us.png";
import HeroBanner from "../ui/hero-banner";

const BannerContactUs = () => {
  const handleGetInTouch = () => {
    console.log("Get in touch clicked");
  };

  return (
    <HeroBanner
      badge={{
        text: "Contact Us",
        showPulse: true,
      }}
      title="Contact Us"
      description="Get in touch with our team to discuss how we can help transform your business. We're here to help. Whether you have questions about our AI solutions, blockchain integrations, data analytics platforms, or need consultation on your next project, our expert team is ready to provide tailored solutions that drive innovation and growth. Let's collaborate to turn your vision into reality and unlock new possibilities for your business success."
      button={{
        text: "Get In Touch Now",
        onClick: handleGetInTouch,
      }}
      image={{
        src: contactImage,
        alt: "Contact Us",
        showOnMobile: false,
      }}
      showPatterns={true}
      contentAlignment="left"
    />
  );
};

export default BannerContactUs;
