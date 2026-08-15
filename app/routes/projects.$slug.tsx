import { Link } from "react-router";
import Discuss from "~/components/aboutUs/discuss";
import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiCheckCircle,
  FiLayers,
  FiCpu,
  FiTarget,
  FiZap,
  FiAlertCircle,
  FiCode,
} from "react-icons/fi";
import SectionBadge from "~/components/ui/section-badge";
import { MorphingTabs, type MorphingTabsItem } from "~/components/ui/morphing-tabs";
import { RouteErrorBoundary } from "~/components/ui/error-page";
import type { Route } from "./+types/projects.$slug";
import { apiFetch, resolveMediaUrl, ApiError } from "~/lib/api.server";
import { toProject, type BackendProject } from "~/lib/adapters/project.server";
import { RESULTS_DISCLOSURE } from "~/lib/constants";
import {
  SiPhp,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiAmazonwebservices,
  SiGooglecloud,
  SiPython,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiGo,
  SiRust,
  SiGraphql,
  SiTailwindcss,
  SiStripe,
  SiTerraform,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiApachekafka,
  SiRabbitmq,
  SiElasticsearch,
  SiLinux,
  SiNginx,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

function getTechIcon(name: string) {
  const normalized = name.toLowerCase().trim();
  if (normalized.includes("php")) return <SiPhp className="w-3.5 h-3.5 text-[#777BB4]" />;
  if (normalized.includes("node")) return <SiNodedotjs className="w-3.5 h-3.5 text-[#5FA04E]" />;
  if (normalized.includes("typescript") || normalized === "ts") return <SiTypescript className="w-3.5 h-3.5 text-[#3178C6]" />;
  if (normalized.includes("javascript") || normalized === "js") return <SiJavascript className="w-3.5 h-3.5 text-[#F7DF1E]" />;
  if (normalized.includes("next")) return <SiNextdotjs className="w-3.5 h-3.5 text-white" />;
  if (normalized.includes("react")) return <SiReact className="w-3.5 h-3.5 text-[#61DAFB]" />;
  if (normalized.includes("vue")) return <SiVuedotjs className="w-3.5 h-3.5 text-[#4FC08D]" />;
  if (normalized.includes("angular")) return <SiAngular className="w-3.5 h-3.5 text-[#DD0031]" />;
  if (normalized.includes("postgres")) return <SiPostgresql className="w-3.5 h-3.5 text-[#4169E1]" />;
  if (normalized.includes("mysql")) return <SiMysql className="w-3.5 h-3.5 text-[#4479A1]" />;
  if (normalized.includes("mongo")) return <SiMongodb className="w-3.5 h-3.5 text-[#47A248]" />;
  if (normalized.includes("redis")) return <SiRedis className="w-3.5 h-3.5 text-[#DC382D]" />;
  if (normalized.includes("docker")) return <SiDocker className="w-3.5 h-3.5 text-[#2496ED]" />;
  if (normalized.includes("kube") || normalized === "k8s") return <SiKubernetes className="w-3.5 h-3.5 text-[#326CE5]" />;
  if (normalized.includes("github") || normalized.includes("action")) return <SiGithubactions className="w-3.5 h-3.5 text-[#2088FF]" />;
  if (normalized.includes("aws") || normalized.includes("amazon")) return <SiAmazonwebservices className="w-3.5 h-3.5 text-[#FF9900]" />;
  if (normalized.includes("gcp") || normalized.includes("google")) return <SiGooglecloud className="w-3.5 h-3.5 text-[#4285F4]" />;
  if (normalized.includes("azure")) return <VscAzure className="w-3.5 h-3.5 text-[#0078D4]" />;
  if (normalized.includes("python")) return <SiPython className="w-3.5 h-3.5 text-[#3776AB]" />;
  if (normalized.includes("fastapi")) return <SiFastapi className="w-3.5 h-3.5 text-[#009688]" />;
  if (normalized.includes("django")) return <SiDjango className="w-3.5 h-3.5 text-[#092E20]" />;
  if (normalized.includes("flask")) return <SiFlask className="w-3.5 h-3.5 text-white" />;
  if (normalized.includes("go") || normalized.includes("golang")) return <SiGo className="w-3.5 h-3.5 text-[#00ADD8]" />;
  if (normalized.includes("rust")) return <SiRust className="w-3.5 h-3.5 text-[#DEA584]" />;
  if (normalized.includes("graphql")) return <SiGraphql className="w-3.5 h-3.5 text-[#E10098]" />;
  if (normalized.includes("tailwind")) return <SiTailwindcss className="w-3.5 h-3.5 text-[#06B6D4]" />;
  if (normalized.includes("stripe")) return <SiStripe className="w-3.5 h-3.5 text-[#635BFF]" />;
  if (normalized.includes("terraform")) return <SiTerraform className="w-3.5 h-3.5 text-[#844FBA]" />;
  if (normalized.includes("prisma")) return <SiPrisma className="w-3.5 h-3.5 text-white" />;
  if (normalized.includes("supabase")) return <SiSupabase className="w-3.5 h-3.5 text-[#3ECF8E]" />;
  if (normalized.includes("firebase")) return <SiFirebase className="w-3.5 h-3.5 text-[#FFCA28]" />;
  if (normalized.includes("kafka")) return <SiApachekafka className="w-3.5 h-3.5 text-[#231F20]" />;
  if (normalized.includes("rabbitmq")) return <SiRabbitmq className="w-3.5 h-3.5 text-[#FF6600]" />;
  if (normalized.includes("elastic")) return <SiElasticsearch className="w-3.5 h-3.5 text-[#005571]" />;
  if (normalized.includes("linux")) return <SiLinux className="w-3.5 h-3.5 text-[#FCC624]" />;
  if (normalized.includes("nginx")) return <SiNginx className="w-3.5 h-3.5 text-[#009639]" />;
  return <FiCode className="w-3.5 h-3.5 text-primary" />;
}

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  const primaryTech = project.techStack?.[0] || "Architecture";

  const morphingTabItems: MorphingTabsItem[] = [
    ...(project.problem
      ? [
          {
            id: "challenge",
            label: "The Challenge",
            icon: <FiAlertCircle className="w-4 h-4 text-amber-400" />,
            content: (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                    01 · Baseline Bottlenecks & Legacy Constraints
                  </span>
                </div>
                <p className="text-gray-200 font-barlow text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {project.problem}
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(project.solution
      ? [
          {
            id: "solution",
            label: "The Solution",
            icon: <FiZap className="w-4 h-4 text-primary" />,
            content: (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-[11px] uppercase tracking-wider font-semibold">
                    02 · Engineering Strategy & Architecture
                  </span>
                </div>
                <p className="text-white font-barlow text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {project.solution}
                </p>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-28 sm:pt-32 md:pt-36">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Top Bar with Badge on left and Back Link on right */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SectionBadge
            icon={<FiLayers className="w-3.5 h-3.5" />}
            text={primaryTech}
            badgeLabel="Case Study"
            color="#0a84ff"
          />

          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-gray-300 hover:text-white text-xs font-barlow font-medium transition-all duration-300 group shrink-0"
          >
            <FiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white shrink-0" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to All Projects</span>
          </Link>
        </div>

        {/* Hero Header */}
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white tracking-tight leading-[1.12]">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-barlow leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Framed Cover Image */}
          <div className="p-2.5 sm:p-3 bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
              <img
                src={project.image}
                alt={project.imageAlt}
                className="w-full h-auto object-cover aspect-video group-hover:scale-102 transition-transform duration-700 rounded-xl sm:rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-xl sm:rounded-2xl" />
            </div>
          </div>
        </header>

        {/* Direct Business Impact Callout */}
        {project.businessImpact && (
          <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-2xl sm:rounded-r-3xl shadow-xl space-y-2">
            <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-1">
              Direct Business Impact
            </h2>
            <p className="text-white font-barlow text-base sm:text-lg md:text-xl leading-relaxed font-medium">
              "{project.businessImpact}"
            </p>
          </section>
        )}

        {/* Architectural Deep-Dive Morphing Tabs */}
        {morphingTabItems.length > 0 && (
          <div className="my-6">
            <MorphingTabs
              items={morphingTabItems}
              defaultValue={morphingTabItems[0]?.id}
              ariaLabel="Project Challenge and Solution"
            />
          </div>
        )}

        {/* Section: Key Deliverables & Milestones */}
        {project.features.length > 0 && (
          <section className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <FiTarget className="w-4 h-4 text-primary shrink-0" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold font-barlow text-white tracking-tight">
                  Key Deliverables & Milestones
                </h2>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary font-medium">
                {project.features.length} Highlights
              </span>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3 pt-1">
              {project.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-black/60 border border-white/[0.08] hover:border-primary/40 hover:bg-black/90 transition-all duration-300 group"
                >
                  <div className="w-5 h-5 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                    <FiCheckCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-gray-200 font-barlow text-sm sm:text-base leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Technology & Infrastructure Stack */}
        {project.techStack.length > 0 && (
          <section className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <FiCpu className="w-4 h-4 text-primary shrink-0" />
              <h2 className="text-base sm:text-lg md:text-xl font-bold font-barlow text-white tracking-tight">
                Technology & Infrastructure Stack
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/[0.08] hover:border-primary/50 text-xs sm:text-sm font-mono font-medium text-gray-200 hover:text-white transition-all duration-200 group shadow-xs"
                >
                  {getTechIcon(tech)}
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-14 sm:mt-18">
        <Discuss />
      </div>
    </div>
  );
}
