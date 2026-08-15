import { useState } from "react";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { FiArrowRight } from "react-icons/fi";
import { PhoneCall } from "lucide-react";

const Discuss = () => {
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        ref={containerRef}
        className={`relative bg-black text-white pt-12 mt-10 sm:pt-16 pb-12 sm:pb-16 px-4 overflow-hidden ${getBlurAnimationClasses(isVisible)}`}
      >
        {/* Seamless ambient gradient glow fading softly into black on top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.08] to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
          {/* Eyebrow badge */}
          <SectionBadge
            icon={<PhoneCall className="w-3.5 h-3.5" />}
            text="Free Discovery Call"
            badgeLabel="15-min session"
            color="#0a84ff"
            className="mb-6"
          />

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white leading-tight max-w-4xl mb-5 tracking-tight">
            Tell us what <span className="text-primary">you're building.</span>
          </h2>

          {/* Sub-copy */}
          <p className="text-sm sm:text-base md:text-lg font-barlow text-gray-300 max-w-2xl leading-relaxed mb-8">
            We'll come back within a day with a clear plan — no jargon, no lock-in, no pitch deck.
          </p>

          {/* CTA button with pulse ring */}
          <div className="relative">
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-full bg-primary opacity-30 pointer-events-none"
              style={{ animation: "cta-pulse 2.4s ease-out infinite" }}
            />
            <button
              id="discuss-book-call-cta"
              onClick={() => setIsModalOpen(true)}
              className="group relative z-10 inline-flex items-center gap-2 sm:gap-3 bg-primary hover:bg-primary/90 text-white font-barlow font-semibold text-xs sm:text-base px-5 py-2.5 sm:px-8 sm:py-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] cursor-pointer"
            >
              <span>Book a free call</span>
              <span className="flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Micro-copy trust signal */}
          <p className="mt-5 font-barlow text-xs text-gray-400 tracking-wide">
            15-min session &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Response within 24 h
          </p>
        </div>
      </section>

      {/* Keyframe styles */}
      <style>{`
        @keyframes cta-pulse {
          0%   { transform: scale(1);   opacity: 0.3; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Discuss;
