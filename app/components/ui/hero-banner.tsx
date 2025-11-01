import bg from "~/assets/bg-pattern.svg";
import pattern from "~/assets/geometric-pattern.svg";
import { Button } from "./button";
import type { ReactNode } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

interface HeroBannerProps {
  badge?: {
    text: string;
    showPulse?: boolean;
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
  showPatterns = true,
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
      className={`bg-black px-4 sm:px-6 lg:px-8 xl:px-10 pt-22 sm:pt-22.5 md:pt-26 lg:pt-26 ${className}`}
    >
      <div
        className={`relative max-w-7xl mx-auto bg-card-bg border border-light-black px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 py-5 sm:py-6 md:py-8 lg:py-14 rounded-xl overflow-hidden group ${getBlurAnimationClasses(isVisible)}`}
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        {showPatterns && (
          <>
            <img
              src={pattern}
              className="w-44 sm:w-56 md:w-64 lg:w-80 absolute bottom-0 left-0 opacity-10 z-10"
              alt="Pattern decoration"
            />

            <img
              src={pattern}
              className="w-44 sm:w-56 md:w-64 lg:w-80 absolute top-0 right-0 opacity-10 z-10 rotate-180"
              alt="Pattern decoration"
            />
          </>
        )}

        <div
          className={`relative z-10 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 flex flex-col ${image ? "lg:flex-row" : ""} items-center lg:items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16`}
        >
          <div
            className={`flex-1 w-full ${image ? "lg:w-auto" : ""} ${textAlign}`}
          >
            {badge && (
              <div
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 bg-white/7 border border-white/20 rounded-full ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
                style={{ transitionDelay: "200ms" }}
              >
                {badge.showPulse !== false && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                  </span>
                )}
                <span className="text-xs sm:text-sm font-medium text-white">
                  {badge.text}
                </span>
              </div>
            )}

            <h1
              className={`text-2xl text-white sm:text-3xl md:text-4xl lg:text-[2.8rem] font-barlow font-bold leading-tight mb-4 sm:mb-6 ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "400ms" }}
            >
              {typeof title === "string" ? (
                <span className="text-white">{title}</span>
              ) : (
                title
              )}
            </h1>

            <div
              className={`mt-6 sm:mt-7 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base text-white font-barlow ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "600ms" }}
            >
              {typeof description === "string" ? (
                <p className="leading-relaxed md:leading-normal">
                  {description}
                </p>
              ) : (
                description
              )}
            </div>

            {button && (
              <div
                className={`flex mt-6 sm:mt-7 flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start ${justifyContent} ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
                style={{ transitionDelay: "800ms" }}
              >
                {button.href ? (
                  <a href={button.href}>
                    <Button className="text-xs font-bold px-9 py-4.5">
                      {button.text}
                    </Button>
                  </a>
                ) : (
                  <Button
                    className="text-xs font-bold px-9 py-4.5"
                    onClick={button.onClick}
                  >
                    {button.text}
                  </Button>
                )}
              </div>
            )}
          </div>

          {image && (
            <div
              className={`${image.showOnMobile ? "flex" : "hidden lg:flex"} shrink-0 w-auto justify-end relative ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "1000ms" }}
            >
              <img
                className="w-64 max-w-full h-auto hover:scale-105 transition-transform duration-500"
                src={image.src}
                alt={image.alt}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
