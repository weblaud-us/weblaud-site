import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { blurAnimation, getBlurAnimationClasses } from "~/lib/animations";
import { ProjectCard } from "../ui/project-card";
import pimg01 from "~/assets/pimg-01.png";
import pimg02 from "~/assets/pimg-02.png";
import pimg03 from "~/assets/pimg-03.png";
import pimg04 from "~/assets/pimg-04.png";
import pimg05 from "~/assets/pimg-05.png";
import pimg06 from "~/assets/pimg-06.png";

interface Project {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Machine Learning Platform",
    description:
      "Advanced AI-powered platform leveraging cutting-edge machine learning algorithms to deliver predictive analytics, automated decision-making, and intelligent data processing for enterprise solutions.",
    features: [
      "Neural network training & optimization",
      "Real-time predictive analytics",
      "Automated model deployment pipeline",
    ],
    image: pimg01,
    imageAlt: "AI Machine Learning Project",
  },
  {
    id: 2,
    title: "Blockchain Integration",
    description:
      "Secure and scalable blockchain solutions featuring smart contract development, decentralized applications, and distributed ledger technology for transparent and immutable transaction processing.",
    features: [
      "Smart contract development & audit",
      "Decentralized app (DApp) architecture",
      "Multi-chain integration support",
    ],
    image: pimg02,
    imageAlt: "Blockchain Technology Project",
  },
  {
    id: 3,
    title: "Algorithmic Trading",
    description:
      "High-frequency trading platform utilizing sophisticated algorithms and real-time market data analysis to execute automated trading strategies with precision and minimal latency.",
    features: [
      "Real-time market data processing",
      "Automated strategy execution",
      "Risk management & backtesting",
    ],
    image: pimg03,
    imageAlt: "Trading Algorithm Project",
  },
  {
    id: 4,
    title: "Data Analytics Platform",
    description:
      "Comprehensive data analytics solution providing deep insights through advanced visualization, statistical analysis, and big data processing capabilities for data-driven decision making.",
    features: [
      "Interactive data visualization",
      "Big data processing engine",
      "Custom reporting & dashboards",
    ],
    image: pimg04,
    imageAlt: "Data Analytics Project",
  },
  {
    id: 5,
    title: "Business Intelligence",
    description:
      "Enterprise-grade business intelligence platform delivering actionable insights through powerful analytics, KPI tracking, and comprehensive reporting tools for strategic business growth.",
    features: [
      "Executive dashboard & KPI tracking",
      "Predictive business analytics",
      "Multi-source data integration",
    ],
    image: pimg05,
    imageAlt: "Business Intelligence Dashboard",
  },
  {
    id: 6,
    title: "Enterprise Infrastructure",
    description:
      "Robust and scalable enterprise infrastructure solutions featuring cloud-native architecture, microservices, and DevOps automation for high-performance and reliable business operations.",
    features: [
      "Cloud-native architecture design",
      "Automated CI/CD pipelines",
      "High availability & disaster recovery",
    ],
    image: pimg06,
    imageAlt: "Enterprise Infrastructure Project",
  },
];

const OurCaseStudies = () => {
  const { itemRefs, isItemVisible } = useBlurAnimationList(
    projects.map((p) => p.id),
    0.1
  );

  const [titleRef, isTitleVisible] = useBlurAnimation();
  const [descRef, isDescVisible] = useBlurAnimation();

  const handleViewDetails = (projectId: number) => {
    console.log(`Viewing project ${projectId}`);
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
                  onViewDetails={() => handleViewDetails(project.id)}
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
