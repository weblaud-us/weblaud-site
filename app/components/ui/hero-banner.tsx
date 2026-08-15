import type { ReactNode } from "react";
import SectionBadge from "./section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

export interface HeroBannerProps {
  badge?: {
    text: string;
    showPulse?: boolean;
    badgeLabel?: string;
    icon?: ReactNode;
  };
  title: string | ReactNode;
  description: string | ReactNode;
  button?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  image?: {
    src: string;
    alt: string;
    showOnMobile?: boolean;
  };
  showPatterns?: boolean;
  className?: string;
  contentAlignment?: "left" | "center";
}

const HeroBanner = ({
  badge,
  title,
  description,
  button,
  image,
  className = "",
  contentAlignment = "left",
}: HeroBannerProps) => {
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();

  const textAlign =
    contentAlignment === "center" ? "text-center" : "text-center lg:text-left";
  const justifyContent =
    contentAlignment === "center"
      ? "justify-center"
      : "justify-center lg:justify-start";

  return (
    <div
      ref={containerRef}
      className={`relative bg-black text-white px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20 sm:pb-24 md:pb-28 lg:pb-32 min-h-[90vh] lg:min-h-screen flex flex-col justify-center overflow-hidden ${className}`}
    >
      {/* Ambient background glow on the left/content side */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto">
        <div
          className={`flex flex-col ${image ? "lg:flex-row" : ""} items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16`}
        >
          <div
            className={`flex-1 w-full ${image ? "lg:w-auto" : ""} ${textAlign}`}
          >
            {badge && (
              <div
                className={`mb-5 sm:mb-6 flex ${justifyContent} ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
                style={{ transitionDelay: "80ms" }}
              >
                <SectionBadge
                  icon={badge.icon}
                  text={badge.text}
                  badgeLabel={badge.badgeLabel}
                  pulsingDot={badge.showPulse ?? false}
                  color="#0a84ff"
                />
              </div>
            )}

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-barlow font-bold text-white tracking-tight leading-[1.12] mb-5 sm:mb-6 ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "160ms" }}
            >
              {typeof title === "string" ? (
                <span>{title}</span>
              ) : (
                title
              )}
            </h1>

            <div
              className={`max-w-2xl mx-auto lg:mx-0 text-gray-300 font-barlow text-sm sm:text-base md:text-lg leading-relaxed ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "240ms" }}
            >
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>

            {button && (
              <div
                className={`flex mt-8 sm:mt-9 flex-col sm:flex-row gap-3 sm:gap-4 items-center ${justifyContent} ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
                style={{ transitionDelay: "320ms" }}
              >
                {button.href ? (
                  <a
                    href={button.href}
                    className="relative group h-[38px] w-auto inline-flex items-center justify-center px-4.5 sm:px-5 rounded-[10px] text-[13px] font-semibold text-white bg-[#0A84FF] overflow-hidden shadow-[0_2px_10px_rgba(10,132,255,0.35)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.3)] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer shrink-0"
                  >
                    <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-100 mix-blend-overlay"></span>
                    <span className="relative z-10 flex items-center">{button.text}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={button.onClick}
                    className="relative group h-[38px] w-auto inline-flex items-center justify-center px-4.5 sm:px-5 rounded-[10px] text-[13px] font-semibold text-white bg-[#0A84FF] overflow-hidden shadow-[0_2px_10px_rgba(10,132,255,0.35)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.3)] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer shrink-0"
                  >
                    <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-100 mix-blend-overlay"></span>
                    <span className="relative z-10 flex items-center">{button.text}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {image && (
            <div
              className={`${image.showOnMobile ? "flex" : "hidden lg:flex"} shrink-0 w-auto justify-center lg:justify-end relative ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "400ms" }}
            >
              <img
                className="w-64 sm:w-72 md:w-80 lg:w-96 max-w-full h-auto hover:scale-105 transition-transform duration-500"
                src={image.src}
                alt={image.alt}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
