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
    <section className="bg-linear-to-b from-black via-[#0a0a0a] to-black px-4 sm:px-6 md:px-8 lg:px-6 xl:px-10 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-10 ${getBlurAnimationClasses(isTitleVisible)}`}
        >

          <h2 className="text-white font-barlow text-2xl md:text-3xl font-semibold">
            Why Choose Us
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-center items-center sm:items-stretch gap-0 sm:gap-0 lg:gap-0"
        >
          {reasons.map((reason, index) => {
            const animationDelay = index * 200;
            return (
              <div
                key={index}
                className={`w-[70vw] max-w-72 sm:max-w-full -mt-12 first:mt-0 sm:w-72 sm:mt-0 md:w-[340px] lg:w-72 xl:w-80 2xl:w-[340px] sm:odd:ml-0 sm:even:-ml-10 sm:nth-3:-mt-12 sm:nth-4:-mt-12 md:odd:ml-0 md:even:-ml-10 md:nth-3:-mt-16 md:nth-4:-mt-16 lg:-ml-12 lg:even:-ml-12 lg:nth-3:-ml-12 lg:nth-3:mt-0 lg:nth-4:-ml-12 lg:nth-4:mt-0 xl:-ml-14 2xl:-ml-16 first:ml-0 shrink-0 ${getBlurAnimationClasses(areCardsVisible, { variant: "scale" })}`}
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
    </section>
  );
};

export default WhyChooseUs;
