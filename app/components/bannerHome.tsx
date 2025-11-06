import { Link } from "react-router";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import heroBanner from "~/assets/hero-icon.png";
import dashedArrow from "~/assets/dashed-arrow.svg";
import { Button } from "./ui/button";
import GlassButton from "./ui/glass-button";

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
                <GlassButton to="/services">Check our Services</GlassButton>
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
