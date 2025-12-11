import globe from "~/assets/globe.svg";
import target from "~/assets/target.svg";
import { SectionBackground } from "../ui/section-background";
import { ContentCard } from "../ui/content-card";
import { ImageContainer } from "../ui/image-container";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

const sectionsData = {
  story: {
    title: "Our Story",
    image: globe,
    badge: "Who We Are",
    number: "01",
    paragraphs: [
      "Weblaud started with a simple belief: great digital products begin with understanding people. We were a small team driven by curiosity and the desire to make technology feel clear and approachable. As we grew, that mindset shaped every project—listen first, build with intention, and treat clients like partners. Today, we help businesses turn ideas into meaningful digital experiences through thoughtful design, reliable engineering, and genuine collaboration.",
    ],
  },
  mission: {
    title: "Our Mission",
    image: target,
    badge: "What We Do",
    number: "02",
    paragraphs: [
      "Our mission is to build technology that’s practical, human, and built to last. We aim to simplify complex challenges through honest communication, clean development, and solutions that support real business growth. Whether it’s AI, mobile apps, blockchain, or cloud systems, we focus on making the process feel smooth and supportive at every step. We’re here to help you move forward with clarity and confidence.",
    ],
  },
};

const OurMissionAndStory = () => {
  const [storyRef, isStoryVisible] = useBlurAnimation<HTMLDivElement>();
  const [missionRef, isMissionVisible] = useBlurAnimation<HTMLDivElement>();

  return (
    <SectionBackground>
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
            paragraphs={sectionsData.story.paragraphs}
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
              paragraphs={sectionsData.mission.paragraphs}
              number={sectionsData.mission.number}
              variant="purple"
              position="right"
            />
          </div>
        </div>
      </div>
    </SectionBackground>
  );
};

export default OurMissionAndStory;
