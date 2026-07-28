import HeroBanner from "../ui/hero-banner";
import techCube from "~/assets/about-us.png";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
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
        title="We're Engineers Who Build With Purpose"
        description="Combining deep engineering expertise with a human-centered approach to deliver AI-powered, blockchain, and custom software solutions that drive real business transformation"
        button={{
          text: "Book a Call",
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
