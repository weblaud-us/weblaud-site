import globe from "~/assets/globe.svg";
import target from "~/assets/target.svg";
import { SectionBackground } from "../ui/section-background";
import { ContentCard } from "../ui/content-card";
import { ImageContainer } from "../ui/image-container";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

interface OurMissionAndStoryProps {
  story?: string;
  mission?: string;
}

const sectionsData = {
  story: {
    title: "Our Story",
    image: globe,
    badge: "Who We Are",
    number: "01",
  },
  mission: {
    title: "Our Mission",
    image: target,
    badge: "What We Do",
    number: "02",
  },
};

const OurMissionAndStory = ({ story, mission }: OurMissionAndStoryProps) => {
  const [storyRef, isStoryVisible] = useBlurAnimation<HTMLDivElement>();
  const [missionRef, isMissionVisible] = useBlurAnimation<HTMLDivElement>();

  if (!story && !mission) return null;

  return (
    <SectionBackground>
      {story && (
        <div
          ref={storyRef}
          className="relative max-w-7xl mx-auto mb-16 sm:mb-24 md:mb-32 lg:mb-40"
        >
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center ${getBlurAnimationClasses(isStoryVisible)}`}
          >
            <ContentCard
              badge={sectionsData.story.badge}
              title={sectionsData.story.title}
              paragraphs={[story]}
              number={sectionsData.story.number}
              variant="blue"
              position="left"
            />
            <ImageContainer
              image={sectionsData.story.image}
              alt="Our Story"
              variant="blue"
              clipPath="left"
            />
          </div>
        </div>
      )}

      {mission && (
        <div ref={missionRef} className="relative max-w-7xl mx-auto">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center ${getBlurAnimationClasses(isMissionVisible)}`}
          >
            <div className="order-2 lg:order-1">
              <ImageContainer
                image={sectionsData.mission.image}
                alt="Our Mission"
                variant="purple"
                clipPath="right"
              />
            </div>
            <div className="order-1 lg:order-2">
              <ContentCard
                badge={sectionsData.mission.badge}
                title={sectionsData.mission.title}
                paragraphs={[mission]}
                number={sectionsData.mission.number}
                variant="purple"
                position="right"
              />
            </div>
          </div>
        </div>
      )}
    </SectionBackground>
  );
};

export default OurMissionAndStory;
