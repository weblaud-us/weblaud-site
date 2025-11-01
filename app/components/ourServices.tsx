import aiAppImg from "~/assets/ai-app.png";
import mobileAppImg from "~/assets/mobile-app.png";
import algorithmTradingImg from "~/assets/algorithm-trading.png";
import retailEcommerceImg from "~/assets/retail-ecommerce.png";
import customDesignImg from "~/assets/custom-design.png";
import webAppImg from "~/assets/web-app.png";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { blurAnimation, getBlurAnimationClasses } from "~/lib/animations";
import { ServiceCard } from "./ui/service-card";

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Ai Mobile App Design & Development",
    description:
      "Custom ML models designed and optimized for your specific business challenges, leveraging cutting-edge deep learning techniques.",
    features: [
      "Deep learning model development",
      "Computer vision solutions",
      "Model optimization and scaling",
      "Neural network architecture design",
      "Natural language processing",
    ],
    image: aiAppImg,
    imageAlt: "AI Mobile App Development",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description:
      "End-to-end blockchain solutions from smart contract development to decentralized application architecture.",
    features: [
      "Smart contract development",
      "Blockchain integration",
      "Token implementation",
      "DeFi protocol design",
      "Web3 development",
    ],
    image: mobileAppImg,
    imageAlt: "Mobile App Development",
  },
  {
    id: 3,
    title: "Algorithmic Trading",
    description:
      "Advanced trading algorithms and systems leveraging ML for market analysis and automated execution.",
    features: [
      "Trading strategy development",
      "Market analysis algorithms",
      "Performance optimization",
      "High-frequency trading systems",
      "Risk management systems",
    ],
    image: algorithmTradingImg,
    imageAlt: "Algorithmic Trading",
  },
  {
    id: 4,
    title: "Retail & E-commerce",
    description:
      "AI-powered solutions for personalization and inventory management.",
    features: [
      "Demand forecasting",
      "Inventory optimization",
      "Recommendation systems",
      "Customer analytics",
    ],
    image: retailEcommerceImg,
    imageAlt: "Retail & E-commerce",
  },
  {
    id: 5,
    title: "Custom Website Design & Development",
    description:
      "Transform your data into actionable insights with our advanced predictive modeling and forecasting solutions.",
    features: [
      "Time series analysis",
      "Business intelligence",
      "Data visualization",
      "Predictive modeling",
      "Statistical analysis",
    ],
    image: customDesignImg,
    imageAlt: "Custom Website Design & Development",
  },
  {
    id: 6,
    title: "Custom Mobile App & Website Development",
    description:
      "Enterprise-grade infrastructure for deploying and managing ML models in production environments.",
    features: [
      "CI/CD pipeline setup",
      "Performance monitoring",
      "DevOps integration",
      "Model deployment automation",
      "Infrastructure scaling",
    ],
    image: webAppImg,
    imageAlt: "Custom Mobile App & Website Development",
  },
];

const OurServices = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>(0.1);
  const [descRef, isDescVisible] = useBlurAnimation<HTMLParagraphElement>(0.1);

  const { itemRefs, isItemVisible } = useBlurAnimationList(
    services.map((s) => s.id),
    0.1
  );

  const handleBookNow = (serviceId: number) => {
    console.log(`Booking service ${serviceId}`);
  };

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-6 lg:py-9">
      <div className="max-w-7xl mx-auto">
        <div className="text-center my-12 md:my-16">
          <h2
            ref={titleRef}
            className={`text-white font-barlow font-bold text-2xl md:text-3xl mb-4 ${getBlurAnimationClasses(isTitleVisible)}`}
          >
            Our Services
          </h2>
          <p
            ref={descRef}
            className={`text-white/70 md:w-3/4 lg:w-1/2 font-barlow text-base md:text-lg max-w-4xl mx-auto ${getBlurAnimationClasses(isDescVisible)}`}
            style={{ transitionDelay: "200ms" }}
          >
            Comprehensive AI, blockchain, and analytics solutions powered by
            deep expertise in machine learning and data engineering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const isVisible = isItemVisible(service.id);
            const animation = blurAnimation(isVisible, index, {
              variant: "heavy",
            });

            return (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(service.id, el);
                }}
                className="h-full"
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  image={service.image}
                  imageAlt={service.imageAlt}
                  className={animation.className}
                  style={animation.style}
                  onBookNow={() => handleBookNow(service.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
