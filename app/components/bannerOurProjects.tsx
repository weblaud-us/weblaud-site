import HeroBanner from "./ui/hero-banner";
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
      description="From machine learning platforms to blockchain protocols and predictive analytics tools, here's a selection of real-world solutions we've delivered for forward-thinking companies. Each project represents our commitment to innovation, cutting-edge technology, and delivering measurable results. We've helped startups scale rapidly, enterprises optimize operations, and organizations transform their data into strategic advantages. Our portfolio spans diverse industries including fintech, healthcare, e-commerce, and enterprise software, showcasing our versatility and deep technical expertise in solving complex challenges."
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
