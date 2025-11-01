import { useState } from "react";
import { Button } from "./ui/button";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import aiAppImg from "~/assets/ai-app.png";
import mobileAppImg from "~/assets/mobile-app.png";
import algorithmTradingImg from "~/assets/algorithm-trading.png";
import retailEcommerceImg from "~/assets/retail-ecommerce.png";
import customDesignImg from "~/assets/custom-design.png";
import webAppImg from "~/assets/web-app.png";
import { useBlurAnimationList } from "~/hooks/useBlurAnimation";
import { blurAnimation } from "~/lib/animations";

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
  const [mousePosition, setMousePosition] = useState<
    Map<number, { x: number; y: number }>
  >(new Map());

  const { itemRefs, isItemVisible } = useBlurAnimationList(
    services.map((s) => s.id),
    0.1
  );

  const handleMouseMove = (
    serviceId: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition((prev) => new Map(prev).set(serviceId, { x, y }));
  };

  const handleMouseLeave = (serviceId: number) => {
    setMousePosition((prev) => {
      const newMap = new Map(prev);
      newMap.delete(serviceId);
      return newMap;
    });
  };

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-6 lg:py-9">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const isVisible = isItemVisible(service.id);
            const mousePos = mousePosition.get(service.id);
            const animation = blurAnimation(isVisible, index, {
              variant: "heavy",
            });

            return (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(service.id, el);
                }}
                onMouseMove={(e) => handleMouseMove(service.id, e)}
                onMouseLeave={() => handleMouseLeave(service.id)}
                className={`group relative rounded-3xl p-px ease-out ${animation.className}`}
                style={{
                  ...animation.style,
                  background: mousePos
                    ? `radial-gradient(250px circle at ${mousePos.x}% ${mousePos.y}%, rgba(10, 132, 255, 0.9), rgba(44, 43, 43, 1) 100%)`
                    : "linear-gradient(135deg, rgba(44, 43, 43, 1) 0%, rgba(20, 20, 20, 1) 100%)",
                }}
              >
                <div className="relative bg-linear-to-br bg-card-bg rounded-3xl p-6 sm:p-8 overflow-hidden h-full backdrop-blur-sm">
                  <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                    <div className="absolute inset-0 bg-grid-pattern"></div>
                  </div>

                  <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/30 group-hover:scale-125 transition-all duration-700"></div>
                  <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/30 group-hover:scale-125 transition-all duration-700"></div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"></div>


                        <img
                          src={service.image}
                          alt={service.imageAlt}
                          className="relative z-10 w-full h-full object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    <h3 className="text-white font-barlow font-bold text-xl sm:text-2xl mb-4 text-center ">
                      {service.title}
                    </h3>

                    <p className="text-white/70 group-hover:text-white/90 font-barlow text-sm sm:text-base mb-6 text-center leading-relaxed transition-colors duration-500">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8 grow">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-white/80 group-hover:text-white/95 font-barlow text-sm transition-all duration-500 group-hover:translate-x-1"
                          style={{
                            transitionDelay: `${index * 50}ms`,
                          }}
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-500 shrink-0 mt-0.5">
                            <FiCheck className="w-3 h-3 text-blue-500 group-hover:text-blue-400 transition-colors duration-500" />
                          </span>
                          <span className="group-hover:font-medium transition-all duration-500">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-center mt-auto">
                      <button className="group/btn relative overflow-hidden bg-transparent hover:bg-white/5 text-white font-barlow font-semibold text-sm px-6 py-3 rounded-full flex items-center justify-between border border-white/20 hover:border-white/5 transition-all duration-500 min-w-[140px] h-11 cursor-pointer">
                        {/* Text */}
                        <span className="absolute transition-all duration-500 group-hover/btn:translate-x-8">
                          Book Now
                        </span>

                        <span
                          className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-primary transition-all duration-500 
                      -rotate-45 translate-x-19 
                      group-hover/btn:rotate-0
                      group-hover/btn:-translate-x-4.5"
                        >
                          <FiArrowRight className="w-4 h-4 text-white" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
