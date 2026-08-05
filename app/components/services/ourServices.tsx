import { services } from "~/data/services";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { blurAnimation, getBlurAnimationClasses } from "~/lib/animations";
import { ServiceCard } from "../ui/service-card";

const OurServices = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>(0.1);
  const [descRef, isDescVisible] = useBlurAnimation<HTMLParagraphElement>(0.1);

  const { itemRefs, isItemVisible } = useBlurAnimationList(
    services.map((s) => s.id),
    0.05
  );

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-6 lg:py-15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center my-12 md:my-16">
          <h2
            ref={titleRef}
            className={`text-white font-barlow font-bold text-2xl md:text-3xl mb-4 ${getBlurAnimationClasses(isTitleVisible)}`}
          >
            Our Services
          </h2>
          <p
            ref={descRef}
            className={`text-white/70 md:w-3/4 lg:w-1/2 font-barlow text-base md:text-lg max-w-4xl mx-auto ${getBlurAnimationClasses(isDescVisible)}`}
            style={{ transitionDelay: "200ms" }}
          >
            From architecture to high-load deployment — production-ready software systems built with clean code and zero engineering compromises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const isVisible = isItemVisible(service.id);
            const animation = blurAnimation(isVisible, index, {
              variant: "default",
              staggerDelay: 80,
            });

            return (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(service.id, el);
                }}
                className="h-full"
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  image={service.image}
                  imageAlt={service.imageAlt}
                  className={animation.className}
                  style={animation.style}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
