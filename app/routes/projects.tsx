import type { Route } from "./+types/projects";
import BannerOurProjects from "~/components/projects/bannerOurProjects";
import OurCaseStudies from "~/components/projects/ourCaseStudies";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Our Projects & Case Studies - Weblaud Portfolio" },
    {
      name: "description",
      content:
        "Explore Weblaud's portfolio of successful projects and case studies. See how we've transformed businesses through innovative digital solutions.",
    },
    {
      name: "keywords",
      content:
        "portfolio, case studies, projects, web development portfolio, digital projects, client success stories",
    },
    {
      name: "og:title",
      content: "Our Projects & Case Studies - Weblaud Portfolio",
    },
    {
      name: "og:description",
      content:
        "Discover our successful projects and case studies showcasing our expertise in digital transformation.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Weblaud Portfolio - Our Best Work" },
    {
      name: "twitter:description",
      content:
        "Check out our portfolio and see how we've helped businesses succeed with digital solutions.",
    },
  ];
}

const Projects = () => {
  return (
    <div>
      <BannerOurProjects />
      <OurCaseStudies />
    </div>
  );
};

export default Projects;
