import { Link } from "react-router";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import heroBanner from "~/assets/hero-icon.png";
import dashedArrow from "~/assets/dashed-arrow.svg";
import { Button } from "./ui/button";

const BannerHome = () => {
  const [contentRef, isContentVisible] = useBlurAnimation();
  const [imageRef, isImageVisible] = useBlurAnimation();

  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-24 xl:pb-28 pt-40  md:pt-45">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-0 items-center">
          <div className="flex  ">
            <div className="flex items-start relative top-5 sm:top-0">
              <img
                src={dashedArrow}
                alt="Dashed Arrow"
                className="md:h-90 sm:h-65 h-50 relative bottom-11"
              />
              <span className="text-sm sm:text-base font-barlow relative left-2 bottom-12">
                Hello,
              </span>
            </div>

            <div
              ref={contentRef}
              className={`space-y-4 sm:space-y-6 md:space-y-8 ${getBlurAnimationClasses(isContentVisible, { variant: "default" })}`}
            >
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold font-barlow leading-tight text-nowrap">
                We Help People To{" "}
                <span className="block">Bring Their Ideas</span>
                <span className="block">Alive</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-300 font-barlow  sm:max-w-md max-w-sm lg:max-w-xl leading-relaxed">
                A talented team to help you in your journey on creating usefull
                and easy to use product
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 pt-2">
                <Link to="/contact">
                  <Button className="text-xs font-bold px-9 py-4.5">
                    {" "}
                    Let's Talk
                  </Button>
                </Link>
                <Link
                  to="/services"
                  className="group relative w-fit sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden bg-white/3 backdrop-blur-md border border-white/15 hover:border-primary/50 text-white px-6 sm:px-7 py-3 sm:py-2 rounded-lg text-xs font-barlow font-semibold transition-all duration-500 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-linear-to-br from-white/8 via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

                  <span className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 group-hover:from-primary/15 group-hover:to-blue-500/10 transition-all duration-500"></span>

                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out skew-x-12"></span>


                  <span className="relative z-10 flex items-center gap-2.5">
                    <span className="group-hover:text-primary transition-colors duration-300 tracking-wide">
                      Check our Services
                    </span>

                    <span className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/0 group-hover:bg-primary/20 transition-all duration-300">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-300 group-hover:text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </span>

                </Link>
              </div>
            </div>
          </div>

          <div
            ref={imageRef}
            className={`relative mt-6 sm:mt-8 lg:mt-0 ${getBlurAnimationClasses(isImageVisible, { variant: "scale" })}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative z-10 animate-float">
              <img
                src={heroBanner}
                alt="3D Illustration"
                className="w-full h-auto max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto drop-shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BannerHome;
