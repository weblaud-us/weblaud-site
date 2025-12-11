import HeroBanner from "../ui/hero-banner";
import techCube from "~/assets/about-us.png";
import { BookingModal } from "~/components/ui/booking-modal";
import { useState } from "react";

const BannerAboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
            setIsModalOpen(true);
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
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BannerAboutUs;
