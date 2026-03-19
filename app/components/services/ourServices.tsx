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
import { ServiceCard } from "../ui/service-card";
import { BOOKING_URL } from "~/lib/constants";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { useState } from "react";

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
    title: "AI Mobile App Design & Development",
    description:
      "We design and develop intelligent mobile applications powered by AI and machine learning. From concept to deployment, we build apps that learn, adapt, and deliver personalized experiences across iOS and Android platforms.",
    features: [
      "AI-powered recommendation engines",
      "On-device machine learning (Core ML / TensorFlow Lite)",
      "Natural language processing features",
      "Predictive UX and smart personalization",
      "Cross-platform (React Native / Flutter)",
    ],
    image: aiAppImg,
    imageAlt: "AI Mobile App Development",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description:
      "We build high-performance native and cross-platform mobile applications that users love. From MVP to enterprise-grade apps, we deliver polished, scalable mobile solutions for iOS and Android with seamless user experiences.",
    features: [
      "iOS and Android native development",
      "React Native & Flutter cross-platform",
      "Offline-first architecture",
      "Push notifications & real-time updates",
      "App Store & Play Store deployment",
    ],
    image: mobileAppImg,
    imageAlt: "Mobile App Development",
  },
  {
    id: 3,
    title: "Algorithmic Trading",
    description:
      "We build advanced algorithmic trading systems powered by machine learning for automated market analysis and execution. From strategy development to live deployment, we create robust, high-performance trading solutions.",
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
      "We build and optimize e-commerce platforms that drive revenue. From custom storefronts to AI-powered personalization and inventory management, we help retail businesses scale online with data-driven digital solutions.",
    features: [
      "Custom e-commerce platform development",
      "AI-powered product recommendations",
      "Inventory & order management systems",
      "Conversion rate optimization (CRO)",
      "Payment gateway integrations",
    ],
    image: retailEcommerceImg,
    imageAlt: "Retail & E-commerce",
  },
  {
    id: 5,
    title: "Custom Website Design & Development",
    description:
      "We design and build stunning, high-performance websites that reflect your brand and convert visitors into customers. Every site we create is custom-built, mobile-responsive, SEO-optimized, and crafted for measurable results.",
    features: [
      "Custom UI/UX design",
      "Responsive & mobile-first development",
      "SEO-optimized architecture",
      "CMS integration (Sanity, Contentful, WordPress)",
      "Performance & Core Web Vitals optimization",
    ],
    image: customDesignImg,
    imageAlt: "Custom Website Design & Development",
  },
  {
    id: 6,
    title: "Custom Mobile App & Website Development",
    description:
      "We deliver end-to-end digital product development — from custom websites to fully-featured mobile apps. Our team handles everything from architecture and design to development, testing, and post-launch support.",
    features: [
      "Full-stack web & mobile development",
      "API design & third-party integrations",
      "CI/CD pipeline setup",
      "DevOps & cloud infrastructure",
      "Ongoing maintenance & scaling",
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-6 lg:py-15">
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
                  onBookNow={handleBookNow}
                />
              </div>
            );
          })}
        </div>
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default OurServices;
