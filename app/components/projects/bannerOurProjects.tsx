import HeroBanner from "../ui/hero-banner";
import ourProjectsImg from "~/assets/our-projects.png";

const BannerOurProjects = () => {
  return (
    <HeroBanner
      badge={{
        text: "Our Projects",
        showPulse: true,
      }}
      title={
        <>
          Our Work, Your <span className="text-primary">Future</span>
        </>
      }
      description="From AI-powered platforms to custom mobile apps and e-commerce solutions, here's a selection of real-world projects we've delivered. Each one reflects our commitment to clean engineering, thoughtful design, and measurable impact for our clients."
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
