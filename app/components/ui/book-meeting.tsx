import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { useState } from "react";
import { FiCalendar, FiArrowUpRight } from "react-icons/fi";

const BookMeeting = () => {
  const [consultationRef, isConsultationVisible] = useBlurAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookMeeting = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        ref={consultationRef}
        className={`group relative bg-gradient-to-br from-[#0c1424] via-[#090e1a] to-[#070707] border border-primary/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 hover:border-primary/60 transition-all duration-500 shadow-2xl overflow-hidden ${getBlurAnimationClasses(
          isConsultationVisible
        )}`}
        style={{ transitionDelay: "300ms" }}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
              <FiCalendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-barlow font-bold text-xl sm:text-2xl tracking-tight">
                Book a Consultation
              </h2>
              <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
                Free 30-Min Strategy Call
              </span>
            </div>
          </div>

          <p className="text-gray-300 font-barlow text-xs sm:text-sm leading-relaxed">
            Want to discuss architecture, timeline, or engineering feasibility in detail? Schedule a free 30-minute consultation with our lead technical architects.
          </p>

          <button
            type="button"
            onClick={handleBookMeeting}
            className="group/btn relative w-full h-[44px] px-6 rounded-[10px] text-sm font-semibold font-barlow text-white bg-[#0A84FF] shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:bg-[#0070e0] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] hover:-translate-y-[2px] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>Book a Meeting</span>
            <FiArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export { BookMeeting };
export default BookMeeting;
