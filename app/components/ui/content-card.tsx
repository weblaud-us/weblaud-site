interface ContentCardProps {
  badge: string;
  title: string;
  paragraphs: string[];
  number: string;
  variant: "blue" | "purple";
  position: "left" | "right";
}

export const ContentCard = ({
  badge,
  title,
  paragraphs,
  number,
  variant,
  position,
}: ContentCardProps) => {
  const colors = {
    blue: {
      line: "from-blue-400",
      dot: "bg-blue-400",
      gradient: "from-blue-500/15 via-purple-500/5",
      border: "border-blue-400/40",
      badge: "text-blue-400 border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      numberGradient: "from-blue-500/20",
      titleGradient: "from-white via-blue-200 to-purple-200",
      paragraphBorder: "border-blue-400/20 hover:border-blue-400/50",
      hoverBorder: "hover:border-blue-400/30",
      hoverShadow: "hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]",
      dotGradient: "from-blue-400",
    },
    purple: {
      line: "from-purple-400",
      dot: "bg-purple-400",
      gradient: "from-purple-500/15 via-blue-500/5",
      border: "border-purple-400/40",
      badge: "text-purple-400 border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      numberGradient: "from-purple-500/20",
      titleGradient: "from-white via-purple-200 to-blue-200",
      paragraphBorder: "border-purple-400/20 hover:border-purple-400/50",
      hoverBorder: "hover:border-purple-400/30",
      hoverShadow: "hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]",
      dotGradient: "from-purple-400",
    },
  };

  const color = colors[variant];
  const isLeft = position === "left";

  return (
    <div className="space-y-6 relative group">
      
    
      <div
        className={`relative p-7 sm:p-10 rounded-3xl bg-linear-to-br ${color.gradient} to-transparent border border-white/10 `}
      >
        <div
          className={`absolute ${isLeft ? "top-0 left-0" : "top-0 right-0"} w-16 h-16 ${isLeft ? "border-t-2 border-l-2 rounded-tl-3xl" : "border-t-2 border-r-2 rounded-tr-3xl"} ${color.border}`}
        ></div>
        <div
          className={`absolute ${isLeft ? "bottom-0 right-0" : "bottom-0 left-0"} w-16 h-16 ${isLeft ? "border-b-2 border-r-2 rounded-br-3xl" : "border-b-2 border-l-2 rounded-bl-3xl"} ${color.border}`}
        ></div>

        <div
          className={`absolute -top-6 ${isLeft ? "left-8" : "right-8"} inline-block`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-widest bg-black px-4 py-2 rounded-full border ${color.badge}`}
          >
            {badge}
          </span>
        </div>


        <h2
          className={`text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r ${color.titleGradient} bg-clip-text text-transparent font-barlow relative z-10`}
        >
          {title}
        </h2>
        <div className="space-y-4 relative z-10">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-gray-300 leading-relaxed text-xs sm:text-base transition-colors duration-300`}
            >
              {paragraph}
            </p>
          ))}
        </div>
        
      </div>
    </div>
  );
};
