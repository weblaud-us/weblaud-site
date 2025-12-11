import { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  className?: string;
  style?: React.CSSProperties;
  onBookNow?: () => void;
  href?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  features,
  image,
  imageAlt,
  className = "",
  style,
  onBookNow,
  href,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-3xl p-px ease-out h-full ${className}`}
      style={{
        ...style,
        background: mousePos
          ? `radial-gradient(250px circle at ${mousePos.x}% ${mousePos.y}%, rgba(10, 132, 255, 0.9), rgba(44, 43, 43, 1) 100%)`
          : "linear-gradient(135deg, rgba(44, 43, 43, 1) 0%, rgba(20, 20, 20, 1) 100%)",
      }}
    >
      <div className="relative bg-linear-to-br bg-card-bg rounded-3xl p-6 sm:p-8 overflow-hidden h-full backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>

        <div className="absolute -top-24 -right-24 w-56 h-56 bg-card-bg rounded-full blur-3xl group-hover:bg-blue-500/20 group-hover:scale-125 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-card-bg rounded-full blur-3xl group-hover:bg-primary/20 group-hover:scale-125 transition-all duration-700"></div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"></div>
              <img
                src={image}
                alt={imageAlt}
                className="relative z-10 w-full h-full object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 drop-shadow-2xl"
              />
            </div>
          </div>

          <h3 className="text-white font-barlow font-bold text-xl sm:text-2xl mb-4 text-center">
            {title}
          </h3>

          <p className="text-white/70 group-hover:text-white/90 font-barlow text-sm sm:text-base mb-6 text-center leading-relaxed transition-colors duration-500">
            {description}
          </p>

          <ul className="space-y-3 mb-8 grow">
            {features.map((feature, index) => (
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
            <button
              onClick={onBookNow || (() => href && window.open(href, "_blank"))}
              className="group/btn relative overflow-hidden bg-transparent hover:bg-white/5 text-white font-barlow font-semibold text-sm px-6 py-3 rounded-full flex items-center justify-between border border-white/20 hover:border-white/5 transition-all duration-500 min-w-[140px] h-11 cursor-pointer"
            >
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
};
