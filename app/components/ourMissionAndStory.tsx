import globe from "~/assets/globe.svg";
import target from "~/assets/target.svg";
import { SectionBackground } from "./ui/section-background";
import { ContentCard } from "./ui/content-card";
import { ImageContainer } from "./ui/image-container";

const sectionsData = {
  story: {
    title: "Our Story",
    image: globe,
    badge: "Who We Are",
    number: "01",
    paragraphs: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
    ],
  },
  mission: {
    title: "Our Mission",
    image: target,
    badge: "What We Do",
    number: "02",
    paragraphs: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry",
    ],
  },
};

const OurMissionAndStory = () => {
  return (
    <SectionBackground>
      <div className="relative max-w-7xl mx-auto mb-16 sm:mb-24 md:mb-32 lg:mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
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

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
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
