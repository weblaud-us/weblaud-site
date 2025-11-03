import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { FeatureCard } from "./ui/feature-card";

const WhyChooseUs = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation();
  const [cardsRef, areCardsVisible] = useBlurAnimation();

  const reasons = [
    {
      title: "Innovation",
      description:
        "Pushing boundaries in AI, blockchain, and application solutions.",
    },
    {
      title: "Collaboration",
      description:
        "Working closely with clients to deliver solutions that fit your unique needs.",
    },
    {
      title: "Excellence",
      description:
        "Maintaining the highest standards in code quality, performance, and outcomes.",
    },
    {
      title: "24/7 Hours",
      description:
        "Operating with transparency and ethical considerations at the forefront of all decisions.",
    },
  ];

  return (
    <div className="bg-black px-4 sm:px-6 md:px-8 lg:px-4 xl:px-10 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-8 sm:mb-12 md:mb-16 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <h2 className="text-white font-barlow text-2xl md:text-3xl font-semibold mb-3 sm:mb-4">
            Why Choose Us
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-center items-center sm:items-stretch gap-0 sm:gap-0 lg:gap-0"
        >
          {reasons.map((reason, index) => {
            const animationDelay = index * 200; // 200ms delay between each card
            return (
              <div
                key={index}
                className={`w-60 -mt-12 first:mt-0 sm:w-72 sm:mt-0 md:w-[340px] lg:w-72 xl:w-80 2xl:w-[340px] sm:odd:ml-0 sm:even:-ml-10 sm:nth-3:-mt-12 sm:nth-4:-mt-12 md:odd:ml-0 md:even:-ml-10 md:nth-3:-mt-16 md:nth-4:-mt-16 lg:-ml-12 lg:even:-ml-12 lg:nth-3:-ml-12 lg:nth-3:mt-0 lg:nth-4:-ml-12 lg:nth-4:mt-0 xl:-ml-14 2xl:-ml-16 first:ml-0 shrink-0 ${getBlurAnimationClasses(areCardsVisible, { variant: "scale" })}`}
                style={{
                  zIndex: reasons.length - index,
                  transitionDelay: `${animationDelay}ms`,
                }}
              >
                <FeatureCard
                  title={reason.title}
                  description={reason.description}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
