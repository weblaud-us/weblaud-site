import HeroBanner from "../ui/hero-banner";
import ourProjectsImg from "~/assets/our-projects.png";
import { FiLayers } from "react-icons/fi";

const BannerOurProjects = () => {
  return (
    <HeroBanner
      badge={{
        icon: <FiLayers className="w-3.5 h-3.5" />,
        text: "Client Work",
        badgeLabel: "Case Studies",
      }}
      title={
        <>
          Our Work, Your <span className="text-primary">Future</span>
        </>
      }
      description="Here is a selection of real-world platforms, mobile apps, and custom software systems we have delivered. Each one reflects our commitment to clean engineering, thoughtful design, and measurable impact for our clients."
      image={{
        src: ourProjectsImg,
        alt: "Our Projects Dashboard",
        showOnMobile: false,
      }}
      showPatterns={true}
      contentAlignment="left"
    />
  );
};

export default BannerOurProjects;
