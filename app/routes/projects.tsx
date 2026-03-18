import type { Route } from "./+types/projects";
import BannerOurProjects from "~/components/projects/bannerOurProjects";
import OurCaseStudies from "~/components/projects/ourCaseStudies";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Explore Weblaud LLC's portfolio of successful software projects. See how our agency transforms businesses through innovative digital engineering.",
    },
    {
      name: "keywords",
      content:
        "portfolio, Weblaud LLC, case studies, software projects, engineering portfolio, digital solutions",
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/projects" },
    {
      property: "og:title",
      content: "Our Projects & Case Studies - Weblaud Portfolio",
    },
    {
      property: "og:description",
      content:
        "Discover our successful projects and case studies showcasing our expertise in digital transformation.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/projects" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:alt", content: "Weblaud Portfolio - Our Best Work" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Weblaud Portfolio - Our Best Work" },
    {
      name: "twitter:description",
      content:
        "Check out our portfolio and see how we've helped businesses succeed with digital solutions.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
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
