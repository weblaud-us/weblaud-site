import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedGridBg, { type AnimatedGridBgRef } from "../ui/animated-grid-bg";
import VerticalTabs from "../ui/vertical-tabs";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import strategyImg from "~/assets/strategy.png";
import designImg from "~/assets/design.png";
import developmentImg from "~/assets/development.png";
import maintainImg from "~/assets/maintain.png";
import scaleImg from "~/assets/scale.png";

import productPlanningIcon from "~/assets/product-planning.svg";
import leanDevelopmentIcon from "~/assets/lean-development.svg";
import valueEngineeringIcon from "~/assets/value-engineering.svg";
import accessibilityIcon from "~/assets/accessibility-complience.svg";
import uiUxIcon from "~/assets/ui-ux.svg";
import prototypingIcon from "~/assets/prototyping.svg";
import threeDDesignsIcon from "~/assets/3d-designs.svg";
import customSoftwareIcon from "~/assets/custom-software.svg";
import webApplicationIcon from "~/assets/web-application.svg";
import virtualRealityIcon from "~/assets/virtual-reality.svg";
import augmentedRealityIcon from "~/assets/augmented-reality.svg";
import cloudManagementIcon from "~/assets/cloud-management.svg";
import dedicatedTeamsIcon from "~/assets/dedicated-teams.svg";
import ciCdIcon from "~/assets/ci-cd.svg";
import devopsIcon from "~/assets/devops.svg";
import softwareArchitectureIcon from "~/assets/software-archotecture.svg";

interface FeatureItem {
  name: string;
  icon: string;
}

interface TabContent {
  id: number;
  title: string;
  description: string;
  features: FeatureItem[];
  image: string;
  color: string;
}

const tabsData: TabContent[] = [
  {
    id: 1,
    title: "STRATEGY",
    description:
      "We help you transform ideas into actionable roadmaps. Our strategic approach focuses on understanding your business goals, identifying opportunities, and creating comprehensive plans that align technology with your vision. From product planning to value engineering, we ensure every decision drives meaningful results.",
    features: [
      { name: "Product planning", icon: productPlanningIcon },
      { name: "Clean development", icon: leanDevelopmentIcon },
      { name: "Value-engineering", icon: valueEngineeringIcon },
      { name: "Accessibility compliance", icon: accessibilityIcon },
    ],
    image: strategyImg,
    color: "#0a84ff",
  },
  {
    id: 2,
    title: "DESIGN",
    description:
      "We craft exceptional digital experiences that captivate and engage. Our design philosophy combines aesthetics with functionality, creating intuitive interfaces that users love. From wireframes to high-fidelity prototypes, we bring your vision to life with stunning UI/UX design and immersive 3D elements.",
    features: [
      { name: "UI/UX design", icon: uiUxIcon },
      { name: "Prototyping", icon: prototypingIcon },
      { name: "3D designs", icon: threeDDesignsIcon },
      { name: "Animation", icon: prototypingIcon },
    ],
    image: designImg,
    color: "#0a84ff",
  },
  {
    id: 3,
    title: "DEVELOPMENT",
    description:
      "We build powerful, scalable solutions tailored to your needs. Our development team leverages cutting-edge technologies to create custom software, web applications, and immersive experiences. Whether it's VR, AR, or traditional platforms, we deliver robust solutions that drive innovation and growth.",
    features: [
      { name: "Custom software", icon: customSoftwareIcon },
      { name: "Web applications", icon: webApplicationIcon },
      { name: "Virtual reality", icon: virtualRealityIcon },
      { name: "Augmented reality", icon: augmentedRealityIcon },
    ],
    image: developmentImg,
    color: "#fff",
  },
  {
    id: 4,
    title: "MAINTAIN",
    description:
      "We ensure your systems run smoothly and efficiently. Our maintenance services provide continuous support, monitoring, and optimization to keep your applications performing at their best. From cloud infrastructure to dedicated support teams, we're here to keep your technology reliable and secure.",
    features: [
      { name: "Software maintenance", icon: customSoftwareIcon },
      { name: "Software support", icon: customSoftwareIcon },
      { name: "Cloud infrastructure management", icon: cloudManagementIcon },
      { name: "Dedicated teams", icon: dedicatedTeamsIcon },
    ],
    image: maintainImg,
    color: "#0a84ff",
  },
  {
    id: 5,
    title: "SCALE",
    description:
      "We help your business grow without limits. Our scaling solutions focus on modernizing legacy systems, implementing CI/CD pipelines, and optimizing DevOps practices. With robust software architecture and automated workflows, we enable your infrastructure to scale seamlessly as your business expands.",
    features: [
      { name: "CI/CD", icon: ciCdIcon },
      { name: "Legacy software modernization", icon: customSoftwareIcon },
      { name: "DevOps", icon: devopsIcon },
      { name: "Software architecture", icon: softwareArchitectureIcon },
    ],
    image: scaleImg,
    color: "#0a84ff",
  },
];

