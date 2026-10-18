import { useMemo } from "react";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { ProjectCard } from "../ui/project-card";
import SectionBadge from "../ui/section-badge";
import { FiLayers } from "react-icons/fi";
import type { Project } from "~/lib/types";

interface OurCaseStudiesProps {
  projects: Project[];
}

const OurCaseStudies = ({ projects }: OurCaseStudiesProps) => {
  const projectIds = useMemo(() => projects.map((p) => p.id), [projects]);
  const { itemRefs, isItemVisible } = useBlurAnimationList(
    projectIds,
    0.1
  );

  const [titleRef, isTitleVisible] = useBlurAnimation();
  const [descRef, isDescVisible] = useBlurAnimation();

  if (projects.length === 0) return null;

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-12 md:py-16 lg:py-25">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <SectionBadge
            icon={<FiLayers className="w-3.5 h-3.5" />}
            text="Our Case Studies"
            badgeLabel="Featured Work"
            color="#0a84ff"
            className="mb-4"
          />
          <h2
            ref={titleRef}
            className={`text-white font-barlow font-bold text-2xl md:text-3xl lg:text-4xl mb-4 tracking-tight ${getBlurAnimationClasses(isTitleVisible)}`}
          >
            Our Case Studies
          </h2>
          <p
            ref={descRef}
            className={`text-white/70 font-barlow text-base md:text-lg max-w-3xl mx-auto leading-relaxed ${getBlurAnimationClasses(isDescVisible)}`}
            style={{ transitionDelay: "200ms" }}
          >
            Explore our portfolio of recent projects spanning cloud infrastructure,
            machine learning, and enterprise platforms. Each case study demonstrates
            our technical approach, deliverables, and typical engagement outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => {
            const isVisible = isItemVisible(project.id);

            return (
              <div
                key={project.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(project.id, el);
                }}
                className={`h-full ${getBlurAnimationClasses(isVisible, { variant: "default" })}`}
                style={{ transitionDelay: `${(index % 3) * 120}ms` }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  features={project.features}
                  image={project.image}
                  imageAlt={project.imageAlt}
                  href={`/projects/${project.slug}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurCaseStudies;
