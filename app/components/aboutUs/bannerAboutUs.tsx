import HeroBanner from "../ui/hero-banner";
import techCube from "~/assets/about-us.png";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { useState } from "react";
import { FiCpu } from "react-icons/fi";

const BannerAboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <HeroBanner
        badge={{
          icon: <FiCpu className="w-3.5 h-3.5" />,
          text: "Innovation & Excellence",
          badgeLabel: "About Weblaud",
        }}
        title={
          <>
            We're Engineers Who Build With{" "}
            <span className="text-primary">Purpose.</span>
          </>
        }
        description="Combining deep engineering expertise with a human-centered approach to deliver AI-powered, cloud, and custom software solutions that drive real business transformation."
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
