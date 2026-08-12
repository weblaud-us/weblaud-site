import type { Route } from "./+types/projects";
import BannerOurProjects from "~/components/projects/bannerOurProjects";
import OurCaseStudies from "~/components/projects/ourCaseStudies";
import Discuss from "~/components/aboutUs/discuss";
import { fetchOptional, resolveMediaUrl } from "~/lib/api.server";
import { toProject, type BackendProject } from "~/lib/adapters/project.server";

export async function loader() {
  const backendProjects = await fetchOptional<BackendProject[]>("/projects", []);
  const projects = backendProjects
    .map(toProject)
    .map((p) => ({ ...p, image: resolveMediaUrl(p.image) }));
  return { projects };
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({ data }: Route.MetaArgs) {
  const projects = data?.projects ?? [];

  return [
    { title: "Portfolio – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Explore Weblaud LLC's portfolio of successful software projects. See how our agency transforms businesses through innovative digital engineering.",
    },
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
    // List-level structured data: each card links to its own case study, so
    // search and answer engines get the full set of URLs plus a one-line
    // summary of each without having to crawl every detail page first.
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Weblaud LLC Case Studies & Portfolio",
        description:
          "Software engineering case studies from Weblaud LLC covering custom ERP platforms, SaaS engineering, mobile apps, production AI, real-time infrastructure, and dedicated engineering pods.",
        url: "https://weblaud.com/projects",
        isPartOf: {
          "@type": "WebSite",
          name: "Weblaud LLC",
          url: "https://weblaud.com",
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            description: project.description,
            url: `https://weblaud.com/projects/${project.slug}`,
          })),
        },
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://weblaud.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: "https://weblaud.com/projects",
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/projects" },
  ];
}

const Projects = ({ loaderData }: Route.ComponentProps) => {
  return (
    <div>
      <BannerOurProjects />
      <OurCaseStudies projects={loaderData.projects} />
      <Discuss />
    </div>
  );
};

export default Projects;
