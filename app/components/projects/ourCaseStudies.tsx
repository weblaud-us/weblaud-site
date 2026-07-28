import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { blurAnimation, getBlurAnimationClasses } from "~/lib/animations";
import { ProjectCard } from "../ui/project-card";
import { useNavigate } from "react-router";
import { projects } from "~/data/projects";

const OurCaseStudies = () => {
  const navigate = useNavigate();

  const { itemRefs, isItemVisible } = useBlurAnimationList(
    projects.map((p) => p.id),
    0.1
  );

  const [titleRef, isTitleVisible] = useBlurAnimation();
  const [descRef, isDescVisible] = useBlurAnimation();

  const handleViewDetails = (slug: string) => {
    navigate(`/projects/${slug}`);
  };

  const animationVariants = ["heavy", "scale", "light"] as const;

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-12 md:py-16 lg:py-25">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2
            ref={titleRef}
            className={`text-white font-barlow font-bold text-2xl md:text-3xl mb-4 ${getBlurAnimationClasses(isTitleVisible)}`}
          >
            Our Case Studies
          </h2>
          <p
            ref={descRef}
            className={`text-white/70 font-barlow text-base md:text-lg max-w-3xl mx-auto ${getBlurAnimationClasses(isDescVisible)}`}
            style={{ transitionDelay: "200ms" }}
          >
            Explore our portfolio of innovative technology solutions spanning
            blockchain, machine learning, and enterprise platforms. Each project
            demonstrates our commitment to excellence and cutting-edge
            innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => {
            const isVisible = isItemVisible(project.id);
            const variant = animationVariants[index % animationVariants.length];
            const animation = blurAnimation(isVisible, index, {
              variant,
              staggerDelay: 150,
            });

            return (
              <div
                key={project.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(project.id, el);
                }}
                className={`h-full ${getBlurAnimationClasses(isVisible)}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  features={project.features}
                  image={project.image}
                  imageAlt={project.imageAlt}
                  onViewDetails={() => handleViewDetails(project.slug)}
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
