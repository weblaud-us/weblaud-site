import contactImage from "~/assets/contact-us.png";
import HeroBanner from "../ui/hero-banner";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { useState } from "react";
import { FiMail } from "react-icons/fi";

const BannerContactUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetInTouch = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <HeroBanner
        badge={{
          icon: <FiMail className="w-3.5 h-3.5" />,
          text: "Get in Touch",
          badgeLabel: "Direct Access",
        }}
        title="Contact Us"
        description="Have a product vision, complex engineering challenge, or looking to scale your infrastructure? Partner directly with our senior software architects and technical leaders to turn your requirements into high-performance software."
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
