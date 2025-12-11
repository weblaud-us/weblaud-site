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
      <div className="absolute -inset-4 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-700 scale-75 group-hover:scale-125"></div>

      <div className="absolute -inset-2 rounded-full bg-linear-to-r from-primary/20 via-blue-500/20 to-primary/20 opacity-0 group-hover:opacity-60 blur-2xl transition-all duration-700 scale-80 group-hover:scale-115"></div>

      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 blur-2xl transition-all duration-700 scale-90 group-hover:scale-110"></div>

      <div className="relative h-full group-hover:animate-[float_3s_ease-in-out_infinite]">
        <div className="relative h-full bg-linear-to-br from-card-bg via-card-bg to-[#0a0a0a] rounded-full aspect-square flex flex-col items-center justify-center p-6 sm:p-9 md:p-10 lg:p-12 xl:p-14 border-2 border-light-black/50 group-hover:border-primary/60 transition-all duration-700 cursor-pointer overflow-visible shadow-2xl group-hover:shadow-primary/20">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-full">
            <div className="relative mb-1">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 bg-linear-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-50 transition-all duration-500 shadow-lg shadow-primary/20">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <BsCheckCircleFill className="relative w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-primary group-hover:text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" />
              </div>
            </div>

            <h3 className="text-white font-barlow font-bold text-base md:text-lg lg:text-xl xl:text-2xl group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-tight w-full">
              {title}
            </h3>

            <p className="text-gray-400 font-barlow text-xs md:text-sm lg:text-base leading-relaxed lg:leading-relaxed group-hover:text-gray-300 transition-all duration-300 px-1 sm:px-2 md:px-3 w-full">
              {description}
            </p>
          </div>

          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FeatureCard };
