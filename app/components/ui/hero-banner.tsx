import bg from "~/assets/bg-pattern.svg";
import pattern from "~/assets/geometric-pattern.svg";
import { Button } from "./button";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const textAlign =
    contentAlignment === "center" ? "text-center" : "text-center lg:text-left";
  const justifyContent =
    contentAlignment === "center"
      ? "justify-center"
      : "justify-center lg:justify-start";

  return (
    <div
      ref={containerRef}
      className={`bg-black px-4 sm:px-6 lg:px-8 xl:px-10 pt-3 sm:pt-4 md:pt-6 lg:pt-8 ${className}`}
    >
      <div
        className={`relative max-w-7xl mx-auto bg-card-bg border border-light-black px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 rounded-xl overflow-hidden group transition-all duration-1000 ${
          isVisible
            ? "opacity-100 blur-0 translate-y-0"
            : "opacity-0 blur-[10px] translate-y-5"
        }`}
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
              className="w-44 sm:w-56 md:w-64 lg:w-80 xl:w-96 absolute bottom-0 left-0 opacity-10 z-10"
              alt="Pattern decoration"
            />

            <img
              src={pattern}
              className="w-44 sm:w-56 md:w-64 lg:w-80 xl:w-96 absolute top-0 right-0 opacity-10 z-10 rotate-180"
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
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 bg-white/7 border border-white/20 rounded-full transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 blur-0 translate-y-0"
                    : "opacity-0 blur-sm translate-y-5"
                }`}
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
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-barlow font-bold leading-tight mb-4 sm:mb-6 transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 blur-0 translate-y-0"
                  : "opacity-0 blur-sm translate-y-5"
              }`}
            >
              {typeof title === "string" ? (
                <span className="text-white">{title}</span>
              ) : (
                title
              )}
            </h1>

            <div
              className={`my-6 sm:my-7 max-w-2xl mx-auto lg:mx-0 text-xs sm:text-base text-white font-barlow transition-all duration-1000 delay-600 ${
                isVisible
                  ? "opacity-100 blur-0 translate-y-0"
                  : "opacity-0 blur-sm translate-y-5"
              }`}
            >
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>

            {button && (
              <div
                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start ${justifyContent} transition-all duration-1000 delay-800 ${
                  isVisible
                    ? "opacity-100 blur-0 translate-y-0"
                    : "opacity-0 blur-sm translate-y-5"
                }`}
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
              className={`${image.showOnMobile ? "flex" : "hidden lg:flex"} shrink-0 w-auto justify-end relative transition-all duration-1000 delay-1000 ${
                isVisible
                  ? "opacity-100 blur-0 translate-y-0"
                  : "opacity-0 blur-sm translate-y-5"
              }`}
            >
              <img
                className="w-72 max-w-full h-auto hover:scale-105 transition-transform duration-500"
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
