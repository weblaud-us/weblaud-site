import globe from "~/assets/globe.svg";
import target from "~/assets/target.svg";
import visionImg from "~/assets/vision.png";
import { SectionBackground } from "../ui/section-background";
import { ContentCard } from "../ui/content-card";
import { ImageContainer } from "../ui/image-container";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

interface OurMissionAndStoryProps {
  story?: string;
  mission?: string;
  vision?: string;
}

const DEFAULT_VISION =
  "We envision a world where high-growth enterprises operate on intelligent, resilient, and flawlessly crafted digital software foundations. We set new benchmarks in engineering excellence, leverage modern AI workflows, and eliminate technical debt so our partners scale effortlessly.";

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
  vision: {
    title: "Our Vision",
    image: visionImg,
    badge: "Where We're Headed",
    number: "03",
  },
};

const OurMissionAndStory = ({ story, mission, vision }: OurMissionAndStoryProps) => {
  const [storyRef, isStoryVisible] = useBlurAnimation<HTMLDivElement>();
  const [missionRef, isMissionVisible] = useBlurAnimation<HTMLDivElement>();
  const [visionRef, isVisionVisible] = useBlurAnimation<HTMLDivElement>();

  const visionContent = vision || DEFAULT_VISION;

  if (!story && !mission && !visionContent) return null;

  return (
    <SectionBackground>
      {story && (
        <div
          ref={storyRef}
          className="relative max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-16 lg:mb-20"
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
        <div
          ref={missionRef}
          className="relative max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-16 lg:mb-20"
        >
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

      {visionContent && (
        <div ref={visionRef} className="relative max-w-7xl mx-auto">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center ${getBlurAnimationClasses(isVisionVisible)}`}
          >
            <ContentCard
              badge={sectionsData.vision.badge}
              title={sectionsData.vision.title}
              paragraphs={[visionContent]}
              number={sectionsData.vision.number}
              variant="green"
              position="left"
            />
            <ImageContainer
              image={sectionsData.vision.image}
              alt="Our Vision"
              variant="green"
              clipPath="left"
              containerClassName="relative p-6 sm:p-8 md:p-12 lg:p-14"
              imageClassName="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-500"
            />
          </div>
        </div>
      )}
    </SectionBackground>
  );
};

export default OurMissionAndStory;
