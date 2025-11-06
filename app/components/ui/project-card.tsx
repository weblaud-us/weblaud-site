import { FiArrowRight } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";

export interface ProjectCardProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  className?: string;
  style?: React.CSSProperties;
  onViewDetails?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  features,
  image,
  imageAlt,
  className = "",
  style,
  onViewDetails,
}) => {
  const truncateTitle = (text: string, maxLength: number = 18) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const shouldTruncate = () => {
    if (typeof window === "undefined") return false;
    const width = window.innerWidth;
    return width < 768 || (width >= 1023 && width <= 1120);
  };

  const displayTitle = shouldTruncate() ? truncateTitle(title) : title;

  return (
    <div
      className={`group cursor-pointer relative bg-card-bg border border-light-black rounded-3xl overflow-hidden hover:border-primary/50 hover:-transition-all duration-500 h-full ${className}`}
      style={style}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 group-hover:rotate-90 transition-all duration-1000"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 group-hover:-rotate-90 transition-all duration-1000"></div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="relative overflow-hidden rounded-t-3xl bg-linear-to-br from-gray-800 to-gray-900">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-48 object-cover group-hover:scale-115 group-hover:rotate-2 group-hover:brightness-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card-bg/60 to-transparent group-hover:from-card-bg/20 transition-colors duration-500"></div>

          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/70 rounded-tr-2xl transition-all duration-500 group-hover:w-20 group-hover:h-20"></div>
          <div
            className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-500/70 rounded-bl-2xl transition-all duration-500 group-hover:w-20 group-hover:h-20"
            style={{ transitionDelay: "100ms" }}
          ></div>
        </div>

        <div className="flex flex-col flex-1 p-6 relative">
          <div className="flex items-start justify-between mb-4 relative">
            <h3 className="text-white font-barlow font-bold text-xl">
              {displayTitle.split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-400 ease-out group-hover:text-primary group-hover:-translate-y-1 group-hover:scale-110"
                  style={{
                    transitionDelay: `${index * 25}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h3>
            <div className="relative shrink-0">
              <span className="absolute sm:block hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100 group-hover:scale-120 transition-all duration-600 pointer-events-none"></span>
              <span
                className="absolute hidden sm:block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary opacity-0 group-hover:opacity-70 group-hover:scale-140 transition-all duration-800 pointer-events-none"
                style={{ transitionDelay: "150ms" }}
              ></span>

              <button
                onClick={onViewDetails}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary transition-all duration-500 overflow-hidden"
                aria-label="View project details"
              >
                <FiArrowRight className="absolute w-5 h-5 text-primary group-hover:text-white transition-all duration-500 -rotate-45 ease-out group-hover:translate-x-8 group-hover:-translate-y-8 group-hover:opacity-0" />

                <FiArrowRight className="absolute w-5 h-5 text-primary group-hover:text-white transition-all duration-600 ease-out -translate-x-8 translate-y-8 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 -rotate-45 group-hover:opacity-100" />
              </button>
            </div>
          </div>

          <p className="text-white/70 group-hover:text-white/90 font-barlow text-sm leading-relaxed mb-4 transition-all duration-300 group-hover:tracking-wide">
            {description}
          </p>

          <ul className="space-y-2.5 mt-auto relative">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-white/70 group-hover:text-white/95 font-barlow text-sm transition-all duration-500 group-hover:translate-x-3 relative"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <BsCheckCircle
                  className="relative w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-130 group-hover:rotate-360 transition-all duration-500 "
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
                <span className="relative group-hover:font-semibold transition-all duration-500 group-hover:text-white">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/0 group-hover:via-primary/50 to-transparent transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};
