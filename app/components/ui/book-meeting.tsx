import { Button } from "./button";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

const BookMeeting = () => {
  const [consultationRef, isConsultationVisible] = useBlurAnimation();

  const handleBookMeeting = () => {
    console.log("Book a meeting clicked");
  };

  return (
    <div
      ref={consultationRef}
      className={`group relative bg-card-bg border border-light-black rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 overflow-hidden ${getBlurAnimationClasses(isConsultationVisible)}`}
      style={{ transitionDelay: "300ms" }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-white font-barlow font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
          Book a Consultation
        </h2>

        <p className="text-white/70 font-barlow text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 group-hover:text-white/90 transition-colors duration-300">
          Want to discuss your project in detail? Schedule a free 30-minute
          consultation with our team of experts. We'll help you understand how
          our solutions can benefit your business.
        </p>

        <Button
          onClick={handleBookMeeting}
          className="w-full font-barlow font-semibold text-xs sm:text-sm py-3 sm:py-3.5 "
        >
          Book a Meeting
        </Button>
      </div>
    </div>
  );
};

export { BookMeeting };
