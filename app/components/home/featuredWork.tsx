import { Link } from "react-router";
import { FiLayers } from "react-icons/fi";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "~/components/ui/project-card";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { Project } from "~/lib/types";

interface FeaturedWorkProps {
  projects: Project[];
}

/**
 * Three case studies on the home page. Visitors deciding whether to hire an
 * agency look for shipped work first; the home page previously had none.
 */
export default function FeaturedWork({ projects }: FeaturedWorkProps) {
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();

  if (projects.length === 0) return null;

  return (
    <section className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-14 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div
          ref={titleRef}
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <div>
            <SectionBadge
              icon={<FiLayers className="w-3.5 h-3.5" />}
              text="Featured Work"
              badgeLabel="Case Studies"
              color="#0a84ff"
              className="mb-4"
            />
            <h2 className="text-white font-barlow text-2xl md:text-4xl font-bold tracking-tight">
              Software we've shipped
            </h2>
          </div>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-1.5 font-barlow font-semibold text-sm text-primary hover:text-blue-400 transition-colors shrink-0"
          >
            View all case studies
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              features={project.features}
              image={project.image}
              imageAlt={project.imageAlt}
              href={`/projects/${project.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
