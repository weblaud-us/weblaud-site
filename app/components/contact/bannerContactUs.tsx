import contactImage from "~/assets/contact-us.png";
import HeroBanner from "../ui/hero-banner";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { useState } from "react";

const BannerContactUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetInTouch = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <HeroBanner
        badge={{
          text: "Contact Us",
          showPulse: true,
        }}
        title="Contact Us"
        description="Have a project in mind? Our team handles initial planning through full-scale development."
        button={{
          text: "Book a Call",
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
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BannerContactUs;