const OurSpeciality = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const gridBgRef = useRef<AnimatedGridBgRef>(null);
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>();
  const [cardRef, isCardVisible] = useBlurAnimation<HTMLDivElement>();
  const [descriptionRef, isDescriptionVisible] =
    useBlurAnimation<HTMLParagraphElement>();
  const [featuresRef, isFeaturesVisible] = useBlurAnimation<HTMLDivElement>();
  const [imageRef, isImageVisible] = useBlurAnimation<HTMLDivElement>();

  const activeContent = tabsData.find((tab) => tab.id === activeTab);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gridBgRef.current) {
      gridBgRef.current.handleMouseMove(e);
    }
  };

  const handleMouseLeave = () => {
    if (gridBgRef.current) {
      gridBgRef.current.handleMouseLeave();
    }
  };

  return (
    <section
      ref={containerRef}
      className="bg-black text-white overflow-x-hidden py-16 md:py-24 px-4"
    >
      <h2
        ref={titleRef}
        className={`text-center font-barlow text-2xl md:text-3xl font-semibold mb-8 md:mb-12 ${getBlurAnimationClasses(isTitleVisible)}`}
      >
        Our Speciality
      </h2>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start">
          <div className="w-full lg:w-auto lg:shrink-0">
            <VerticalTabs
              tabs={tabsData}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as number)}
              className={getBlurAnimationClasses(isVisible)}
            />
          </div>

          <div className="w-full lg:flex-1">
            <AnimatePresence mode="wait">
              {activeContent && (
                <motion.div
                  ref={cardRef}
                  key={activeContent.id}
                  initial={{ opacity: 0, x: 50}}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50}}
                  transition={{
                    duration: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative border border-light-black rounded-3xl overflow-hidden bg-linear-to-b from-primary/10 to-primary/5 w-full ${getBlurAnimationClasses(isCardVisible)}`}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <AnimatedGridBg ref={gridBgRef} />

                  <div
                    className="relative z-10 p-8 md:p-12 lg:p-16"
                    style={{ pointerEvents: "auto" }}
                  >
                    <motion.p
                      ref={descriptionRef}
                      initial={{ opacity: 0, y: -10, filter: "blur(20px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className={`text-gray-300 text-sm md:text-base leading-relaxed mb-8 ${getBlurAnimationClasses(isDescriptionVisible)}`}
                    >
                      {activeContent.description}
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                      <motion.div
                        ref={featuresRef}
                        initial={{ opacity: 0, x: -20, filter: "blur(20px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.4,
                          delay: 0.15,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`space-y-4 ${getBlurAnimationClasses(isFeaturesVisible)}`}
                      >
                        {activeContent.features.map((feature, index) => (
                          <motion.div
                            key={feature.name}
                            initial={{
                              opacity: 0,
                              x: -20,
                              scale: 0.8,
                              filter: "blur(25px)",
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            transition={{
                              duration: 0.3,
                              delay: 0.2 + index * 0.2,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={{
                              x: 12,
                              scale: 1.05,
                              transition: { duration: 0.15, ease: "easeOut" },
                            }}
                            className="flex items-center gap-3 group cursor-pointer"
                          >
                            <motion.div
                              className="relative w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden p-2"
                              whileHover={{
                                scale: 1.2,
                                backgroundColor: "rgba(10, 132, 255, 0.3)",
                                transition: { duration: 0.3, ease: "easeOut" },
                              }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                                animate={{
                                  x: ["-150%", "250%"],
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                  ease: "easeInOut",
                                }}
                              />
                              <motion.img
                                src={feature.icon}
                                alt={feature.name}
                                className="w-full h-full object-contain relative z-10 brightness-0 invert"
                                animate={{
                                  scale: [1, 1.15, 1],
                                  rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            </motion.div>
                            <span className="text-gray-200 text-sm md:text-base font-medium group-hover:text-white transition-colors">
                              {feature.name}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        ref={imageRef}
                        initial={{
                          opacity: 0,
                          scale: 0.7,
                          rotate: -10,
                          filter: "blur(20px)",
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeIn",
                        }}
                        className={`flex items-center justify-center ${getBlurAnimationClasses(isImageVisible)}`}
                      >
                        <motion.div
                          className="relative w-full max-w-sm"
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <motion.img
                            src={activeContent.image}
                            alt={activeContent.title}
                            className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                            initial={{
                              opacity: 0,
                              rotateX: -25,
                              scale: 0.9,
                            }}
                            animate={{
                              opacity: 1,
                              rotateX: 0,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.1,
                              ease: "easeInOut",
                            }}
                          />

                          <motion.div
                            className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/40 blur-2xl"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 0.6, 0.4],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-500/40 blur-2xl"
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSpeciality;
