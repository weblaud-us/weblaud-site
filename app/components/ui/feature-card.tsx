import { BsCheckCircleFill } from "react-icons/bs";

interface FeatureCardProps {
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ title, description, index }: FeatureCardProps) => {
  return (
    <div
      className="group relative"
      style={{
        animation: `blurOut 0.8s ease-out forwards`,
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Floating animation wrapper */}
      <div className="relative h-full group-hover:animate-[float_3s_ease-in-out_infinite]">
        {/* Card - Dark background like reference */}
        <div className="relative h-full bg-card-bg rounded-full aspect-square flex flex-col items-center justify-center p-6 sm:p-9 md:p-10 lg:p-12 xl:p-14 border border-light-black group-hover:border-primary/50 transition-all duration-700 cursor-pointer overflow-visible">
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-full">
            {/* Checkmark Icon - Top with green color */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 mb-1">
              <BsCheckCircleFill className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            </div>

            {/* Title */}
            <h3 className="text-white font-barlow font-bold text-base md:text-lg lg:text-xl xl:text-2xl group-hover:text-primary transition-all duration-300 leading-tight w-full">
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/60 font-barlow text-xs md:text-sm lg:text-base leading-snug lg:leading-relaxed group-hover:text-white/80 transition-all duration-300 px-1 sm:px-2 md:px-3 w-full">
              {description}
            </p>
          </div>

          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-primary/5 transition-opacity duration-700 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export { FeatureCard };
