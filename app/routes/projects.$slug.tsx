import { Link } from "react-router";
import Discuss from "~/components/aboutUs/discuss";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { RouteErrorBoundary } from "~/components/ui/error-page";
import type { Route } from "./+types/projects.$slug";
import { apiFetch, resolveMediaUrl, ApiError } from "~/lib/api.server";
import { toProject, type BackendProject } from "~/lib/adapters/project.server";
import { RESULTS_DISCLOSURE } from "~/lib/constants";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const backendProject = await apiFetch<BackendProject>(
      `/projects/slug/${params.slug}`,
    );
    const project = {
      ...toProject(backendProject),
      image: resolveMediaUrl(backendProject.coverImage),
    };
    return { project };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }
    throw err;
  }
}

export function meta({ data }: Route.MetaArgs) {
  const project = data?.project;
  if (!project) return [{ title: "Case Study Not Found - Weblaud LLC" }];

  const pageUrl = `https://weblaud.com/projects/${project.slug}`;
  const pageTitle = `${project.title} Case Study | Weblaud LLC`;

  return [
    { title: pageTitle },
    { name: "description", content: project.description },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: project.description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:alt", content: project.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: project.description },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: pageTitle,
        description: project.description,
        url: pageUrl,
        author: {
          "@type": "Organization",
          name: "Weblaud LLC",
          url: "https://weblaud.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Weblaud LLC",
          logo: {
            "@type": "ImageObject",
            url: "https://weblaud.com/favicon.png",
          },
        },
        proficiencyLevel: "Expert",
        dependencies: project.techStack.join(", "),
        articleBody: `Challenge: ${project.problem} Solution: ${project.solution} Impact: ${project.businessImpact}`,
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
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: pageUrl,
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: pageUrl },
  ];
}

export function ErrorBoundary() {
  return (
    <RouteErrorBoundary
      notFound={{
        badge: "Case study not found",
        title: "We couldn't find that case study.",
        description:
          "The project you're looking for doesn't exist or may have been unpublished. Browse the work we've shipped instead.",
        primaryAction: { label: "Back to Projects", to: "/projects" },
        suggestions: [
          { label: "Our Services", to: "/services" },
          { label: "Project Estimator", to: "/calculator" },
          { label: "Contact Us", to: "/contact" },
        ],
      }}
    />
  );
}

export default function CaseStudy({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center text-primary hover:text-white transition-colors duration-300 mb-8 font-barlow font-medium group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Hero Section */}
        <header className="mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-barlow mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-barlow leading-relaxed mb-10">
            {project.description}
          </p>

          <div className="rounded-3xl overflow-hidden border border-light-black shadow-2xl relative">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-transparent pointer-events-none"></div>
            <img
              src={project.image}
              alt={project.imageAlt}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
        </header>

        {/* Content Section */}
        <div className="space-y-12 md:space-y-16">

          {/* Problem & Solution Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-card-bg border border-light-black p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-1 bg-red-500/50 blur-sm"></div>
              <h2 className="text-2xl font-bold font-barlow mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 text-sm">01</span>
                The Challenge
              </h2>
              <p className="text-gray-300 font-barlow leading-relaxed">
                {project.problem}
              </p>
            </div>

            <div className="bg-card-bg border border-light-black p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-1 bg-green-500/50 blur-sm"></div>
              <h2 className="text-2xl font-bold font-barlow mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 text-sm">02</span>
                The Solution
              </h2>
              <p className="text-gray-300 font-barlow leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Tech Stack & Key Features */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h2 className="text-2xl font-bold font-barlow mb-6">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-barlow text-sm text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold font-barlow mb-6">Key Deliverables</h2>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-300 font-barlow">
                    <FiCheckCircle className="text-primary mt-1 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Business Impact */}
          <div className="bg-linear-to-br from-primary/20 to-blue-600/10 border border-primary/30 p-8 md:p-12 rounded-3xl text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('~/assets/noise.png')] opacity-10 mix-blend-overlay"></div>
             <h2 className="text-2xl md:text-3xl font-bold font-barlow mb-6 text-white relative z-10">Business Impact</h2>
             <p className="text-xl md:text-2xl text-blue-100 font-barlow leading-relaxed font-medium relative z-10">
               "{project.businessImpact}"
             </p>
             <p className="text-xs md:text-sm text-blue-100/50 font-barlow mt-6 max-w-2xl mx-auto relative z-10">
               {RESULTS_DISCLOSURE}
             </p>
          </div>
        </div>
      </div>

      <Discuss />
    </div>
  );
}
